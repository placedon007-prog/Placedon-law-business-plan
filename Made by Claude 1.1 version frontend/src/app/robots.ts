import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";
import { buildRobots } from "@/lib/placedon-content/seo/metadata";
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return origin
    ? buildRobots({
        origin,
        publicationReady: process.env.SITE_PUBLICATION_READY === "true",
      })
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
