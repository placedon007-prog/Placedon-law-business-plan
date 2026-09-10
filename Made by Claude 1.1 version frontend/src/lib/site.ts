import type { Metadata } from "next";
import type { SiteRoute } from "./placedon-content/content/types";
import {
  canonicalOrigin,
  metadataForRoute,
  routeMetadata,
} from "./placedon-content/seo/metadata";
export function siteOrigin(): string | undefined {
  const value = process.env.SITE_ORIGIN;
  if (!value) return undefined;
  try {
    return canonicalOrigin(value);
  } catch {
    return undefined;
  }
}
export function pageMetadata(route: SiteRoute): Metadata {
  const origin = siteOrigin();
  if (origin)
    return metadataForRoute(route, {
      origin,
      publicationReady: process.env.SITE_PUBLICATION_READY === "true",
    });
  const copy = routeMetadata[route];
  return {
    title: { absolute: copy.title },
    description: copy.description,
    robots: { index: false, follow: true },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      siteName: "Placedon",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}
