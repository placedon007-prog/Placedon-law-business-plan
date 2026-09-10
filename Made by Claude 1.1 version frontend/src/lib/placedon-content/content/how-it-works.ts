import {
  answerClasses,
  pilotCta,
  sharedCopy,
  sharedStates,
  waitlistCta,
} from "./shared";
import type { PageContent } from "./types";

export const howItWorksContent = {
  route: "/how-it-works",
  eyebrow: "The intended method · Pre-launch",
  headline: "Ask. Verify. Cite. Or abstain.",
  subhead:
    "Placedon's proposed method tests a compliance question against the statutory record before presenting an answer. The source, the applicable version, and the limits of the result must remain visible.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "ask",
      heading: "State the question and the relevant date.",
      claim: "An assessment begins with its facts.",
      basis:
        "The intended workflow records the company context, the period under review, and the question to be answered. Missing inputs must remain marked as missing.",
    },
    {
      id: "verify",
      heading: "Establish the authority and the operative version.",
      claim: "The answer must be supported by official material.",
      basis:
        "The proposed verification record connects the provision to its amending or commencement instrument and separates the operative date from the date of publication.",
      items: [
        {
          id: "source",
          heading: "Source",
          claim: "Identify the official publication.",
          basis:
            "The intended record retains its reference and the exact text used.",
        },
        {
          id: "version",
          heading: "Version",
          claim: "Check what changed and when.",
          basis:
            "An amendment reference alone does not establish when the changed wording became operative.",
        },
        {
          id: "applicability",
          heading: "Applicability",
          claim: "Make the conditions explicit.",
          basis:
            "A conclusion must state the inputs and exclusions considered; unresolved applicability requires review or abstention.",
        },
      ],
    },
    {
      id: "answer-classes",
      heading: "Three classes. Different kinds of evidence.",
      claim:
        "A statutory fact, a derived conclusion, and an estimate must not be interchangeable.",
      basis:
        "Each intended answer class has a written label, a stated basis, and a boundary on what it establishes. Predictive signals remain a planned class.",
    },
    {
      id: "abstain",
      heading: "An unresolved record is an abstention.",
      claim: "Placedon is designed to withhold an answer it cannot verify.",
      basis:
        "Missing text, uncertain commencement, conflicting sources, or insufficient company facts must be identified. An abstention does not mean that no obligation exists.",
    },
    {
      id: "review",
      heading: "The professional decision remains yours.",
      claim:
        "An evidence record supports review; it does not assume professional responsibility.",
      basis:
        "A qualified adviser must assess the company's facts, relevant law, and any material outside the stated scope before a filing or other action.",
      action: { label: "Read questions and limits", href: "/faq" },
    },
  ],
  microcopy: {
    classExplorerLabel: "Intended answer classes",
    classExplorerHelp:
      "Select a class to read its evidence requirements and limits.",
    abstainedLabel: "Abstained — no legal answer supplied",
    sourceMissing: "Official source not established",
    dateMissing: "Operative date not established",
    inputMissing: "Required company facts not supplied",
    previewLabel: sharedCopy.conceptLabel,
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: sharedStates,
} as const satisfies PageContent;

export const howItWorksAnswerClasses = answerClasses;
