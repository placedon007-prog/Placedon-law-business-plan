# AUTONOMOUS OVERNIGHT BUILD — read fully, then execute without stopping.

## MODE
You are running **unattended overnight**. The human will NOT respond until morning.
- **Never ask a question and never wait for approval.** If a decision is needed, choose the option
  most consistent with the specification, record it in `DECISIONS.md` with a one-line rationale, and
  continue. A single unresolved decision must never stall the build.
- **Your complete specification is `./codex-website-prompt.md` (the full brief) and `./AGENTS.md`
  (the standing rules). Read both, in full, before doing anything.** They are the source of truth;
  obey them exactly. Brand assets are in `./brand-kit/`.
- Work continuously through the loop below until the entire Definition of Done is met, then keep
  hardening quality. **Do not stop early and do not idle.** If you complete everything, spend the
  remaining time on tests, edge cases, polish, and the morning report.

## GUARDRAILS (hard)
- **Local only.** Do NOT push to any git remote, deploy, or publish anything. Do NOT modify or delete
  anything outside this project directory.
- **Never invent** a statutory figure, section, date, metric, customer, or logo. When unsure, use the
  abstain state or a clearly-marked placeholder and log it in `DECISIONS.md`. Pre-launch framing only —
  no live-product/accuracy/customer claims.
- Keep secrets out of the repo; maintain `.env.example` only. Fail closed: never render a fabricated
  legal figure when data is missing — show the abstain state.
- Re-read `AGENTS.md` before every commit. The bar: **a senior design studio would ship this.**

## THE LOOP (repeat each item until it passes with zero open issues, then move on)

**Phase 0 — Foundation.** Confirm the project is Next.js 15 (App Router) + TypeScript strict +
Tailwind v4 + shadcn/ui. Wire the design tokens from `AGENTS.md` (monochrome + ≤10% gold accent).
Self-host the brand fonts from `./brand-kit/fonts` via `next/font/local`. Build the custom brand icon
set (the five marks). Install the libraries from §13 of the brief. `npm run build` must pass. Commit.
*(If the project is not yet scaffolded, run: `npx create-next-app@latest . --ts --tailwind --eslint
--app --src-dir --import-alias "@/*" --use-npm --turbopack` — non-interactively; never leave a prompt
waiting.)*

**Phase 1…N — Each page** (Home, How-it-works, Product, Pricing, Security, FAQ, About, Privacy,
Waitlist/Pilot, 404):
1. Implement per the brief — sections, real copy, components, motion (§12 map), interactions.
2. `npm run build` + `npm run dev`; if a browser/Playwright MCP is available, open the page and
   screenshot **desktop and mobile (360px)**.
3. **Critique it** against: the brief, the `AGENTS.md` end-of-task checklist, and "is this AI slop?".
   Verify brand fidelity (monochrome, one gold accent per view, mono on every statute reference),
   voice/grammar (banned words absent, claim-then-evidence, correct English, self-explanatory),
   accessibility (AA contrast, visible focus, reduced-motion, colour-independent status), and
   responsiveness. Be harsh.
4. **Fix every issue.** Re-verify. Repeat 1–4 until the page has no open issues.
5. Commit with a clear message.

**Phase QA — run these sweeps repeatedly until each is clean:**
- Whole-site consistency (spacing rhythm, the one-accent rule, mono consistency, dark mode, nav states,
  cross-page tone).
- Accessibility (contrast, keyboard nav, labels, focus, `prefers-reduced-motion`, 44px targets).
- SEO (per-route metadata, Open Graph, JSON-LD incl. `FAQPage`, `sitemap.xml`, `robots.txt`, alt text,
  the target keywords woven naturally).
- Performance (`next/image`, font loading, minimal JS; run Lighthouse if available and fix regressions).
- Content proofread of every page — professional, grammatically correct, on-voice, self-explanatory.
- Integration — a typed API client with a `MockProvider` and an `HttpProvider` matching the real
  contracts (`/v1/compliance-pack`, `/v1/company/{cin}/standing`, `/v1/company/{cin}/events`; output
  classes `verified_fact | deterministic_conclusion | predictive_signal` + `abstained`); a working,
  validated waitlist/pilot form (zod, honeypot, pluggable env sink, recorded consent); `.env.example`;
  error boundaries.
