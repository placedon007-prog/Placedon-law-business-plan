import { pilotCta, sharedCopy, sharedStates, waitlistCta } from "./shared";
import type { PageContent } from "./types";

export const aboutContent = {
  route: "/about",
  eyebrow: "Purpose and accountability · Pre-launch",
  headline: "The standard is a citable basis.",
  subhead:
    "Placedon is being built around a narrow requirement: an Indian corporate law answer must carry the provision, instrument, and operative date that support it. When the record cannot be verified, the answer must stop.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "purpose",
      heading: "Authority is something a reviewer must be able to inspect.",
      claim: "An authoritative tone cannot establish a legal proposition.",
      basis:
        "Placedon's proposed record makes the underlying words, source, date, and unresolved conditions visible to the professional reviewing them.",
    },
    {
      id: "witness",
      heading: "A witness, not a tool.",
      claim: "The witness model confines an answer to its evidence.",
      basis:
        "Placedon is intended to report what the statutory record supports and to identify what it cannot establish. The phrase describes a product standard, not legal witness status or court approval.",
    },
    {
      id: "building-in-the-open",
      heading: "Building in the open begins with stating the limits.",
      claim: "Placedon is pre-launch and the corpus is not complete.",
      basis:
        "This site presents intended workflows and invites pilot requests. It does not claim live customers, validated accuracy results, or complete statutory coverage.",
    },
    {
      id: "team-contact",
      heading: "Contact the team about the work.",
      claim:
        "The pilot form is the route for discussing a compliance workflow.",
      basis:
        "State your role, the review you carry out, and the evidence you need. Individual biographies and professional credentials are not asserted on this site.",
      action: pilotCta,
    },
    {
      id: "accountability",
      heading: "Questions about data have a separate purpose.",
      claim: "A privacy request does not require a waitlist subscription.",
      basis:
        "Use the privacy contact identified in the published policy to ask about access, correction, withdrawal, or deletion.",
      action: { label: "Read the privacy policy", href: "/privacy" },
    },
  ],
  microcopy: {
    status: sharedCopy.launchStatus,
    contact: "Contact Placedon",
    enquiryHelp: sharedCopy.sensitiveDataNotice,
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: sharedStates,
} as const satisfies PageContent;
