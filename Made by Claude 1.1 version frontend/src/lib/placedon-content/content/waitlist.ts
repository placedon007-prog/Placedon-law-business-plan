import { pilotCta, sharedCopy, sharedStates, waitlistCta } from "./shared";
import type { FormFieldCopy, PageContent, StateCopy } from "./types";

export const waitlistContent = {
  route: "/waitlist",
  eyebrow: "Register interest · Pre-launch",
  headline: "Leave a contact. State the work.",
  subhead:
    "Join the waitlist for future access updates, or request a pilot discussion about a defined corporate compliance workflow. Neither request confirms access or creates a payment obligation.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "choose-purpose",
      heading: "Choose the purpose of your request.",
      claim: "A waitlist entry and a pilot enquiry have different purposes.",
      basis:
        "The waitlist records interest in access; a pilot enquiry starts a discussion about scope, evaluation, and data handling.",
    },
    {
      id: "minimum-data",
      heading: "Describe the workflow without the file.",
      claim: "No client material is needed for an initial enquiry.",
      basis:
        "Use a general description of the review you carry out. Do not include identity records, company financial records, or filing credentials.",
      action: {
        label: "Read how request data would be handled",
        href: "/privacy",
      },
    },
    {
      id: "next-step",
      heading: "What happens after a recorded request",
      claim: "The request is retained for its stated purpose.",
      basis:
        "A pilot enquiry may lead to a scope discussion; a waitlist entry allows access updates. No reply deadline, place, or launch date is promised.",
    },
  ],
  microcopy: {
    purposeLabel: "What would you like to request?",
    requiredLegend:
      "Fields marked required must be completed. All other fields are optional.",
    noPayment: "No payment details required.",
    sensitiveData: sharedCopy.sensitiveDataNotice,
    noticeLink: "Privacy policy",
    termsLink: "Terms",
    consentHelp:
      "Each choice applies only to its stated purpose. Optional product updates are not required to submit a request.",
    withdrawalHelp:
      "Withdraw through the privacy contact in the published policy. Where an email contains an unsubscribe link, you can use that link too.",
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: {
    ...sharedStates,
    empty: {
      title: "No request submitted",
      description:
        "Choose a request type and complete the required fields when registration is available.",
    },
    error: {
      title: "Your request was not confirmed",
      description:
        "Your entries remain in this form. Check the highlighted fields or try again if the service is unavailable.",
    },
  },
} as const satisfies PageContent;

