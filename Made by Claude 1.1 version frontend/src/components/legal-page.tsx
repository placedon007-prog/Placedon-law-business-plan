import { legalDocument, type LegalKind } from "@/lib/legal";
import { LegalDocument, headingId } from "./legal-document";
import { systemContent } from "@/lib/placedon-content/content/system";
export function LegalPage({ kind }: { kind: LegalKind }) {
  let source = legalDocument(kind);
  if (kind === "cookies")
    source = `## This preview

Optional analytics is not configured. No analytics choice will enable tracking. The site does not load advertising, session recording, or third-party font services.

## Appearance preference

Selecting an appearance stores \`placedon-theme\` in local storage on this device. The value is light or dark; it contains no contact details. It remains until replaced or removed through your browser's site-data controls. If storage is unavailable, the choice applies only to the current visit.

## Requests and hosting

Hosting may process an IP address and request information to deliver and protect the site. Hosting details and retention must be confirmed in the [privacy policy](/privacy) before publication.

Registration remains closed until the reviewed notice and storage provider are configured. A waitlist request requires an email address and purpose-specific consent; name, organisation, and role are optional. A pilot enquiry also requires a non-confidential workflow description. Development updates are a separate, unchecked choice.

## Your choices

The footer's Cookie preferences control reports the current analytics status. Optional analytics remains off whether you open, close, or dismiss the panel. The appearance preference does not authorise tracking or email.

Use the contact identified in the reviewed [privacy policy](/privacy) for requests concerning records already held. Browser storage controls do not delete records held by a website operator.

## Before collection changes

Any optional analytics provider, data fields, storage identifiers, and retention must be disclosed before activation. Optional tracking requires a separate affirmative choice; form consent is not analytics consent.`;
  const copy = systemContent.legalPages[kind];
  const headings = [...source.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  return (
    <>
      <div className="container page-hero">
        <p className="eyebrow">Policies · Pre-launch</p>
        <h1>{copy.headline}</h1>
        <p className="page-intro">{copy.subhead}</p>
      </div>
      <div className="container">
        <aside className="template-banner">
          {copy.notice} Business details remain subject to confirmation before
          registration opens.
        </aside>
      </div>
      <div className="container legal-layout">
        <nav className="legal-toc" aria-label="Document sections">
          {headings.map((heading) => (
            <a key={heading} href={`#${headingId(heading)}`}>
              {heading}
            </a>
          ))}
        </nav>
        <LegalDocument source={source} />
      </div>
    </>
  );
}
