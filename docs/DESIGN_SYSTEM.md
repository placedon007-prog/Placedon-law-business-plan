# Placedon — UI/UX Design System

Scope: corporate and financial law — the Companies Act, 2013. DPDP is out of scope.
Written 2026-08-16.
Condensed from the full design spec — kept what's proven-good, flagged what doesn't
apply to this scope, deferred what's premature. See notes at each section.

## 1. Design philosophy

Quiet authority. No gradients, no shadows, no rounded corners beyond 4px. Every
pixel should communicate: this system does not guess.

| Principle | Rule | Why |
|---|---|---|
| Restraint | Max 3 colors on any screen | Legal professionals distrust visual noise |
| Hierarchy | Font weight > font size > color | Density without clutter |
| Truth | Every claim has a source badge | The UI mirrors the verifier architecture — abstention and verification are both first-class visual states, not one being "success" and the other "error" |
| Safety | The abstention color is never red | Abstention is correct behavior, not a failure |
| Speed | No animation > 200ms | CS professionals do not wait for UI |

**Golden rule:** if a screen has more than one accent-colored element, the design has failed.

## 2. Color system

**Revision, 2026-08-16:** the brown accent (formerly "Seal," `#4A2E1B`) is replaced
with a slate gray across the system. Brown skewed the product toward a leather/legal-office
cliché; slate gray reads as more contemporary and closer to how Claude.ai's own real
design language and Harvey's product both lean cooler and more neutral. Every prior
reference to "Seal" below now means this slate gray.

| Token | Hex | Usage |
|---|---|---|
| Ink | `#0A0A0A` | Primary text, headers, borders |
| Parchment | `#F5F3EF` | Background, cards, surfaces (90% of screen) |
| Slate (formerly Seal) | `#475569` | CTAs, active states, verified badges — 1 element per view max |
| Ink-80 | `#4A4A4A` | Secondary text, metadata, timestamps |
| Ink-40 | `#B5B5B5` | Disabled states, placeholders, dividers |
| Ink-10 | `#E8E6E2` | Hover backgrounds, subtle borders |
| Slate-80 (formerly Seal-80) | `#334155` | Hover states on Slate buttons |
| Slate-20 (formerly Seal-20) | `#E2E8F0` | Light accent backgrounds, verified-by highlight |
| Caution | `#8B4513` | Abstention warnings — never red |

## 3. Typography

**Revision, 2026-08-16:** Inter is replaced as the Display/H1 typeface. Real Claude.ai
design guidance explicitly excludes Inter, Roboto, Arial, and Space Grotesk as "overused
by AI" — Playfair Display (serif, free/open, SIL OFL) takes its place for headings,
giving the product an editorial, printed-document feel appropriate to a legal product.
Helvetica Bold is used sparingly and only as a system-font reference (`"Helvetica Neue",
Helvetica, Arial, sans-serif`), never as a hosted webfont file — Helvetica is a commercial
Monotype typeface; referencing it as a system font renders the genuine typeface on
Mac/iOS with no redistribution, and falls back cleanly elsewhere.

| Role | Font | Weights |
|---|---|---|
| Display / H1 (headings) | Playfair Display | 400, 600, 700 |
| Body / UI text | System sans (`-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`) — Helvetica Bold used subtly, for emphasis only, never body copy | 400, 700 |
| Monospace | JetBrains Mono | 400, 500 |
| Hindi | Noto Sans Devanagari | 400, 500 |

| Token | Size | Weight | Usage |
|---|---|---|---|
| Display | 32px | 500 | Page titles only |
| H1 | 24px | 500 | Section headers |
| H2 | 18px | 500 | Card titles |
| H3 | 14px | 600 | Labels, badges, nav |
| Body | 14px | 400 | All readable text |
| Caption | 12px | 400 | Metadata, timestamps, sources |
| Mono | 13px | 400 | Section citations, dates, amounts |

**Rules:** no font size below 12px. Section citations (e.g. `s.96(1)`) always Mono —
this creates visual authority and distinguishes cited text from prose at a glance.
Never italicize except input placeholders — italics read as uncertain, which is the
wrong signal for a product whose entire value is certainty-or-honest-refusal.

## 4. Spacing & grid

Base unit 4px (`xs` 4 / `sm` 8 / `md` 16 / `lg` 24 / `xl` 32 / `2xl` 48 / `3xl` 64).
12-column grid, 24px gutters, max content width 1280px, sidebar 240px (collapsible
to 64px).

## 5. Core components (condensed — see prior full spec for exact pixel values)

- **Buttons:** Primary (Slate bg), Secondary (outlined), Ghost, Danger (Caution),
  Verified (Slate-20 bg). 4px radius always — "this is law, not social media."
- **Cards:** White bg, 1px Ink-10 border, never a shadow. Left-border accent variants:
  Slate-20 (verified answer), Caution (abstention). No Distress variant — see §7.
- **Badges:** Verified (Slate-20/Slate), Pending (Ink-10/Ink-80), Abstained (Caution-tint),
  Section citation (Ink-10/Ink, Mono font).
- **Tables:** Ink header / Parchment text, Mono for dates/sections/amounts, sortable.
- **Modals:** Fade only, no slide — sliding reads as frivolous for this product.

## 6. Pages

| Page | Purpose | Status |
|---|---|---|
| Dashboard | At-a-glance compliance status across clients | Keep, no changes needed |
| Ask | The core interaction — question in, verified/abstained answer out | Keep |
| Corpus Manager | View/verify provisions, coverage %, cost-to-complete | Keep |
| Client Manager | Company facts per client (CIN, capital, turnover, FY dates) | Keep |
| Deadlines Calendar | Visual timeline, overdue flagging | Keep. Day-granularity only — the hour-granularity case was DPDP-specific and is gone |
| District/ROC Officer Lookup | MCA Registrar of Companies contact lookup | Keep as-is — already scoped to Companies Act, not PoSH |
| Settings/Billing | Tier, usage, model cost breakdown | Keep |

## 7. Removed: the Distress Modal

The prior spec included an always-visible "Distress Button" opening a modal with
National Commission for Women helpline info, scoped to PoSH workplace-harassment
scenarios. **Removed entirely, not repurposed.** That content has no analog in a
Companies Act product, and shipping a leftover UI pattern with nothing true
to say would be exactly the kind of "confident but ungrounded" behavior this product
exists to avoid. If a genuine safety-valve need surfaces for this scope (e.g. a direct
link to the Data Protection Board's grievance channel), design it fresh, on its own
merits — don't force the old pattern to fit.

## 8. Deferred: the `/loop` agent control panel

The prior spec included a full internal admin dashboard for a 5-agent orchestration
system. Per TECHNICAL_PLAN.md §6, that system is not being built yet — there's no
query volume or customer base to observe. Do not build this page now. When there is
real usage to monitor, a single-page trace/cost viewer (what route fired, what it
cost, what it abstained on) is the right-sized version — not a multi-agent platform
with RBAC tiers.

## 9. Accessibility

WCAG AA minimum (4.5:1 contrast — Slate on Parchment measures 8.5:1). 2px Slate focus
outline on all interactive elements. Full keyboard nav. 44×44px minimum touch targets.
`prefers-reduced-motion` disables all transitions. Icons always paired with text or
a label — never color-only status indicators.

## 10. Implementation stack

Next.js 15 (App Router) + TypeScript, Tailwind CSS v4, shadcn/ui, Zustand for state,
TanStack Table, Recharts. No skeleton loaders — show real data or show the honest
abstention state, never a fake placeholder implying an answer is coming.