const contactFields = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    autocomplete: "email",
    maxLength: 254,
    help: "Use an address where you want to receive a reply or access updates. A personal address is accepted.",
    errors: {
      required: "Enter your email address.",
      invalid: "Enter an email address in the form name@domain.com.",
      tooLong: "Use an email address of no more than 254 characters.",
    },
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    required: false,
    autocomplete: "name",
    maxLength: 100,
    help: "Optional. Tell us how to address you.",
    errors: { tooLong: "Keep your name to 100 characters or fewer." },
  },
  {
    name: "organisation",
    label: "Organisation",
    type: "text",
    required: false,
    autocomplete: "organization",
    maxLength: 160,
    help: "Optional. Name your own organisation only if you are comfortable doing so; do not name a client.",
    errors: {
      tooLong: "Keep the organisation name to 160 characters or fewer.",
    },
  },
  {
    name: "role",
    label: "Professional role",
    type: "select",
    required: false,
    help: "Optional. Select the role most relevant to this request.",
    options: [
      { value: "", label: "Select a role (optional)" },
      { value: "corporate-lawyer", label: "Corporate lawyer" },
      { value: "in-house-counsel", label: "In-house counsel" },
      { value: "company-secretary", label: "Company Secretary" },
      { value: "chartered-accountant", label: "Chartered Accountant" },
      { value: "founder-operator", label: "Founder or operator" },
      { value: "other", label: "Another role" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
    errors: { invalid: "Choose a listed role or leave this field unselected." },
  },
] as const satisfies readonly FormFieldCopy[];

const workflowField = {
  name: "workflow",
  label: "Workflow to review",
  type: "textarea",
  required: true,
  maxLength: 1200,
  help: "Describe the compliance review and the evidence you need. Keep this general and non-confidential; do not paste a legal file or a company record.",
  errors: {
    required: "Describe the workflow you want to review.",
    tooLong: "Keep the workflow description to 1,200 characters or fewer.",
  },
} as const satisfies FormFieldCopy;

export const formContent = {
  formLabel: "Placedon interest request",
  intentField: "intent",
  privacyNoticeVersion: "placedon-prelaunch-privacy-v1-draft",
  consentVersion: "placedon-prelaunch-consent-v1-draft",
  purposes: {
    waitlist: {
      label: "Join the waitlist",
      heading: "Register interest in future access.",
      description:
        "Provide your email address for access updates. Additional professional context is optional.",
      fields: contactFields,
      consent: {
        name: "requestConsent",
        required: true,
        defaultChecked: false,
        label:
          "I consent to Placedon using these details to record my waitlist interest and send access updates.",
        error:
          "Confirm consent to record your waitlist interest and receive access updates, or leave the form without submitting.",
      },
      submitLabel: "Join the waitlist",
      pendingLabel: "Submitting waitlist request",
      success: {
        title: "Waitlist request recorded",
        description:
          "Your interest has been recorded for future access updates. This does not confirm access or a place in a queue.",
        action: { label: "Read the product concept", href: "/product" },
      },
    },
    pilot: {
      label: "Request a pilot",
      heading: "Request a discussion about a defined workflow.",
      description:
        "Provide your email address and a non-confidential workflow description. Scope and any terms will need to be agreed before participation.",
      fields: [...contactFields, workflowField],
      consent: {
        name: "requestConsent",
        required: true,
        defaultChecked: false,
        label:
          "I consent to Placedon using these details to assess and reply to my pilot enquiry.",
        error:
          "Confirm consent to assess and reply to your pilot enquiry, or leave the form without submitting.",
      },
      submitLabel: "Request a pilot",
      pendingLabel: "Submitting pilot request",
      success: {
        title: "Pilot request recorded",
        description:
          "Your enquiry has been recorded for review. A pilot place, response deadline, and access date are not confirmed.",
        action: { label: "Read the intended method", href: "/how-it-works" },
      },
    },
  },
  optionalUpdates: {
    name: "productUpdatesConsent",
    required: false,
    defaultChecked: false,
    label:
      "Also send me occasional updates about Placedon's development. I can unsubscribe at any time.",
    help: "Optional. This is separate from access updates or replies about your request.",
  },
  submitNotice:
    "Read the privacy policy before submitting. Submission records an enquiry or interest; it does not purchase a service.",
  honeypot: {
    name: "website",
    label: "Leave this field empty",
    help: "Automated submission check. Leave empty.",
  },
  errors: {
    validation: {
      title: "Review the highlighted fields",
      description:
        "The request has not been submitted. Correct the indicated entries and submit again.",
    },
    invalidIntent: {
      title: "Choose a request type",
      description: "Select waitlist or pilot before submitting.",
    },
    rateLimited: {
      title: "Too many attempts",
      description:
        "Pause before trying again. If the service provides a retry time, wait until then.",
    },
    unavailable: {
      title: "Registration is not available yet",
      description:
        "No request has been recorded. Return later to register interest.",
    },
    storageFailure: {
      title: "Your request could not be recorded",
      description:
        "The service did not confirm that your details were saved. Your entries remain in this form; try again later.",
    },
    networkUncertain: {
      title: "Submission status is unknown",
      description:
        "The connection ended before confirmation arrived. Your request may have been received; keep this page open and try again when the connection returns.",
    },
    rejected: {
      title: "This request could not be accepted",
      description:
        "Review the form and try again. Do not include confidential material.",
    },
    consentRequired: {
      title: "Consent for this request is required",
      description:
        "Confirm the consent statement for your selected purpose, or leave the form without submitting.",
    },
  },
  successEmailPending:
    "Your request was recorded. Email delivery has not been confirmed.",
  successEmailFailed:
    "Your request was recorded, but a confirmation email could not be sent. You do not need to submit again.",
  repeatedRequest:
    "This request has already been recorded. You do not need to submit it again.",
  progressAnnouncement:
    "Submitting your request. Wait for confirmation before leaving this page.",
  characterCountLabel: "Characters used",
} as const;

export const submissionErrorStates: Readonly<Record<string, StateCopy>> =
  formContent.errors;
