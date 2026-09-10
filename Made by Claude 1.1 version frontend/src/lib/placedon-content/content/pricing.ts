import { pilotCta, sharedCopy, sharedStates, waitlistCta } from "./shared";
import type { PageContent } from "./types";

export const pricingContent = {
  route: "/pricing",
  eyebrow: "Participation · Pre-launch",
  headline: "Scope first. Terms before access.",
  subhead:
    "Pricing is being finalised with design partners. Placedon has no published subscription tariff or committed public launch date.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "pilot",
      heading: "Pilot participation",
      claim: "Request a discussion about a defined compliance workflow.",
      basis:
        "Proposed scope, evaluation criteria, data handling, duration, and any fee must be agreed before access. Sending a request does not reserve a place.",
      items: [
        {
          id: "fit",
          heading: "Intended participants",
          claim:
            "Professionals and operators with a specific Companies Act workflow to review.",
          basis:
            "A request should explain the question, the review process, and what evidence the team needs.",
        },
        {
          id: "evaluation",
          heading: "Evaluation basis",
          claim: "Examine the evidence record and its limits.",
          basis:
            "A pilot discussion can define how cited results, input dependencies, and abstentions will be assessed.",
        },
        {
          id: "commercial",
          heading: "Commercial position",
          claim: "No pilot fee is quoted on this site.",
          basis:
            "Any proposed charge and cancellation terms must be stated in the pilot agreement before acceptance.",
        },
      ],
      action: pilotCta,
    },
    {
      id: "waitlist",
      heading: "Waitlist",
      claim: "Register interest in future access.",
      basis:
        "The form collects contact details for access updates. Joining the waitlist is free and does not purchase a subscription or guarantee admission.",
      action: waitlistCta,
    },
    {
      id: "not-a-plan-table",
      heading: "No implied entitlement",
      claim: "The product concepts are not a list of included features.",
      basis:
        "Coverage, usage limits, support, and access conditions remain subject to an agreed scope. Future pricing and availability will be stated when established.",
      action: { label: "Read the current product scope", href: "/product" },
    },
  ],
  microcopy: {
    pilotPrice: "By agreement before participation",
    waitlistPrice: "No charge to register interest",
    pricingStatus: sharedCopy.pricingStatus,
    payment: "No payment details are requested by this form.",
    timeline: sharedCopy.timingStatus,
    access: sharedCopy.accessNotice,
  },
  states: {
    ...sharedStates,
    empty: {
      title: "Subscription pricing is not published",
      description:
        "Request a pilot discussion or join the waitlist for future access updates.",
      action: pilotCta,
    },
  },
} as const satisfies PageContent;
