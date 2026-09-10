import { z } from "zod";
import { legalReady, legalDetails } from "./legal";
import { siteOrigin } from "./site";
const roles = [
  "",
  "corporate-lawyer",
  "in-house-counsel",
  "company-secretary",
  "chartered-accountant",
  "founder-operator",
  "other",
  "prefer-not-to-say",
] as const;
const common = {
  requestId: z.uuid(),
  email: z.email().max(254),
  name: z.string().trim().max(100).default(""),
  organisation: z.string().trim().max(160).default(""),
  role: z.enum(roles).default(""),
  requestConsent: z.literal(true),
  productUpdatesConsent: z.boolean().default(false),
  website: z.literal(""),
  noticeVersion: z.string().min(1).max(100),
  consentVersion: z.string().min(1).max(100),
};
export const requestSchema = z.discriminatedUnion("intent", [
  z.object({ ...common, intent: z.literal("waitlist") }).strip(),
  z
    .object({
      ...common,
      intent: z.literal("pilot"),
      workflow: z.string().trim().min(1).max(1200),
    })
    .strip(),
]);
export type InterestRequest = z.infer<typeof requestSchema>;
export function secureEndpoint(value: string | undefined): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.hash)
      return;
    return url.href;
  } catch {
    return;
  }
}
export function intakeConfiguration() {
  const origin = siteOrigin();
  const sink = secureEndpoint(process.env.WAITLIST_SINK_URL);
  const noticeVersion = process.env.PRIVACY_NOTICE_VERSION ?? "";
  const consentVersion = process.env.CONSENT_VERSION ?? "";
  const enabled =
    process.env.WAITLIST_ENABLED === "true" &&
    !!origin &&
    !!sink &&
    legalReady() &&
    !!noticeVersion &&
    legalDetails().PRIVACY_NOTICE_VERSION === noticeVersion &&
    !!consentVersion &&
    !/draft/i.test(noticeVersion + consentVersion);
  return { enabled, origin, sink, noticeVersion, consentVersion };
}
export type StoredRequest = InterestRequest & { receivedAt: string };
export interface SinkReceipt {
  stored: true;
  requestId: string;
  duplicate?: boolean;
}
export async function storeRequest(
  request: StoredRequest,
  endpoint: string,
  fetcher: typeof fetch = fetch,
): Promise<SinkReceipt> {
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": request.requestId,
      ...(process.env.WAITLIST_SINK_TOKEN
        ? { Authorization: `Bearer ${process.env.WAITLIST_SINK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(request),
    redirect: "error",
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Storage did not confirm receipt");
  const receipt = z
    .object({
      stored: z.literal(true),
      requestId: z.uuid(),
      duplicate: z.boolean().optional(),
    })
    .parse(await response.json());
  if (receipt.requestId !== request.requestId)
    throw new Error("Storage reference mismatch");
  return receipt;
}
