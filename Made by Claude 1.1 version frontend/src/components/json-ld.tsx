import type { SiteRoute } from "@/lib/placedon-content/content/types";
import {
  structuredDataForRoute,
  serializeJsonLd,
} from "@/lib/placedon-content/seo/structured-data";
import { siteOrigin } from "@/lib/site";
export function JsonLd({ route }: { route: SiteRoute }) {
  const origin = siteOrigin();
  if (!origin) return null;
  const data = structuredDataForRoute(route, { origin });
  return data.length ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  ) : null;
}