- Fix all findings, re-run the sweep, repeat until clean.

**Phase Harden — use all remaining time:**
Add sensible tests (render/lint/typecheck/build must all pass). Polish micro-interactions and the
empty/loading/error/abstain states. Verify reduced-motion paths. Remove every `any`; keep types strict.
Ensure `npm run build`, `npm run lint`, and typecheck are green.

## DELIVERABLES BY MORNING (create and keep current)
- **A running site:** `npm run dev` works with **zero console errors**; `npm run build` passes.
- **`MORNING_REPORT.md`** at the repo root, written for a human skimming in 5 minutes: what was built
  (page by page), key decisions/assumptions (link `DECISIONS.md`), what's polished vs. rough, a
  **ranked list of remaining TODOs / known issues**, where screenshots are, and exactly how to review
  (which routes to open, what to look at first).
- **`DECISIONS.md`:** every assumption you made because you couldn't ask, one line each.
- **Clean git history:** a commit per passing page/phase with descriptive messages, so the morning
  review reads as a clear story.

## DISCIPLINE
Quality over speed, but never idle. If you hit a blocker you cannot resolve, log it under
"**Blocked — needs human**" in `MORNING_REPORT.md`, implement the best fallback, and continue with
everything else. Keep looping and hardening until morning.

**Begin now.** Read `./codex-website-prompt.md` and `./AGENTS.md` in full, then execute the loop end to
end without stopping.


---

# ===== PART B — YOUR COMPLETE BUILD SPECIFICATION (obey exactly) =====

# BUILD BRIEF — Placedon marketing website (design + front-end + integration-ready architecture)

You are a **senior product design + front-end engineering team in one agent**. Think like a design
lead in the mold of Jony Ive — obsessive about restraint, hierarchy, material honesty, and detail —
and simultaneously like a senior software architect who cares that the front-end plugs cleanly into a
real backend. The output must look and feel like a small, excellent studio sat with this for weeks. It
must NOT read as AI-generated slop. Take one real, defensible aesthetic risk, and execute everything
else with quiet precision.

Work to a professional quality floor: real content (never lorem), correct grammar, responsive to
mobile, visible keyboard focus, reduced-motion respected, WCAG AA contrast, fast Core Web Vitals.

---

## 1. THE PRODUCT (build the site around this truth — do not overclaim)

**Placedon** is an evidence-first legal-intelligence layer for **Indian corporate law (the Companies
Act, 2013)**. Its defining behaviour: it answers a compliance question **only** with the exact
statutory provision, the amending instrument, and the date that figure became operative — and when it
cannot verify something, **it abstains and says so**. Abstention is the product's most important
output, not a limitation.

