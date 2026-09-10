import {
  answerClasses,
  evidencePreview,
  pilotCta,
  sharedCopy,
  sharedStates,
  waitlistCta,
} from "./shared";
import type { PageContent } from "./types";

export const productContent = {
  route: "/product",
  eyebrow: "Product concept · Pre-launch",
  headline: "The answer. Its authority. Its limits.",
  subhead:
    "Placedon is being designed around an inspectable evidence record for Indian corporate law. These views describe the intended product; they are not live compliance checks.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "verified-answer",
      heading: "The verified answer record",
      claim: "The intended answer carries the material needed to examine it.",
      basis:
        "A statutory assertion must identify the exact provision, the relevant instrument, and the operative date. Where amendment is not applicable, that absence must itself be established, not replaced with an invented reference.",
      items: [
        {
          id: "assertion",
          heading: "Assertion",
          claim: "State what the evidence supports.",
          basis:
            "Keep the legal result separate from its source and any assumptions.",
        },
        {
          id: "authority",
          heading: "Authority",
          claim: "Expose the official record.",
          basis:
            "Retain the statutory words and the instrument used to establish their version.",
        },
        {
          id: "limits",
          heading: "Limits",
          claim: "State what remains unresolved.",
          basis:
            "A reviewer needs to see missing inputs and matters outside the verified scope.",
        },
      ],
    },
    {
      id: "currency",
      heading: "The statutory currency view",
      claim:
        "The planned view distinguishes the law at different points in time.",
      basis:
        "Each established change would link earlier wording, the changing instrument, and commencement evidence. No legal timeline or threshold is asserted in this preview.",
    },
    {
      id: "compliance-pack",
      heading: "The compliance evidence pack",
      claim:
        "The intended pack brings a question's evidence into one review record.",
      basis:
        "It would keep supplied company facts, verified provisions, derived conclusions, and unresolved items distinguishable. The marketing site does not generate or certify a compliance pack.",
    },
    {
      id: "company-standing",
      heading: "The company-standing check",
      claim: "A company-standing view is planned.",
      basis:
        "The concept would organise available company evidence and identify gaps. No company lookup, registry connection, or certificate of compliance is offered on this site.",
    },
    {
      id: "event-log",
      heading: "The company event log",
      claim: "A dated record of relevant changes is planned.",
      basis:
        "The intended log would distinguish changes in law from company events and retain their sources. Automated monitoring and delivery times are not committed.",
    },
    {
      id: "abstention",
      heading: "The abstain state",
      claim:
        "Withholding an unsupported result is part of the proposed product.",
      basis:
        "The record must name the missing evidence and explain the next review step. A blank result must never be interpreted as a finding of compliance.",
      action: {
        label: "Read how verification is intended to work",
        href: "/how-it-works",
      },
    },
  ],
  microcopy: {
    previewLabel: sharedCopy.conceptLabel,
    plannedLabel: "Planned — not available on this site",
    answerTab: "Answer record",
    currencyTab: "Statutory currency",
    standingTab: "Company standing",
    eventsTab: "Company events",
    abstainedTab: "Abstained",
    evidenceDetails: "Evidence requirements",
    noLiveQuery:
      "This concept does not submit a legal question or retrieve company records.",
    noSampleFigures:
      "No statutory figure is displayed without a verified source record.",
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: {
    ...sharedStates,
    empty: {
      title: "No company record in this preview",
      description:
        "Company-standing checks are planned. This concept contains no company data.",
      action: pilotCta,
    },
  },
} as const satisfies PageContent;

export const productEvidencePreview = evidencePreview;
export const productAnswerClasses = answerClasses;
