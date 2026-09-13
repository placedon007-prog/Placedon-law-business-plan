import { pilotCta, sharedCopy, sharedStates, waitlistCta } from "./shared";
import type { PageContent } from "./types";

export const securityContent = {
  route: "/security",
  eyebrow: "Data handling and source discipline · Pre-launch",
  headline: "Security claims require evidence too.",
  subhead:
    "Placedon's data-handling requirements are being defined before pilot use. This page states the proposed standard; it does not certify a deployed environment.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "source-discipline",
      heading: "Official sources. Traceable authority.",
      claim:
        "The intended statutory record is restricted to official publications.",
      basis:
        "No scraping is proposed; statutory material must be obtained through permitted official channels. A third-party explanation cannot substitute for the operative provision.",
    },
    {
      id: "data-minimisation",
      heading: "The request form is not a document intake channel.",
      claim:
        "A pilot enquiry needs a description of the workflow, not a client file.",
      basis:
        "The proposed forms collect contact details and optional professional context. Confidential documents, identity records, and filing credentials should not be submitted.",
      action: { label: "Read the data-collection notice", href: "/cookies" },
    },
    {
      id: "training",
      heading: "No training on submitted data: the proposed policy.",
      claim:
        "The proposed policy excludes submitted form and pilot data from model training.",
      basis:
        "Before any pilot data is accepted, provider terms and account settings must be checked against that policy. This is a requirement for deployment, not a claim about an audited system.",
    },
    {
      id: "pilot-review",
      heading: "Agree the data boundaries before a pilot.",
      claim: "A pilot must have a stated data-handling scope.",
      basis:
        "The proposed review covers data categories, authorised access, processors, storage locations, retention, deletion, and incident contacts.",
      items: [
        {
          id: "access",
          heading: "Access and protection",
          claim:
            "Access should be limited to the people and services needed for the agreed purpose.",
          basis:
            "Authentication, permissions, transport protection, and storage controls require verification in the actual environment.",
        },
        {
          id: "providers",
          heading: "Processors and transfers",
          claim:
            "Provider names and processing locations must be disclosed before intake.",
          basis:
            "Hosting, mail, storage, and any model provider may have different retention and international-transfer arrangements.",
        },
        {
          id: "incidents",
          heading: "Incident handling",
          claim: "Reporting and response responsibilities must be assigned.",
          basis:
            "The pilot agreement should identify a monitored contact and the process for assessing and notifying relevant incidents.",
        },
      ],
    },
    {
      id: "current-limits",
      heading: "What this site does not establish",
      claim: "No security certification or independent audit is claimed.",
      basis:
        "An India-only hosting guarantee, a service-level commitment, and production security controls have not been established by the information published here.",
      action: { label: "Read the privacy template", href: "/privacy" },
    },
  ],
  microcopy: {
    postureLabel: "Proposed requirements — verification pending",
    sensitiveData: sharedCopy.sensitiveDataNotice,
    securityContactLabel: "Report a security concern",
    securityContactHelp:
      "Describe the affected page and the issue without passwords, personal data, or confidential files.",
    sourceUnavailable: "Source unavailable — no legal result supplied",
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: {
    ...sharedStates,
    empty: {
      title: "No assurance report published",
      description:
        "No certification or independent audit is claimed. Security arrangements must be reviewed before pilot data is accepted.",
    },
  },
} as const satisfies PageContent;