Brand thesis (use it, don't dilute it): **"Placedon is a witness, not a tool. It testifies to what it
has seen in the statute, and refuses to testify to what it has not."** The core belief: *the gap
between "sounds authoritative" and "is citable" is where professional liability lives.*

**Honesty rule (hard):** the corpus is not fully built and there are no live customers yet. Frame the
site as **pre-launch / building in the open**, invite **pilots and a waitlist**, and show the product
as **designed concept mockups**, clearly the product's real intended UI — never as a shipping,
already-working service. Primary CTAs: **"Request a pilot"** and **"Join the waitlist."** Do not claim
a live corpus, customer counts, accuracy percentages as track record, or "50 provisions covered."

**Audience (write for both, in this order):**
1. **The liable professional** — corporate lawyers, in-house counsel, Company Secretaries/CAs who sign
   filings and carry personal liability. Formal register, technical, unsentimental.
2. **The founder / operator** — startups and SMEs who meet compliance by missing it. Plain language
   only where they need it.

---

## 2. BRAND SYSTEM (use these exact values — this is a real brand kit, not a suggestion)

### Colour — MONOCHROME with a single restrained accent
The palette is deliberately near-monochrome and uniform. Colour appears in **accents only (≤10% of any
screen), one accent element per view maximum.** Do not build a navy/gold-dominant page.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0C0C0D` | Near-black — primary text (light mode) / primary background (dark mode) |
| `--cream` | `#F4EFE6` | Warm off-white — the "white": primary background (light) / primary text (dark) |
| `--grey-900…100` | build a neutral warm-grey scale | Secondary text, borders, surfaces, dividers |
| `--gold` | `#C9A24B` | **The single accent. Brass gold. ≤10%, one element per view** — the "verified" mark, one CTA, one emphasis |
| `--gold-muted` | `#9F743B` | Citations and small verbatim marks only |
| `--abstain` | `#5B6472` | Cool grey — reserved EXCLUSIVELY for the "abstained / unknown" state. Never decorative |

Ship a **light-primary** marketing site (cream base, ink text, grey support, gold accent), plus a
**dark mode** built from the same tokens (ink base, cream text). Use one or two full-bleed dark
sections for rhythm and contrast. Semantic "abstain" grey is separate from the accent and never
counts as it.

### Typography — self-host the brand fonts (files in `brand-kit/fonts/`)
- **Display / headlines:** `Fraunces` (Variable, OFL) — editorial serif with ink-weight character.
- **Citations / verbatim / data:** `IBM Plex Mono` (Regular/Medium/SemiBold). Every section reference
  (`s.96(1)`), figure (`₹10,00,00,000`), instrument (`G.S.R. 880(E)`) and date renders in this mono —
  it is the brand's signature and its authority signal.
- **Body / UI:** `Inter` (or `Archivo`) — clean, slightly wide, for running text and small print.
- Load via `next/font/local` from the brand-kit files. Set a deliberate modular type scale; give
  headings `text-wrap: balance`; keep running text ~62–70ch; letter-space uppercase labels.

### Logo — files in `brand-kit/logo/`
`placedon-logo-white-transparent.png`, `placedon-logo-gold-transparent.png`,
`placedon-logo-navy-transparent.png`, `placedon-logo-original.jpeg`. Use the white mark on dark, the
ink/gold on light. Convert to inline SVG where possible for crispness. Give the wordmark a considered
lockup with the type system.

### Voice — **Terse. Traceable. Unsparing.**
- **Claim, then evidence.** Split the assertion from its basis into two sentences. The second proves
  the first. This governs ALL copy.
- Filter test for every sentence: *would this appear in a judgment?* If it reads like advocacy or
  sales copy, cut it. 80% formal, 65% cold (indifferent to persuasion, not hostile), 75% confident
  (humility appears once — in abstention).
- **Words IN:** provision, verified, section [number] (mono), abstains, liability, instrument, operative.
- **Words BANNED:** streamline, empower, solution, easy, smart, seamless, revolutionary, unlock,
  supercharge, effortless, game-changer, cutting-edge. Any of these = failure.
- Governing paragraph to echo in tone (do not paste verbatim as body): *"Placedon covers the Companies
  Act, 2013. Every provision that drives the annual filing cycle — with the amending instrument
  recorded where the Act was changed — or not at all. When it cannot point to the exact section behind
  an answer, it says so. That refusal is not a gap in coverage. It is the standard."*

---

## 3. DESIGN DIRECTION (references + the synthesis)

Study and blend three references, but do NOT clone any:
- **Spellbook** — product shown honestly and in-context; trust through specificity; legal-serious.
- **Claude (Anthropic) / "Claude Legal"** — warmth, generous whitespace, editorial typography, calm,
  high craft, humane restraint.
- **Scale.com** — enterprise/technical authority, confident large type, disciplined grid, credibility.

**The synthesis for Placedon:** editorial legal-document gravitas (Fraunces + mono citations) ×
Claude's calm craft × Scale's enterprise rigour, expressed in a strict monochrome system with a single
gold accent. Corporate and authoritative, but not a boring corporate template.

**One signature creative device (the memorable thing), grounded in the subject — pick and execute ONE
with excellence, keep everything else quiet:**
- A **"verified answer" artifact**: a designed compliance answer where the figure carries its section,
  its Gazette instrument, and its as-of date in mono directly beside it — and where an **abstention**
  is rendered as a first-class, calm cool-grey state, not an error. This is the product made visible.
- Optionally support it with a **statutory currency timeline** (e.g. the small-company threshold moving
  ₹50L → ₹2cr → ₹4cr → ₹10cr across G.S.R. 92(E)/700(E)/880(E), 2014→2025) — real, uncopyable, and the
  clearest one-glance proof of what Placedon does. Verify these figures against `brand-kit`/docs before
  publishing them; do not invent a statutory figure.

### AI-slop anti-patterns — explicitly forbidden
No purple/blue gradient hero; no glassmorphism everywhere; no emoji as section markers; no everything-
centered; no `rounded-lg` on every card with an accent bar; no generic 3-feature-icon grid with lorode
copy; no stock "abstract tech" blobs; no Inter-as-display; no fake logo clouds; no invented metrics.
Corners: restrained (≤6px). Shadows: minimal, never decorative. Motion: subtle, purposeful, ≤ ~250ms
for UI, one orchestrated hero moment maximum.

---

## 4. INFORMATION ARCHITECTURE (full marketing site)

Build these routes. Each is real content, on-brand, self-explanatory:

1. **`/` Home** — the thesis, the verified-answer signature, how it's different, who it's for, a
   currency proof, honest pilot CTA.
2. **`/how-it-works`** — Ask → Verify → cited answer, or an honest abstention. The witness model. The
   three answer classes (below).
3. **`/product`** — the designed concept in depth: the verified answer, the statutory currency view,
   the (planned) company-standing check, the abstain state. Clearly labelled as the intended product.
4. **`/pricing`** — honest, pre-launch. Pilot / waitlist tiers; "pricing finalised with design
   partners." No fabricated numbers.
5. **`/security`** — data handling, source discipline (statute only via official sources, never
   scraped), no-training-on-your-data posture, provenance. Only defensible claims.
6. **`/faq`** — real questions from the audience (scope, abstention, accuracy, data, pricing, timeline)
   with FAQ structured data.
7. **`/about`** — the mission and the standard; building in the open; the team/contact.
8. **`/privacy`** — a proper privacy policy (see §7).
9. **`/waitlist`** and/or **`/pilot`** — the conversion pages with the forms (see §8 architecture).
10. **`/404`** and a thank-you state.

Global: sticky, quiet header with the wordmark + minimal nav + one gold CTA; a substantial footer
(nav, legal links, contact, a single-line honest positioning, ©, "Not legal advice.").

**The three answer classes — surface them as a core concept (from the product):**
`Verified fact` (statute, quoted, dated) · `Deterministic conclusion` (computed from your facts +
the provision) · `Predictive signal` (clearly probabilistic — never presented as fact). Keep them
visually distinct and never blurred.

---

## 5. CUSTOM ICONOGRAPHY & PERSONALISED DETAIL (do not ship a stock icon set as-is)

Design a **small, bespoke, cohesive icon set** in one consistent line style (uniform stroke,
monochrome, gold only on the single "verified" mark), personalised to Placedon's world:
- a **verified/seal** mark (authority + a section reference),
- an **abstains** mark (a deliberate, calm blank/dash — the honest "no answer", in cool grey),
- a **provision / section** mark (the `§`/`s.` in mono, treated as a glyph),
- a **currency/timeline** mark (a figure moving across instruments),
- a **source/instrument** mark (a Gazette/document reference).
Extend a permissively-licensed base set (e.g. Lucide) ONLY as a fallback for utility icons; the five
brand marks above must be custom SVG. Deliver them as a typed React icon component set.

Personalise further: a favicon + OG image built from the mark; a considered wordmark lockup; a
consistent "citation chip" component (mono, subtle) used wherever statute is referenced.

---

## 6. COPY & CONTENT (write it all — professional, correct, self-explanatory)

- Write **all** copy yourself in correct, professional English, understandable by a corporate lawyer
  **and** an intelligent general reader. Proofread for grammar; no typos; no filler.
- Apply the voice rules from §2 (claim-then-evidence; banned words; formal/cold/confident register).
- The landing page must be **self-explanatory**: a first-time visitor understands what Placedon is,
  who it's for, and why it's different, within the first screen and the first scroll — without jargon
  walls. Keep it substantive but not complex.
- Every headline and subhead earns its place; no decorative copy. Errors/empty states get direction,
  not mood.

---

## 7. INDUSTRIAL-STANDARD REQUIREMENTS (all of these)

- **SEO:** per-route `<title>`/meta descriptions; semantic headings; Open Graph + Twitter cards; a
  generated `sitemap.xml` and `robots.txt`; canonical URLs; `JSON-LD` structured data
  (`Organization`, `WebSite`, `FAQPage` on `/faq`, `SoftwareApplication`/`Product` where honest);
  meaningful `alt` text. Target keywords (weave naturally, never stuff): *Indian corporate law
  compliance, Companies Act 2013 compliance software, statutory compliance India, company law AI,
  legal citation verification, corporate compliance for startups India, Company Secretary tools,
  ROC/MCA compliance, verified legal answers, point-in-time statute.*
- **FAQ** with real Q&A + `FAQPage` schema.
- **Privacy policy** (`/privacy`): a genuine, well-structured policy — what data is collected (waitlist/
  pilot form fields, analytics/cookies), purpose, legal basis, retention, sharing/processors, user
  rights, contact, and **India DPDP Act, 2023 awareness + GDPR-style clarity**. Clearly written, not
  boilerplate junk. Add a short cookie/consent notice and a "Data collection" explainer. (Mark it as a
  template to be reviewed by counsel — do not present it as legal advice.)
- **Consent / data collection:** a minimal, honest cookie/consent banner (default to privacy-
  preserving; no non-essential cookies without opt-in) and a clear statement of what the forms collect
  and why.
- **Accessibility:** WCAG AA (contrast, focus states, keyboard nav, 44px targets, `prefers-reduced-
  motion`, labelled controls, no colour-only status — the three answer classes must be distinguishable
  without colour).
- **Performance:** optimised images (`next/image`), self-hosted fonts, minimal JS, good Lighthouse/
  Core Web Vitals. **Analytics-ready** (a privacy-respecting analytics hook, disabled until consent).

---

## 8. TECHNICAL ARCHITECTURE & SYSTEM DESIGN (must be clean and integration-ready)

**Stack:** Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui. `next/font/
local` for the brand fonts. Framer Motion for the one restrained motion moment (respect reduced-motion).

**Structure & tokens:**
- Centralise the brand as **design tokens** (Tailwind theme + CSS variables) — the exact colours,
  type scale, spacing, radii above. Every component reads tokens; no hard-coded hexes in components.
- A small, documented component library: `Button`, `CitationChip`, `AnswerCard` (with `verified` /
  `deterministic` / `signal` / `abstained` variants), `CurrencyTimeline`, `SectionHeading`, `Faq`,
  `CTA`, `Nav`, `Footer`, `ConsentBanner`, `Field`/`Form`. Typed props, accessible, storybook-ready
  comments.
- Content in typed data modules (`/content/*.ts`) or MDX, so copy is editable without touching layout.

**Backend integration (design it so the real engine plugs in with near-zero rework):**
- Put all product data behind a typed API client (`/lib/api.ts`) with a **`MockProvider` today** and a
  `HttpProvider` ready for the Placedon backend. Model the real contracts so mocks match production:
  - `POST /v1/compliance-pack` — company facts → a cited evidence pack (exists in the engine).
  - `GET /v1/company/{cin}/standing` — the Verified Company Card (planned).
  - `GET /v1/company/{cin}/events` — the Company Event Log (planned; law-change + company events, dated).
  - `GET /v1/health`.
  - Response types mirror the engine's output classes: `verified_fact | deterministic_conclusion |
    predictive_signal`, each carrying `source`, `instrument`, `as_of`, and an `abstained` state.
- **Forms (waitlist / pilot):** a Next.js **route handler** (`/app/api/waitlist/route.ts`) with server-
  side validation (zod), spam honeypot, rate-limit-friendly, storing to a pluggable sink (env-config:
  a database/Sheet/webhook — do not hard-code a provider) and an email/confirmation hook. Capture only
  what's needed; record consent; never log secrets. Provide clear success/error states.
- `.env.example` documenting every config value. No secrets in the repo. Sensible error boundaries and
  a fail-closed posture (never render a fabricated legal figure if data is missing — show the abstain
  state).

**Quality gates:** TypeScript strict passes; `eslint`/`prettier` clean; components accessible; the
site builds and runs; a short `README` explaining the token system, how to swap `MockProvider` →
`HttpProvider`, and how to point the forms at a real sink.

---

## 9. EXECUTION STRATEGY (use sub-agents + an iterative build→verify loop)

Decompose and, where your environment allows, parallelise. Suggested sub-agents (adapt as needed):
1. **Design-system agent** — tokens, fonts, colour, the component library, the custom icon set. (Must
   finish first; everything depends on it.)
2. **Copy/brand agent** — all page copy, FAQ, privacy policy, metadata/SEO strings, applying the voice
   rules and banned-word list. Runs in parallel with design-system.
3. **Page-build agents (parallel)** — Home, How-it-works/Product, Pricing/Security/About, FAQ/Privacy/
   Waitlist. Each consumes the design system + copy.
4. **Integration agent** — the typed API client, mock/http providers, form route handler, env, error
   boundaries.
5. **QA/SEO/a11y agent** — Lighthouse, axe/contrast, structured data, sitemap/robots, responsive
   sweep, banned-word grep, grammar pass.

**The loop (run it, don't ship the first draft):** build a section → render/screenshot it → critique
it against this brief (brand fidelity, is it slop?, grammar, a11y, hierarchy) → refine → re-verify.
Repeat per page. Before "done", do one whole-site pass for consistency (spacing rhythm, one-accent-
per-view rule, mono-citation consistency, mobile).

---

## 10. DEFINITION OF DONE (acceptance criteria)

- Looks like a senior studio made it; passes the "is this AI slop?" test; one deliberate signature,
  quiet everywhere else.
- Strict monochrome + gold-accent-≤10% system honoured on every screen; abstain-grey used only for
  abstention; one accent element per view.
- Brand fonts self-hosted; every statute reference/figure/date in IBM Plex Mono; custom brand icons
  present.
- All copy real, grammatically correct, on-voice, banned words absent, self-explanatory landing page.
- Full route set built; SEO (meta + OG + JSON-LD + sitemap/robots), FAQ schema, real privacy policy,
  consent banner, data-collection statement all present.
- WCAG AA; responsive to 360px; reduced-motion respected; good Core Web Vitals.
- Typed API client with mock+http providers matching the real endpoint contracts; working, validated
  waitlist/pilot form with a pluggable sink and recorded consent; `.env.example` + `README`.
- TypeScript strict, lint/format clean, builds and runs.

## 11. HARD CONSTRAINTS (do not violate)
- Do NOT overclaim: pre-launch framing, no live-corpus/customer/accuracy claims, no fabricated stats or
  logo clouds, no invented statutory figures.
- Do NOT use the banned words. Do NOT make it navy/gold-heavy — monochrome with ≤10% gold accent.
- Do NOT ship lorem, stock blobs, gradient/glass slop, or a generic template.
- Ask me before assuming anything material you cannot infer from the brand kit, the docs, or this brief.

---

## 12. ANIMATION & INTERACTION MAP (where motion lives — and where it must not)

**Philosophy: motion is restraint.** ONE orchestrated signature moment; everywhere else quiet, fast
(≤250ms), and purposeful. Everything respects `prefers-reduced-motion` (render the final state, disable
non-essential motion). Animation must demonstrate the product or aid comprehension — never decorate.

| # | Where | What happens | Why it earns its place | Build with |
|---|---|---|---|---|
| 1 | **Hero — THE signature moment** | The "verified answer" assembles once on load (~1.5–2s): the headline settles, then the mono citation chip (`s.96(1)`), the instrument (`G.S.R. 880(E)`) and the as-of date snap into place beside the figure; the figure counts up once to `₹10,00,00,000`; the statutory-currency timeline draws left→right and the current node fills gold. | It IS the product, shown in one glance. The one place to spend boldness. | Framer Motion timeline + `@number-flow/react` for the count-up |
| 2 | **Section entrances** | Subtle fade + 16–24px rise, small stagger, fast. Once per element. | Gives the page rhythm without noise. | Framer Motion `whileInView` (viewport once) |
| 3 | **Statutory-currency timeline (interactive)** | Hover/tap a node → inline expansion of the operative words + figure at that date; active node scales slightly. No modal. | Lets a visitor *operate* the core idea. | Radix HoverCard/Popover + Framer `layout` |
| 4 | **Citation chip (interactive)** | Hover a `s.96(1)` chip → small popover with the verbatim provision + instrument + as-of date. | Demonstrates provenance, the whole thesis. | Radix HoverCard (shadcn) |
| 5 | **Three-answer-class explorer** | A segmented control flips `Verified fact / Deterministic conclusion / Predictive signal / Abstained`; the AnswerCard morphs between states. The **Abstained** state reveals *calmly* (slow, cool-grey) — never an error shake. | Shows the product's honesty as an interaction. | shadcn Tabs + Framer `AnimatePresence`/`layout` |
| 6 | **FAQ accordion** | Smooth height expand/collapse. | Standard, expected, accessible. | Radix Accordion (shadcn) |
| 7 | **Sticky nav on scroll** | Subtle background/blur/opacity shift after ~1 viewport; active-section indicator slides between links. | Orientation, quietly. | Framer Motion `layoutId` for the indicator |
| 8 | **CTA / button micro-interactions** | Gold-accent hover, a 3–4px arrow nudge, crisp focus ring; ≤200ms. | Signals interactivity; premium feel. | Tailwind + Framer |
| 9 | **Waitlist/pilot form** | Inline validation feedback; on submit the form morphs to a calm confirmation state; honest, specific error states. | Conversion moment; must feel trustworthy. | react-hook-form + zod + Framer `AnimatePresence` + Sonner |
| 10 | **ONE ambient touch (pick a single one, keep it barely-there)** | Either a faint film-grain/texture over the dark hero, OR a faint mono dot-grid masked toward the verified answer, OR a single slow "scanning" line that passes once over the answer to imply verification. | A thoughtful, non-generic atmosphere. | Canvas or CSS; static fallback under reduced-motion |
| 11 | **Route transitions (optional)** | Quiet cross-fade between pages. | Cohesion. Keep minimal. | Next.js + Framer |

**Explicitly forbidden motion (reads as AI slop):** parallax on everything, mouse-follow spotlight/
cursor gimmicks, confetti, marquee/auto-scrolling logo clouds, tilt-on-hover cards, gratuitous 3-D,
blob/gradient morphs, typewriter effect on every heading, infinite bouncing arrows. At most ONE ambient
device (row 10), used with discipline.

---

## 13. RECOMMENDED TOOLING & LIBRARIES (install / use these — all are npm, portable, best-in-class)

- **Motion:** `framer-motion` (primary — declarative, `whileInView`, layout animations, timelines) ·
  `@number-flow/react` (animated figures/count-up). Optional only if more cinematic scroll control is
  needed: `gsap` + ScrollTrigger (now fully free).
- **Interactive primitives (accessible):** `shadcn/ui` on **Radix** — Popover, HoverCard, Accordion,
  Tabs, Tooltip, Dialog. Use these for rows 3–6 above.
- **Smooth scroll (optional, sparing):** `lenis`. Do not overuse.
- **Forms & feedback:** `react-hook-form` + `zod`; `sonner` (toasts).
- **Fonts/SEO/assets:** `next/font/local` (self-host the brand fonts) · `next-sitemap` · `schema-dts`
  (typed JSON-LD) · `@vercel/og` (OG image from the brand mark) · `next/image` + `sharp`.
- **Icons:** `lucide-react` for utility icons **only**; the five brand marks are custom SVG components.
- **Optional / only if explicitly wanted:** `cobe` (a tiny monochrome globe, if an India motif is
  desired — used once, muted) · `lottie-react` (vector motion graphic — likely unnecessary). **Do NOT**
  pull in Three.js/R3F or heavy 3-D — it is off-brand for this product.
```


---

# ===== PART C — STANDING RULES / END-OF-TASK CHECKLIST (re-check before every commit) =====

# AGENTS.md — Placedon website (standing rules, re-read every turn)

This repo is the **Placedon** marketing website: Next.js 15 (App Router) + TypeScript (strict) +
Tailwind v4 + shadcn/ui. Placedon is an evidence-first legal-intelligence layer for Indian corporate
law (Companies Act, 2013). It answers only with the exact provision + amending instrument + operative
date, and **abstains** when it cannot verify. It is a **witness, not a tool.**

Full brief: see `codex-website-prompt.md`. These are the non-negotiables that must hold on **every**
change — check them before you consider any task done.

## Brand — do not drift
- **Colour is near-monochrome.** Base = near-black `#0C0C0D` + warm cream `#F4EFE6` (the "white") +
  a neutral warm-grey scale. **Accent = Brass Gold `#C9A24B`, ≤10% of any screen, ONE accent element
  per view.** `--gold-muted #9F743B` for citations only. Cool Grey `#5B6472` is reserved **only** for
  the "abstained / unknown" state — never decorative. No navy-dominant, no second accent colour.
- **Fonts (self-hosted from `brand-kit/fonts/` via `next/font/local`):** Fraunces (display serif) ·
  IBM Plex Mono (every section reference `s.96(1)`, figure `₹10,00,00,000`, instrument `G.S.R. 880(E)`,
  and date) · Inter/Archivo (body). Mono citations are the brand signature — never paraphrase a section.
- **Logo:** use the files in `brand-kit/logo/` (white on dark, ink/gold on light); inline SVG where possible.
- Everything reads from central design tokens. No hard-coded hex in components.

## Voice — Terse. Traceable. Unsparing.
- **Claim, then evidence.** Split the assertion from its basis. Filter test for every sentence:
  *would this appear in a judgment?* If it reads like advocacy or sales copy, cut it.
- **Banned words (any = failure):** streamline, empower, solution, easy, smart, seamless, revolutionary,
  unlock, supercharge, effortless, game-changer, cutting-edge.
- **Words in:** provision, verified, section [number] (mono), abstains, liability, instrument, operative.
- Register: ~80% formal, calm/confident; humility appears once — in abstention.

## Honesty — do not overclaim
- **Pre-launch framing.** No live-corpus, customer-count, or accuracy-track-record claims. No fabricated
  metrics or logo clouds. **Never invent a statutory figure/section/date** — if unsure, show the abstain
  state, don't guess. Primary CTAs: "Request a pilot" / "Join the waitlist."
- Privacy policy and any legal copy are templates for counsel review, marked "not legal advice."

## Design & motion discipline
- Corporate, editorial, authoritative — **not** a generic template and **not** AI slop.
- Forbidden: purple/blue gradient heroes, glassmorphism everywhere, emoji section markers, everything
  centered, `rounded-lg`+accent-bar on every card, stock abstract blobs, Inter-as-display, fabricated
  logo walls, parallax-on-everything, mouse-spotlight gimmicks, confetti, tilt cards, gratuitous 3-D.
- Corners ≤6px. Shadows minimal. **One orchestrated hero motion moment; everywhere else ≤250ms,
  purposeful.** Respect `prefers-reduced-motion` (render final state). At most ONE ambient device.

## Engineering standards
- TypeScript strict; eslint/prettier clean; builds and runs. Accessible: WCAG AA, visible focus,
  keyboard nav, 44px targets, labelled controls, no colour-only status (the answer classes must be
  distinguishable without colour).
- Product data behind a typed API client with a `MockProvider` now and an `HttpProvider` matching the
  real backend contracts (`/v1/compliance-pack`, `/v1/company/{cin}/standing`, `/v1/company/{cin}/events`;
  output classes `verified_fact | deterministic_conclusion | predictive_signal` + `abstained`).
- Forms (waitlist/pilot): server-side validation (zod), honeypot, pluggable sink via env, recorded
  consent, no secrets in the repo, `.env.example` maintained. **Fail closed** — never render a
  fabricated legal figure when data is missing; show the abstain state.
- SEO (metadata, OG, JSON-LD, sitemap/robots), FAQ schema, real privacy policy + consent banner present.

## Before you call anything done
Run the checklist: monochrome + ≤10% gold held on every screen · abstain-grey used only for abstention ·
mono on every statute reference · brand fonts self-hosted · custom brand icons present · copy real,
grammatical, on-voice, no banned words, self-explanatory · a11y AA · reduced-motion respected ·
responsive to 360px · no overclaiming · no invented figures.
