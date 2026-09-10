import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import ts from "typescript";

// Test the actual server modules without bundling or installing a test runner.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return {
        url: pathToFileURL(resolve("src", specifier.slice(2) + ".ts")).href,
        shortCircuit: true,
      };
    }
    if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
      const url = new URL(specifier + ".ts", context.parentURL);
      if (existsSync(fileURLToPath(url)))
        return { url: url.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (
      url.startsWith("file:") &&
      url.endsWith(".ts") &&
      !url.includes("node_modules")
    ) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
      };
    }
    return next(url, context);
  },
});
const { requestSchema, intakeConfiguration, storeRequest, secureEndpoint } =
  await import("../src/lib/intake.ts");
const { MockProvider, HttpProvider } = await import("../src/lib/api.ts");
const { legalSource } = await import("../src/lib/legal.ts");
const { POST } = await import("../src/app/api/waitlist/route.ts");
let assertions = 0;
function check(value, message) {
  assert.ok(value, message);
  assertions++;
}
const valid = {
  intent: "waitlist",
  requestId: "d3c57a74-9b3b-4f45-a22f-08dbde73c4df",
  email: "test@example.invalid",
  requestConsent: true,
  productUpdatesConsent: false,
  website: "",
  noticeVersion: "review-1",
  consentVersion: "review-1",
};
check(requestSchema.safeParse(valid).success, "Valid waitlist");
for (const change of [
  { email: "bad" },
  { requestConsent: false },
  { website: "bot" },
  { intent: "pilot" },
  { role: "unknown" },
  { requestId: "bad" },
  { name: "x".repeat(101) },
]) {
  check(
    !requestSchema.safeParse({ ...valid, ...change }).success,
    `Reject ${Object.keys(change)[0]}`,
  );
}
check(
  requestSchema.safeParse({
    ...valid,
    intent: "pilot",
    workflow: "Review filing evidence",
  }).success,
  "Valid pilot",
);
check(
  !("workflow" in requestSchema.parse({ ...valid, workflow: "discard" })),
  "Waitlist excludes pilot-only data",
);
for (const url of [
  "http://example.invalid",
  "https://user:secret@example.invalid",
  "bad",
  "https://example.invalid/#fragment",
])
  check(!secureEndpoint(url), "Unsafe endpoint");
check(!intakeConfiguration().enabled, "Default closed");
const receipt = await storeRequest(
  { ...valid, receivedAt: new Date().toISOString() },
  "https://sink.example.invalid",
  async (_, init) => {
    check(
      init.headers["Idempotency-Key"] === valid.requestId,
      "Idempotency key",
    );
    return Response.json({ stored: true, requestId: valid.requestId });
  },
);
check(receipt.stored, "Receipt acknowledged");
for (const data of [
  {},
  { stored: false },
  { stored: true, requestId: "019646c1-aa44-7fcc-aead-741126cb56f8" },
]) {
  await assert.rejects(() =>
    storeRequest(valid, "https://sink.example.invalid", async () =>
      Response.json(data),
    ),
  );
  assertions++;
}
const mock = new MockProvider();
check(
  (await mock.compliancePack()).answers[0].status === "abstained",
  "Mock abstains",
);
check((await mock.health()).status === "mock", "Mock labelled");
const bad = new HttpProvider(
  "https://api.example.invalid",
  undefined,
  async () =>
    Response.json({
      answers: [{ status: "answered", statement: "Unsupported" }],
    }),
);
check(
  (await bad.compliancePack({})).answers[0].status === "abstained",
  "Malformed backend abstains",
);
check(
  (await bad.health()).status === "unavailable",
  "Malformed health unavailable",
);
await assert.rejects(() => bad.events("A".repeat(21)));
assertions++;
await assert.rejects(() => bad.standing("invalid"));
assertions++;
const originalFetch = globalThis.fetch;
try {
  check(
    (
      await POST(
        new Request("https://site.example.invalid/api/waitlist", {
          method: "POST",
        }),
      )
    ).status === 503,
    "Route closed",
  );
  const details = Object.fromEntries(
    ["privacy", "terms", "cookies"].flatMap((kind) =>
      [...legalSource(kind).matchAll(/\{\{([A-Z_]+)\}\}/g)].map((match) => [
        match[1],
        "Test fixture only",
      ]),
    ),
  );
  details.PRIVACY_NOTICE_VERSION = "review-1";
  Object.assign(process.env, {
    SITE_ORIGIN: "https://site.example.invalid",
    WAITLIST_ENABLED: "true",
    WAITLIST_SINK_URL: "https://sink.example.invalid",
    LEGAL_REVIEW_CONFIRMED: "true",
    LEGAL_DETAILS_JSON: JSON.stringify(details),
    PRIVACY_NOTICE_VERSION: "review-1",
    CONSENT_VERSION: "review-1",
  });
  check(intakeConfiguration().enabled, "Complete test configuration enables");
  const request = (
    data,
    origin = "https://site.example.invalid",
    contentType = "application/json",
  ) =>
    new Request("https://site.example.invalid/api/waitlist", {
      method: "POST",
      headers: { origin, "Content-Type": contentType },
      body: typeof data === "string" ? data : JSON.stringify(data),
    });
  check(
    (await POST(request(valid, "https://elsewhere.example.invalid"))).status ===
      403,
    "Cross-origin rejected",
  );
  check(
    (await POST(request(valid, undefined, "text/plain"))).status === 415,
    "Content type rejected",
  );
  check(
    (await POST(request("x".repeat(8193)))).status === 413,
    "Oversized request rejected",
  );
  check(
    (await POST(request({ ...valid, requestConsent: false }))).status === 400,
    "Consent required at route",
  );
  check(
    (await POST(request({ ...valid, noticeVersion: "stale" }))).status === 409,
    "Stale notice rejected",
  );
  globalThis.fetch = async () => Response.json({});
  check(
    (await POST(request(valid))).status === 502,
    "Unconfirmed sink cannot succeed",
  );
  globalThis.fetch = async () =>
    Response.json({ stored: true, requestId: valid.requestId });
  const stored = await POST(request(valid));
  check(
    stored.status === 200 && (await stored.json()).stored === true,
    "Confirmed storage succeeds",
  );
  process.env.PRIVACY_NOTICE_VERSION = "different";
  check(
    !intakeConfiguration().enabled,
    "Published notice mismatch closes intake",
  );
} finally {
  globalThis.fetch = originalFetch;
}
console.log(
  `${assertions} contract assertions passed. No external requests were sent.`,
);
