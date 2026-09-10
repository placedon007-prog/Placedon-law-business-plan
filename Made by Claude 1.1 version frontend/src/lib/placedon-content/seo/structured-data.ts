import { faqEntries } from "../content/faq";
import { canonicalOrigin, canonicalUrl } from "./metadata";
import type { SiteRoute } from "../content/types";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export interface StructuredDataConfiguration {
  readonly origin: string;
  /** Supply only after the builder has rendered and checked the actual logo asset. */
  readonly logoPath?: `/${string}`;
}

/** These are descriptive entities for a pre-launch project, not sale listings. */
export function buildStructuredData(
  configuration: StructuredDataConfiguration,
) {
  const origin = canonicalOrigin(configuration.origin);
  const homeUrl = canonicalUrl(origin, "/");
  const organisationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const productUrl = canonicalUrl(origin, "/product");
  const faqUrl = canonicalUrl(origin, "/faq");

  let logo: { logo: string } | Record<string, never> = {};
  if (configuration.logoPath !== undefined) {
    const resolved = new URL(configuration.logoPath, origin);
    if (
      !configuration.logoPath.startsWith("/") ||
      resolved.origin !== origin ||
      resolved.search ||
      resolved.hash
    ) {
      throw new Error(
        "The logo must be a confirmed same-origin asset path without a query or fragment.",
      );
    }
    logo = { logo: resolved.href };
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organisationId,
    name: "Placedon",
    url: homeUrl,
    description:
      "A pre-launch project developing an evidence record for Indian corporate law. No complete corpus or production performance record is claimed.",
    ...logo,
  } as const;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: "Placedon",
    url: homeUrl,
    inLanguage: "en-IN",
    description:
      "Pre-launch information, product concepts, and expressions of interest for Placedon.",
    publisher: { "@id": organisationId },
  } as const;

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${faqUrl}#faq`,
    url: faqUrl,
    name: "Placedon: scope, evidence, privacy, and access",
    inLanguage: "en-IN",
    isPartOf: { "@id": websiteId },
    mainEntity: faqEntries.map((entry) => ({
      "@type": "Question" as const,
      "@id": `${faqUrl}#${entry.id}`,
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: entry.answer.join(" "),
      },
    })),
  } as const;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${productUrl}#application`,
    name: "Placedon",
    url: productUrl,
    applicationCategory: "BusinessApplication",
    creativeWorkStatus: "In development",
    description:
      "Pre-launch product concept for Companies Act, 2013 evidence records. Intended answers identify the provision, instrument, and operative date, or abstain. Not a live service or legal advice.",
    publisher: { "@id": organisationId },
    featureList: [
      "Intended statutory evidence record",
      "Planned statutory currency view",
      "Planned company-standing and event views",
      "Intended abstention when evidence cannot be verified",
    ],
  } as const;

  return {
    organization,
    website,
    faqPage,
    softwareApplication,
  } satisfies Record<string, JsonValue>;
}

/** Emit FAQ content only where the full matching questions and answers are visible. */
export function structuredDataForRoute(
  route: SiteRoute,
  configuration: StructuredDataConfiguration,
): readonly JsonValue[] {
  const entities = buildStructuredData(configuration);
  if (route === "/") return [entities.organization, entities.website];
  if (route === "/faq")
    return [entities.organization, entities.website, entities.faqPage];
  if (route === "/product")
    return [
      entities.organization,
      entities.website,
      entities.softwareApplication,
    ];
  return [];
}

/** Use as JSON-LD script text; protects the HTML script boundary. */
export function serializeJsonLd(value: JsonValue): string {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
