import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";
import { buildSitemapEntries } from "@/lib/placedon-content/seo/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  return origin
    ? buildSitemapEntries({
        origin,
        publicationReady: process.env.SITE_PUBLICATION_READY === "true",
      })
    : [];
}
