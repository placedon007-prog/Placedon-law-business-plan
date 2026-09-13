import { z } from "zod";

const evidenceSchema = z.object({
  source: z.url(),
  quote: z.string().trim().min(1),
  instrument: z.string().trim().min(1),
  operative_date: z.iso.date(),
  as_of: z.iso.date(),
});
const answerSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("abstained"), reason: z.string().min(1) }),
  z.object({
    status: z.literal("answered"),
    classification: z.enum([
      "verified_fact",
      "deterministic_conclusion",
      "predictive_signal",
    ]),
    statement: z.string().min(1),
    evidence: evidenceSchema,
    assumptions: z.array(z.string()).default([]),
  }),
]);
export const compliancePackSchema = z.object({
  answers: z.array(answerSchema).min(1),
});
const standingSchema = z.object({ cin: z.string(), answer: answerSchema });
const eventSchema = z.object({
  cin: z.string(),
  events: z.array(
    z.object({
      date: z.iso.date(),
      kind: z.enum(["law_change", "company_event"]),
      answer: answerSchema,
    }),
  ),
});
export type Answer = z.infer<typeof answerSchema>;
export type CompliancePack = z.infer<typeof compliancePackSchema>;
export type Standing = z.infer<typeof standingSchema>;
export type CompanyEvents = z.infer<typeof eventSchema>;
export interface ComplianceQuery {
  question: string;
  as_of: string;
  facts: Record<string, string | number | boolean>;
}
export interface ApiProvider {
  compliancePack(query: ComplianceQuery): Promise<CompliancePack>;
  standing(cin: string): Promise<Standing>;
  events(cin: string): Promise<CompanyEvents>;
  health(): Promise<{ status: "available" | "unavailable" | "mock" }>;
}
const abstention: Answer = {
  status: "abstained",
  reason:
    "The official evidence required for this answer has not been verified.",
};
/** No fabricated legal output: every mock answer is an explicit abstention. */
export class MockProvider implements ApiProvider {
  async compliancePack(): Promise<CompliancePack> {
    return { answers: [abstention] };
  }
  async standing(cin: string): Promise<Standing> {
    return { cin, answer: abstention };
  }
  async events(cin: string): Promise<CompanyEvents> {
    return { cin, events: [] };
  }
  async health() {
    return { status: "mock" as const };
  }
}
function companyId(cin: string) {
  if (!/^[A-Z0-9]{21}$/.test(cin))
    throw new Error("A valid company identifier is required");
  return encodeURIComponent(cin);
}
/** Explicit wire adapter; reconcile envelope fields with backend OpenAPI before enabling. */
export class HttpProvider implements ApiProvider {
  private origin: string;
  constructor(
    origin: string,
    private token?: string,
    private fetcher: typeof fetch = fetch,
  ) {
    const url = new URL(origin);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error("Provide an HTTPS API origin");
    this.origin = url.origin;
  }
  private async request(path: string, body?: unknown): Promise<unknown> {
    const response = await this.fetcher(new URL(path, this.origin), {
      method: body ? "POST" : "GET",
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("The evidence service is unavailable");
    return response.json();
  }
  async compliancePack(query: ComplianceQuery): Promise<CompliancePack> {
    try {
      return compliancePackSchema.parse(
        await this.request("/v1/compliance-pack", query),
      );
    } catch {
      return { answers: [abstention] };
    }
  }
  async standing(cin: string): Promise<Standing> {
    const id = companyId(cin);
    try {
      const result = standingSchema.parse(
        await this.request(`/v1/company/${id}/standing`),
      );
      if (result.cin !== cin) throw new Error("Company record mismatch");
      return result;
    } catch {
      return { cin, answer: abstention };
    }
  }
  async events(cin: string): Promise<CompanyEvents> {
    const id = companyId(cin);
    const result = eventSchema.parse(
      await this.request(`/v1/company/${id}/events`),
    );
    if (result.cin !== cin) throw new Error("Company record mismatch");
    return result;
  }
  async health() {
    try {
      const data = await this.request("/v1/health");
      z.object({ status: z.literal("ok") }).parse(data);
      return { status: "available" as const };
    } catch {
      return { status: "unavailable" as const };
    }
  }
}
