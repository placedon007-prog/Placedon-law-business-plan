import { pilotCta, sharedCopy, sharedStates, waitlistCta } from "./shared";
import type { FaqEntry, PageContent } from "./types";

export const faqEntries = [
  {
    id: "scope",
    category: "scope",
    question: "What is Placedon being built to cover?",
    answer: [
      "Placedon's initial intended scope is Indian corporate law under the Companies Act, 2013, with the relevant rules and instruments needed to establish a provision's operative text.",
      "Coverage is still being developed, so this site does not promise a complete corpus or a published list of verified provisions.",
      "Tax, employment law, securities regulation, and case-law research are not represented as covered services.",
    ],
  },
  {
    id: "availability",
    category: "access",
    question: "Can I use Placedon for a live compliance question now?",
    answer: [
      "This site presents a pre-launch product concept, not a live legal-answer service.",
      "The answer record, statutory currency view, and company-standing view describe intended behaviour rather than available checks.",
      "You can request a pilot discussion or join the waitlist, but neither confirms access.",
    ],
  },
  {
    id: "audience",
    category: "scope",
    question: "Who is Placedon for?",
    answer: [
      "Placedon is intended first for corporate lawyers, in-house counsel, Company Secretaries, and Chartered Accountants who review corporate compliance.",
      "It is also intended to help founders and operators understand the evidence to take to those professionals.",
      "The proposed record separates the statutory basis from supplied company facts and the judgment still required.",
    ],
  },
  {
    id: "abstention",
    category: "evidence",
    question: "What does it mean when Placedon abstains?",
    answer: [
      "An abstention means Placedon cannot establish the evidence needed to answer the question.",
      "The intended record identifies the gap, such as missing statutory text, uncertain commencement, or insufficient company facts, and withholds the unsupported result.",
      "It does not mean that the company has no obligation or that a filing can be omitted.",
    ],
  },
  {
    id: "accuracy",
    category: "evidence",
    question:
      "Does a verified answer mean the result is guaranteed to be correct?",
    answer: [
      "No accuracy guarantee or validated performance rate is claimed for this pre-launch product.",
      "The intended verified label refers to a documented statutory basis; it does not establish that every input is correct or every relevant exception has been resolved.",
      "A qualified professional must still review the evidence and its application before acting.",
    ],
  },
  {
    id: "answer-classes",
    category: "evidence",
    question: "How do the answer classes differ?",
    answer: [
      "A verified fact reports supported statutory text, while a deterministic conclusion applies a verified rule to stated facts.",
      "A predictive signal would estimate a possible outcome and must carry its assumptions and uncertainty rather than a factual label.",
      "These are distinct intended classes; predictive signals remain planned, and no validated predictive model is presented here.",
    ],
  },
  {
    id: "point-in-time",
    category: "evidence",
    question: "Why does the operative date matter?",
    answer: [
      "The intended assessment concerns the version of the law operative for the period under review.",
      "Placedon's proposed record separates the publication date, the commencement evidence, and the date for which the company question is asked.",
      "If the applicable version cannot be established, it must abstain instead of assuming that the latest text answers a historical question.",
    ],
  },
  {
    id: "sources",
    category: "evidence",
    question: "Where would the statutory evidence come from?",
    answer: [
      "The source policy requires official statutory publications and relevant official instruments obtained through permitted access.",
      "The intended record retains the source reference and the words used; no scraping is proposed, and secondary summaries cannot substitute for statutory authority.",
      "This policy does not imply that a complete official-source corpus or a government integration is already available.",
    ],
  },
  {
    id: "legal-advice",
    category: "scope",
    question: "Is this legal advice, or a replacement for my adviser?",
    answer: [
      "No; the site and product concept are not legal advice and do not establish an attorney–client relationship.",
      "The intended product supplies an evidence record for review, while a qualified adviser assesses the facts, applicability, and matters outside the stated scope.",
      "Using Placedon does not transfer filing responsibility or professional liability to the product.",
    ],
  },
  {
    id: "filings",
    category: "scope",
    question: "Will Placedon submit MCA or ROC filings for my company?",
    answer: [
      "No filing submission service is offered on this site.",
      "The planned company-standing and event views describe evidence review, not an authorised connection to the Ministry of Corporate Affairs or a Registrar of Companies.",
      "Do not submit portal passwords, digital-signature credentials, or filing documents through the enquiry form.",
    ],
  },
  {
    id: "form-data",
    category: "data",
    question: "What information does a waitlist or pilot request need?",
    answer: [
      "The proposed waitlist needs an email address and consent to access updates; a pilot request also needs a non-confidential workflow description and consent to a reply about that request.",
      "Name, organisation, and professional role are optional context, and wider product updates require a separate optional choice.",
      "Do not submit client information or documents; the published privacy notice must identify the operator, processors, retention periods, and privacy contact before intake opens.",
    ],
  },
  {
    id: "training",
    category: "data",
    question: "Will submitted data be used to train AI models?",
    answer: [
      "The proposed policy excludes submitted form and pilot data from model training.",
      "Provider contracts and settings must be checked before data is accepted; this site does not claim that those controls have already been audited.",
      "Any pilot involving company data requires an agreed data-handling scope before transfer.",
    ],
  },
  {
    id: "security",
    category: "data",
    question: "What security assurances can I rely on today?",
    answer: [
      "This site states proposed security requirements, not a certification of a production service.",
      "Hosting locations, processors, access controls, retention, deletion, and incident contacts must be confirmed for the actual deployment before a pilot accepts data.",
      "No independent audit, certification, or India-only hosting guarantee is claimed here.",
    ],
  },
  {
    id: "pricing",
    category: "access",
    question: "What will Placedon cost?",
    answer: [
      "Pricing is being finalised with design partners, and no subscription tariff is published.",
      "Joining the waitlist is free; any pilot fee, scope, and cancellation terms must be agreed before participation.",
      "The enquiry form does not collect payment details or create a purchase obligation.",
    ],
  },
  {
    id: "launch-date",
    category: "access",
    question:
      "When will Placedon launch, and does the waitlist guarantee access?",
    answer: [
      "No public launch date has been announced, and a waitlist entry does not guarantee access.",
      "The waitlist records interest for access updates while coverage and the pilot scope are developed.",
      "There is no promised queue position, response deadline, or feature delivery date.",
    ],
  },
  {
    id: "chatgpt",
    category: "comparison",
    question: "How is Placedon intended to differ from ChatGPT?",
    answer: [
      "Placedon's intended scope is narrower than ChatGPT's general research use.",
      "OpenAI describes ChatGPT research as gathering and synthesising information with citations, while Placedon's proposed record specifically requires the provision, instrument, and operative date for an Indian corporate law answer.",
      "This is a distinction in intended scope and verification requirements, not a tested claim that Placedon is more accurate or that ChatGPT cannot cite sources.",
    ],
    sources: [
      {
        title: "OpenAI: ChatGPT for research",
        url: "https://openai.com/academy/research/",
      },
    ],
  },
  {
    id: "harvey",
    category: "comparison",
    question: "How is Placedon intended to differ from Harvey?",
    answer: [
      "Placedon is a pre-launch concept focused on a specific statutory evidence record, while Harvey describes a broader legal AI platform.",
      "Harvey's published platform includes legal research, document analysis, and workflows; Placedon's intended focus is Companies Act, 2013 provision and version verification.",
      "No comparative performance test, feature-equivalence claim, or replacement recommendation is made.",
    ],
    sources: [
      {
        title: "Harvey: platform overview",
        url: "https://www.harvey.ai/platform",
      },
    ],
  },
  {
    id: "correction",
    category: "evidence",
    question: "What should I do if a result or source appears wrong?",
    answer: [
      "Do not rely on a disputed result while the issue remains unresolved.",
      "For a future pilot, retain the question, assessment date, and source reference and raise the issue through the agreed pilot contact without sending confidential material through a public form.",
      "An unsupported assertion must be withheld pending review; this site does not offer a live correction service or a guaranteed response time.",
    ],
  },
] as const satisfies readonly FaqEntry[];

