import {
  evidencePreview,
  pilotCta,
  sharedCopy,
  sharedStates,
  waitlistCta,
} from "./shared";
import type { PageContent } from "./types";

export const homeContent = {
  route: "/",
  eyebrow: "Indian corporate law · Pre-launch",
  headline: "An answer must carry its authority.",
  subhead:
    "Placedon is being built to verify Companies Act, 2013 compliance answers against the exact provision, amending instrument, and operative date. When that evidence cannot be established, it abstains.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "the-standard",
      heading: "A witness, not a tool.",
      claim: "A legal assertion requires a traceable basis.",
      basis:
        "Placedon's intended answer record puts the statutory words, the instrument, and the relevant date beside the assertion, so a reviewer can examine each one.",
      action: {
        label: "Read the verification standard",
        href: "/how-it-works",
      },
    },
    {
      id: "evidence-record",
      heading: "The evidence belongs beside the answer.",
      claim: "A citation alone does not establish the version of the law.",
      basis:
        "The product concept separates the provision, its amendment history, and the date for which the answer is sought. An incomplete record produces an abstention.",
      action: { label: "Examine the product concept", href: "/product" },
    },
    {
      id: "statutory-currency",
      heading: "The relevant date changes the question.",
      claim:
        "The intended currency view asks which version was operative at the time.",
      basis:
        "It is designed to connect a change to its official instrument and commencement evidence. Publication, commencement, and the assessment date remain separate fields.",
      items: [
        {
          id: "previous-text",
          heading: "Earlier text",
          claim: "Identify the prior wording.",
          basis:
            "A historical answer needs the text that applied during the period under review.",
        },
        {
          id: "changing-instrument",
          heading: "Changing instrument",
          claim: "Identify the recorded change.",
          basis:
            "The instrument must support the precise words or figure being replaced.",
        },
        {
          id: "effective-version",
          heading: "Operative version",
          claim: "Establish the date of application.",
          basis:
            "If commencement evidence is missing, the preview withholds the legal result.",
        },
      ],
    },
    {
      id: "audience",
      heading: "For the person who must account for the answer.",
      claim:
        "Placedon is intended for professionals responsible for corporate compliance, and the people who work with them.",
      basis:
        "The proposed record separates statutory evidence from company inputs and professional judgment.",
      items: [
        {
          id: "lawyers",
          heading: "Corporate lawyers and in-house counsel",
          claim: "Examine the authority behind a compliance statement.",
          basis:
            "The intended record exposes the source and operative date for legal review.",
        },
        {
          id: "company-secretaries",
          heading: "Company Secretaries and Chartered Accountants",
          claim: "Review the basis of a filing-related conclusion.",
          basis:
            "The concept records the company facts used and the provision applied.",
        },
        {
          id: "founders",
          heading: "Founders and operators",
          claim: "Know what to take to your adviser.",
          basis:
            "A stated evidence gap identifies what still needs to be checked before a decision.",
        },
      ],
    },
    {
      id: "pilot",
      heading: "Put the standard under review.",
      claim: "Pilot requests are invited while Placedon is being built.",
      basis:
        "Describe a compliance workflow without confidential details. Scope, data handling, access, and any fee must be agreed before participation.",
      action: pilotCta,
    },
  ],
  microcopy: {
    status: sharedCopy.launchStatus,
    previewLabel: sharedCopy.conceptLabel,
    previewCaption: evidencePreview.caption,
    currencyLabel:
      "Intended evidence sequence — no statutory timeline asserted",
    access: sharedCopy.accessNotice,
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: sharedStates,
} as const satisfies PageContent;

export const homeEvidencePreview = evidencePreview;
