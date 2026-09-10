import {
  intakeConfiguration,
  requestSchema,
  storeRequest,
  secureEndpoint,
} from "@/lib/intake";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
const reply = (body: object, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const config = intakeConfiguration();
  if (!config.enabled || !config.sink)
    return reply({ error: "unavailable" }, 503);
  if (request.headers.get("origin") !== config.origin)
    return reply({ error: "rejected" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "validation" }, 415);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  if (attempts.size > 1000) attempts.clear();
  const attempt = attempts.get(ip) ?? { count: 0, expires: now + 600000 };
  attempt.count++;
  attempts.set(ip, attempt);
  if (attempt.count > 10)
    return Response.json(
      { error: "rateLimited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((attempt.expires - now) / 1000)),
          "Cache-Control": "no-store",
        },
      },
    );
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "validation" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8192) {
        await reader.cancel();
        return reply({ error: "validation" }, 413);
      }
      chunks.push(value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply({ error: "validation" }, 400);
  }
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success)
    return reply(
      {
        error: "validation",
        fields: [
          ...new Set(
            parsed.error.issues.map((issue) => String(issue.path[0] ?? "form")),
          ),
        ],
      },
      400,
    );
  if (
    parsed.data.noticeVersion !== config.noticeVersion ||
    parsed.data.consentVersion !== config.consentVersion
  )
    return reply({ error: "consentRequired" }, 409);
  try {
    const receipt = await storeRequest(
      { ...parsed.data, receivedAt: new Date().toISOString() },
      config.sink,
    );
    let emailStatus: "not_configured" | "sent" | "failed" = "not_configured";
    const emailHook = secureEndpoint(process.env.CONFIRMATION_HOOK_URL);
    if (emailHook && !receipt.duplicate) {
      try {
        const response = await fetch(emailHook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": parsed.data.requestId,
            ...(process.env.CONFIRMATION_HOOK_TOKEN
              ? {
                  Authorization: `Bearer ${process.env.CONFIRMATION_HOOK_TOKEN}`,
                }
              : {}),
          },
          body: JSON.stringify({
            requestId: parsed.data.requestId,
            email: parsed.data.email,
            intent: parsed.data.intent,
          }),
          signal: AbortSignal.timeout(5000),
          redirect: "error",
        });
        const confirmation: unknown = response.ok
          ? await response.json()
          : null;
        emailStatus =
          confirmation &&
          typeof confirmation === "object" &&
          "sent" in confirmation &&
          confirmation.sent === true &&
          "requestId" in confirmation &&
          confirmation.requestId === parsed.data.requestId
            ? "sent"
            : "failed";
      } catch {
        emailStatus = "failed";
      }
    }
    return reply(
      {
        stored: true,
        requestId: receipt.requestId,
        duplicate: receipt.duplicate ?? false,
        emailStatus,
      },
      200,
    );
  } catch {
    return reply({ error: "storageFailure" }, 502);
  }
}
