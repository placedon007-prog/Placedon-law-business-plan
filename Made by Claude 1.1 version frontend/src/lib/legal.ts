import { readFileSync } from "node:fs";
import { join } from "node:path";

export const legalFiles = {
  privacy: "privacy-policy.md",
  terms: "terms.md",
  cookies: "cookie-consent.md",
} as const;
export type LegalKind = keyof typeof legalFiles;
export function legalSource(kind: LegalKind) {
  return readFileSync(
    join(process.cwd(), "src/lib/placedon-content/legal", legalFiles[kind]),
    "utf8",
  );
}
export function legalDetails(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(process.env.LEGAL_DETAILS_JSON ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === "string" && entry[1].trim().length > 0,
      ),
    );
  } catch {
    return {};
  }
}
export function legalReady() {
  if (process.env.LEGAL_REVIEW_CONFIRMED !== "true") return false;
  const values = legalDetails();
  const tokens = Object.keys(legalFiles).flatMap((kind) =>
    [...legalSource(kind as LegalKind).matchAll(/\{\{([A-Z_]+)\}\}/g)].map(
      (match) => match[1],
    ),
  );
  return tokens.every(
    (token) => values[token] && !/[{}<>\n\r]/.test(values[token]),
  );
}
export function legalDocument(kind: LegalKind) {
  const values = legalDetails();
  return legalSource(kind).replace(
    /\{\{([A-Z_]+)\}\}/g,
    (_, key: string) =>
      values[key]?.replace(/[<>\n\r]/g, "") ?? "Details awaiting review",
  );
}
