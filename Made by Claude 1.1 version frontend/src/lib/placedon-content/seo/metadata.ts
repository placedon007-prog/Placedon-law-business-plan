import type { SiteRoute } from "../content/types";

export interface RouteMetadataCopy {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: SiteRoute;
  readonly indexable: boolean;
}

/** Domain-independent copy. Pass the confirmed public origin to buildMetadata. */
export const routeMetadata = {
  "/": {
    title: "Placedon | Indian Corporate Law, With Its Authority",
    description:
      "Placedon is being built for Indian corporate law: provision, instrument, operative date, or abstention. Pre-launch. Request a pilot.",
    canonicalPath: "/",
    indexable: true,
  },
  "/how-it-works": {
    title: "How Verification Is Intended to Work | Placedon",
    description:
      "Read Placedon's intended method: check the provision, instrument, and operative date, then cite or abstain. Pre-launch product concept.",
    canonicalPath: "/how-it-works",
    indexable: true,
  },
  "/product": {
    title: "Companies Act Evidence Records: Product Concept | Placedon",
    description:
      "Explore Placedon's planned Companies Act, 2013 evidence record, statutory currency view, company-standing check, and abstain state.",
    canonicalPath: "/product",
    indexable: true,
  },
  "/pricing": {
    title: "Pilot Participation and Pre-launch Pricing | Placedon",
    description:
      "Placedon pricing is being finalised with design partners. Review pilot participation and the free waitlist; no subscription tariff is published.",
    canonicalPath: "/pricing",
    indexable: true,
  },
  "/security": {
    title: "Data Handling and Source Discipline | Placedon",
    description:
      "Read Placedon's proposed data-handling and official-source requirements. Pre-launch; no production audit, certification, or hosting guarantee claimed.",
    canonicalPath: "/security",
    indexable: true,
  },
  "/faq": {
    title: "Scope, Abstention, Privacy and Access: FAQ | Placedon",
    description:
      "Questions about Placedon's scope, abstention, accuracy limits, privacy, pricing, access, and intended differences from ChatGPT and Harvey.",
    canonicalPath: "/faq",
    indexable: true,
  },
  "/about": {
    title: "About Placedon | A Witness, Not a Tool",
    description:
      "Why Placedon is being built around a citable statutory basis: the provision, instrument, operative date, and a stated refusal when evidence is missing.",
    canonicalPath: "/about",
    indexable: true,
  },
  "/waitlist": {
    title: "Join the Waitlist or Request a Pilot | Placedon",
    description:
      "Register interest in Placedon or describe a corporate compliance workflow for pilot review. Pre-launch; no access or launch date is promised.",
    canonicalPath: "/waitlist",
    indexable: true,
  },
  "/privacy": {
    title: "Privacy Policy — Counsel-review Template | Placedon",
    description:
      "Proposed Placedon privacy notice: form data, purposes, retention, providers, consent, and rights. Template for counsel review; not legal advice.",
    canonicalPath: "/privacy",
    indexable: false,
  },
  "/terms": {
    title: "Website Terms — Counsel-review Template | Placedon",
    description:
      "Proposed terms for Placedon's pre-launch site: enquiries, product concepts, reliance, and liability limits. For counsel review; not legal advice.",
    canonicalPath: "/terms",
    indexable: false,
  },
  "/cookies": {
    title: "Cookies and Data Collection — Template | Placedon",
    description:
      "Planned cookie choices and data collection for Placedon. Optional analytics off by default. Template for counsel review; not legal advice.",
    canonicalPath: "/cookies",
    indexable: false,
  },
  "/404": {
    title: "Page Not Found | Placedon",
    description:
      "This Placedon page is not available. Return home to find the current product information, FAQ, and pilot or waitlist form.",
    canonicalPath: "/404",
    indexable: false,
  },
  "/thank-you": {
    title: "Request Status | Placedon",
    description:
      "Check the confirmation of a Placedon waitlist or pilot request. Opening this page alone does not confirm that a request was recorded.",
    canonicalPath: "/thank-you",
    indexable: false,
  },
} as const satisfies Record<SiteRoute, RouteMetadataCopy>;

export const seoImage = {
  path: "/og/placedon.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Placedon wordmark and evidence mark. Indian corporate law: provision, instrument, operative date. Pre-launch.",
} as const;

export interface SeoConfiguration {
  /** The confirmed canonical HTTPS origin; no assumed domain is supplied. */
  readonly origin: string;
  /** Set true only on the reviewed public deployment, never on a preview. */
  readonly publicationReady?: boolean;
}

export function canonicalOrigin(origin: string): string {
  const parsed = new URL(origin);
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  ) {
    throw new Error(
      "Provide a confirmed HTTPS origin without credentials, a path, a query, or a fragment.",
    );
  }
  return parsed.origin;
}

export function canonicalUrl(origin: string, route: SiteRoute): string {
  return new URL(route, canonicalOrigin(origin)).href;
}

/** Framework-independent shape suitable for a Next.js metadata export. */
export function metadataForRoute(
  route: SiteRoute,
  configuration: SeoConfiguration,
) {
  const copy = routeMetadata[route];
  const origin = canonicalOrigin(configuration.origin);
  const url = canonicalUrl(origin, copy.canonicalPath);
  const image = { ...seoImage, url: new URL(seoImage.path, origin).href };
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: url },
    robots: {
      index: configuration.publicationReady === true && copy.indexable,
      follow: true,
    },
    openGraph: {
      type: "website" as const,
      locale: "en_IN",
      siteName: "Placedon",
      title: copy.title,
      description: copy.description,
      url,
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          type: image.type,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: copy.title,
      description: copy.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export function buildMetadata(configuration: SeoConfiguration) {
  return Object.fromEntries(
    (Object.keys(routeMetadata) as SiteRoute[]).map((route) => [
      route,
      metadataForRoute(route, configuration),
    ]),
  ) as Record<SiteRoute, ReturnType<typeof metadataForRoute>>;
}

/** Feed these records to the builder's sitemap route; do not invent lastModified. */
export function buildSitemapEntries(configuration: SeoConfiguration) {
  if (configuration.publicationReady !== true) return [];
  return (Object.keys(routeMetadata) as SiteRoute[])
    .filter((route) => routeMetadata[route].indexable)
    .map((route) => ({ url: canonicalUrl(configuration.origin, route) }));
}

/** This controls crawl discovery, not access or collection of personal data. */
export function buildRobots(configuration: SeoConfiguration) {
  const origin = canonicalOrigin(configuration.origin);
  if (configuration.publicationReady !== true) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: new URL("/sitemap.xml", origin).href,
  };
}
