import type {
  AnswerClass,
  AnswerClassCopy,
  ContentLink,
  PageStates,
} from "./types";

export const pilotCta = {
  label: "Request a pilot",
  href: "/waitlist?intent=pilot",
} as const satisfies ContentLink;

export const waitlistCta = {
  label: "Join the waitlist",
  href: "/waitlist",
} as const satisfies ContentLink;

export const sharedCopy = {
  brand: "Placedon",
  thesis: "A witness, not a tool.",
  positioning: "Indian corporate law. Provision, instrument, operative date.",
  launchStatus: "Pre-launch",
  conceptLabel: "Product concept — not a live answer",
  conceptDescription:
    "This preview describes the intended product. It does not report a verified legal result.",
  legalDisclaimer: "Not legal advice.",
  templateNotice: "Template — for review by counsel; not legal advice.",
  pricingStatus: "Pricing finalised with design partners.",
  timingStatus: "No public launch date has been announced.",
  accessNotice:
    "A request does not confirm access or create a payment obligation.",
  sensitiveDataNotice:
    "Do not include client names, privileged material, identity documents, financial records, or filing credentials.",
} as const;

/** Exact text runs for the builder's body-copy renderer; metadata remains plain text. */
export const typographyRules = {
  font: "IBM Plex Mono",
  exactMonoText: ["Companies Act, 2013"],
  evidenceKeys: ["provision", "instrument", "operative_date", "as_of"],
  instruction:
    "Render statutory references, instruments, dates, and legal figures in the brand mono font. Do not infer or insert missing legal values.",
} as const;

export const sharedStates = {
  loading: {
    title: "Loading this page",
    description: "The page content is being retrieved.",
  },
  empty: {
    title: "No further information published",
    description:
      "This page contains the current pre-launch information. Join the waitlist for access updates.",
    action: waitlistCta,
  },
  error: {
    title: "This content could not be loaded",
    description:
      "Reload the page. If the issue continues, return to the home page.",
    action: { label: "Return home", href: "/" },
  },
  abstained: {
    title: "Abstained — evidence incomplete",
    description:
      "Placedon cannot verify the provision, instrument, and operative date for this question. No legal answer is supplied; check the official record with a qualified professional.",
    action: { label: "Read the verification standard", href: "/how-it-works" },
  },
} as const satisfies PageStates;

export const answerClasses = {
  verified_fact: {
    label: "Verified fact",
    shortLabel: "Statutory text",
    claim: "A statement supported by the statutory record.",
    basis:
      "The intended record quotes the provision and identifies the instrument and operative date that support it.",
    evidenceLabel: "Provision and source record",
    boundary:
      "Verification of statutory text does not establish that it applies to every company.",
  },
  deterministic_conclusion: {
    label: "Deterministic conclusion",
    shortLabel: "Rule applied to facts",
    claim: "A result derived from stated company facts and a verified rule.",
    basis:
      "The intended record separates the inputs, the rule, and the calculation or logical steps.",
    evidenceLabel: "Inputs, provision, and reasoning",
    boundary:
      "The result depends on complete, correct inputs and the rule's applicability.",
  },
  predictive_signal: {
    label: "Predictive signal",
    shortLabel: "Estimate, not fact",
    claim: "An estimate of a possible outcome.",
    basis:
      "Any future signal must identify its evidence, assumptions, and uncertainty separately from statutory facts.",
    evidenceLabel: "Evidence and uncertainty",
    boundary:
      "Planned only. No validated predictive model or probability is presented on this site.",
  },
} as const satisfies Record<AnswerClass, AnswerClassCopy>;

export const globalContent = {
  header: {
    homeLabel: "Placedon home",
    navigationLabel: "Main navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    links: [
      { label: "Product", href: "/product" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Security", href: "/security" },
      { label: "Pricing", href: "/pricing" },
    ],
    primaryCta: pilotCta,
  },
  footer: {
    positioning:
      "Placedon is being built for Indian corporate law. Pre-launch; not legal advice.",
    navigationLabel: "Footer navigation",
    productLinks: [
      { label: "Product", href: "/product" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
    ],
    companyLinks: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      waitlistCta,
      pilotCta,
    ],
    legalLinks: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies and data collection", href: "/cookies" },
    ],
    contactLabel: "Contact Placedon",
    cookiePreferencesLabel: "Cookie preferences",
    copyrightBrand: "Placedon",
    copyrightSuffix: "All rights reserved.",
  },
  accessibility: {
    skipLink: "Skip to main content",
    mainId: "main-content",
    lightMode: "Use light appearance",
    darkMode: "Use dark appearance",
    systemMode: "Use device appearance",
    externalSource: "Read the official source",
  },
} as const;

/** Marketing illustration only; never pass this object to the product API client. */
export const evidencePreview = {
  kind: "concept",
  status: "abstained",
  label: sharedCopy.conceptLabel,
  question: "Which provision applies to this company on the relevant date?",
  answer: sharedStates.abstained,
  fields: [
    {
      key: "provision",
      label: "Exact provision",
      value: null,
      missing: "Not verified",
      typography: "mono",
    },
    {
      key: "instrument",
      label: "Amending or commencement instrument",
      value: null,
      missing: "Not verified",
      typography: "mono",
    },
    {
      key: "operative_date",
      label: "Operative date",
      value: null,
      missing: "Not established",
      typography: "mono",
    },
    {
      key: "as_of",
      label: "Assessment date",
      value: null,
      missing: "Not supplied",
      typography: "mono",
    },
  ],
  caption: "No provision or legal figure is asserted in this concept preview.",
  alt: "Placedon product concept showing an abstained answer and missing evidence fields.",
} as const;
