export type MarketingRoute =
  | "/"
  | "/how-it-works"
  | "/product"
  | "/pricing"
  | "/security"
  | "/faq"
  | "/about"
  | "/waitlist";

export type SiteRoute =
  | MarketingRoute
  | "/privacy"
  | "/terms"
  | "/cookies"
  | "/404"
  | "/thank-you";

export interface ContentLink {
  readonly label: string;
  readonly href: SiteRoute | "/waitlist?intent=pilot";
}

export interface CopyPair {
  readonly claim: string;
  readonly basis: string;
}

export interface ContentItem extends CopyPair {
  readonly id: string;
  readonly heading: string;
  readonly label?: string;
  readonly action?: ContentLink;
}

export interface ContentSection extends CopyPair {
  readonly id: string;
  readonly heading: string;
  readonly items?: readonly ContentItem[];
  readonly action?: ContentLink;
}

export interface StateCopy {
  readonly title: string;
  readonly description: string;
  readonly action?: ContentLink;
}

export interface PageStates {
  readonly loading: StateCopy;
  readonly empty: StateCopy;
  readonly error: StateCopy;
  readonly abstained: StateCopy;
}

export interface PageContent {
  readonly route: MarketingRoute;
  readonly eyebrow: string;
  readonly headline: string;
  readonly subhead: string;
  readonly primaryCta: ContentLink;
  readonly secondaryCta: ContentLink;
  readonly sections: readonly ContentSection[];
  readonly microcopy: Readonly<Record<string, string>>;
  readonly states: PageStates;
}

export type AnswerClass =
  | "verified_fact"
  | "deterministic_conclusion"
  | "predictive_signal";

export interface AnswerClassCopy extends CopyPair {
  readonly label: string;
  readonly shortLabel: string;
  readonly evidenceLabel: string;
  readonly boundary: string;
}

export interface FaqEntry {
  readonly id: string;
  readonly category: "scope" | "evidence" | "data" | "access" | "comparison";
  readonly question: string;
  /** Render in order; structured data joins these same sentences with spaces. */
  readonly answer: readonly [string, string, ...string[]];
  readonly sources?: readonly {
    readonly title: string;
    readonly url: string;
  }[];
}

export interface FormFieldCopy {
  readonly name: string;
  readonly label: string;
  readonly type: "email" | "text" | "select" | "textarea";
  readonly required: boolean;
  readonly help: string;
  readonly autocomplete?: "email" | "name" | "organization";
  readonly maxLength?: number;
  readonly options?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly errors: Readonly<Record<string, string>>;
}
