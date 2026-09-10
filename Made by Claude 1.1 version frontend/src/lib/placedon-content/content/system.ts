import { formContent } from "./waitlist";
import { sharedCopy } from "./shared";

export const systemContent = {
  notFound: {
    route: "/404",
    headline: "This page is not available.",
    subhead:
      "The address may be incorrect or the page may have moved. Return home to find the current site pages.",
    action: { label: "Return home", href: "/" },
  },
  thankYou: {
    route: "/thank-you",
    waitlist: formContent.purposes.waitlist.success,
    pilot: formContent.purposes.pilot.success,
    unconfirmed: {
      title: "No request confirmation is available",
      description:
        "Opening this page does not confirm a submission. Return to the form if you have not received a recorded-request confirmation.",
      action: { label: "Return to the request form", href: "/waitlist" },
    },
  },
  legalPages: {
    privacy: {
      route: "/privacy",
      headline: "Privacy policy",
      subhead:
        "How request data is intended to be collected, used, retained, and deleted.",
      notice: sharedCopy.templateNotice,
    },
    terms: {
      route: "/terms",
      headline: "Website terms",
      subhead: "The conditions and limits of this pre-launch information site.",
      notice: sharedCopy.templateNotice,
    },
    cookies: {
      route: "/cookies",
      headline: "Cookies and data collection",
      subhead:
        "What a visit or a request may record, and which choices remain optional.",
      notice: sharedCopy.templateNotice,
    },
  },
  consent: {
    title: "Choose whether to allow analytics.",
    description:
      "Required storage supports the site and remembers your choice. Optional analytics would measure page use only if you allow it; refusing does not affect the request form.",
    requiredLabel: "Required storage",
    requiredDescription:
      "Limited to functions such as recording your consent choice and protecting form submission. This category cannot include audience measurement or advertising.",
    analyticsLabel: "Optional analytics",
    analyticsDescription:
      "Page-use measurement, enabled only after consent and only when a provider and its data practices are disclosed.",
    analyticsUnavailable:
      "Optional analytics is not configured. No analytics choice will enable tracking.",
    defaultAnalytics: false,
    acceptLabel: "Allow analytics",
    rejectLabel: "Reject optional analytics",
    preferencesLabel: "Cookie preferences",
    saveLabel: "Save preferences",
    closeLabel: "Close preferences",
    privacyLink: { label: "Privacy policy", href: "/privacy" },
    detailsLink: { label: "Cookies and data collection", href: "/cookies" },
    saved: "Your cookie preference has been saved.",
    saveFailed:
      "Your preference could not be saved. Optional analytics remains off.",
    withdrawn:
      "Optional analytics is now off. Previously collected data is handled under the privacy policy.",
    unavailable:
      "Cookie preferences are unavailable. Optional analytics remains off.",
  },
  email: {
    waitlist: {
      subject: "Placedon — waitlist request recorded",
      paragraphs: [
        "Your waitlist request has been recorded for future access updates.",
        "Placedon is pre-launch. Access, a queue position, and a launch date are not confirmed.",
        "You can withdraw your request through the privacy contact in the linked policy.",
      ],
    },
    pilot: {
      subject: "Placedon — pilot request recorded",
      paragraphs: [
        "Your pilot enquiry has been recorded for review.",
        "Scope, data handling, and any fee must be agreed before participation. This message does not confirm access or a response deadline.",
        "Do not reply with client documents, identity records, or filing credentials.",
      ],
    },
    privacyLinkLabel: "Privacy policy",
    unsubscribeLabel: "Stop these updates",
    disclaimer: sharedCopy.legalDisclaimer,
  },
} as const;