export const faqContent = {
  route: "/faq",
  eyebrow: "Questions and limits · Pre-launch",
  headline: "What is proposed. What is not established.",
  subhead:
    "These answers set out Placedon's intended scope, evidence standard, and access arrangements. Product behaviour remains a design commitment until verified in a working service.",
  primaryCta: pilotCta,
  secondaryCta: waitlistCta,
  sections: [
    {
      id: "questions",
      heading: "Read the scope before relying on a claim.",
      claim:
        "Pre-launch descriptions are not evidence of production performance.",
      basis:
        "The answers below distinguish intended behaviour, planned features, and matters that still require agreement.",
    },
    {
      id: "pilot-discussion",
      heading: "Have a workflow to review?",
      claim: "A pilot request can describe the evidence your team needs.",
      basis:
        "Keep it non-confidential; scope and terms must be agreed before any access or data transfer.",
      action: pilotCta,
    },
  ],
  microcopy: {
    searchLabel: "Search questions",
    searchPlaceholder: "Search by topic",
    clearSearch: "Clear search",
    allCategories: "All topics",
    expandAll: "Expand all answers",
    collapseAll: "Collapse all answers",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",
    sourcesLabel: "Source for the comparison",
    disclaimer: sharedCopy.legalDisclaimer,
  },
  states: {
    ...sharedStates,
    empty: {
      title: "No matching question",
      description:
        "Clear the search or try a broader topic, such as scope, privacy, or pricing.",
    },
  },
} as const satisfies PageContent;

export const faqCategories = [
  { value: "scope", label: "Scope and responsibility" },
  { value: "evidence", label: "Evidence and abstention" },
  { value: "data", label: "Data and security" },
  { value: "access", label: "Access and pricing" },
  { value: "comparison", label: "Product comparisons" },
] as const;
