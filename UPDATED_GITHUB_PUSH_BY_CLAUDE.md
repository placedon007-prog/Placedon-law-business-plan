# Updated GitHub Push by Claude — Placedon project state

**Last updated:** 2026-09-10 · **Maintained by:** Claude (working sessions with the founder).
**Purpose:** one catch-up file so any AI (ChatGPT / Claude) or teammate can understand the *current*
state of Placedon without re-reading everything. Read this first, then the linked docs.

> Honesty note carried through this whole file: Placedon is **pre-launch**. Nothing here claims a
> live corpus, customers, or an accuracy track record. Where something is planned or in progress, it
> says so.

---

## 0. TL;DR
- **What it is:** a verification-first legal-intelligence layer for **Indian corporate law (Companies
  Act, 2013)**. It answers only with the exact provision + the amending instrument + the operative
  date, and **abstains when it cannot verify.** Brand thesis: *"a witness, not a tool."*
- **The wedge (strongest real demand):** *"verify a company's legal standing, as of today, with
  proof"* — counterparty verification. It was the only feature a real user asked for, unprompted.
- **Right now:** a pre-launch **marketing website is being built** (two Codex agents, overnight,
  local); the **primary-data validation kit is ready** but not yet run.
- **Biggest gap:** nothing is validated with real practitioners yet, and there is no shippable demo.
  Everything is currently *ahead of evidence.*

---

## 1. Problem & product
Indian corporate law changes constantly through subordinate legislation (rules, G.S.R./S.O.
notifications, circulars, amendments). No source reliably tells you what was in force **on the date
that matters**. Measured: static RAG retrieves the date-applicable statutory version **0%** of the
time; even paid legal AI hallucinates **17–33%**. Placedon's answer is verification + abstention.
- Detail: [`docs/FEATURE_TECHNICAL_PLAN.md`](docs/FEATURE_TECHNICAL_PLAN.md),
  [`docs/COMPANY_EVENT_LOG_SPEC.md`](docs/COMPANY_EVENT_LOG_SPEC.md),
  [`docs/WHITEBOARD_STRATEGY.md`](docs/WHITEBOARD_STRATEGY.md).

## 2. Features planned
F1 **Verified Company Card** (the wedge) · F2 **Verified Report** (hash-stamped "verified" record) ·
F3 **Currency Check** (is this figure still operative? + template staleness) · F4 **As-of-Date
Answer** (point-in-time law) · F5 **Compliance Matrix** (obligations from facts) · F6 **Company
Dossier** · F7 **Grounded Assistant** (cited answer or honest refusal — not a general chatbot) ·
F8 **Law-change Monitor**. The **Company Event Log** fuses a company's own events with the law
changes that move its obligations — see the spec. Full engineering detail in
`docs/FEATURE_TECHNICAL_PLAN.md`.

## 3. Model / architecture approach
- **Not a foundation model.** The LLM is the **least-trusted** component.
- A deterministic **"lattice"** (applicability → entailment gate → abstention), **not RAG**.
- The **only trained model is a small entailment head**; its labels are mined from the corpus's own
  amendment history (prior-vs-current wording as hard negatives). Narration = Claude API, tightly
  constrained (cite the closed pack or be rejected; fail closed to abstention).
- **Live data ≠ live training:** fresh law flows through retrieval, not weight updates.

## 4. Competitive position
- **Do not fight Harvey head-on** (their moat is capital + distribution). Win on the **statutory-
  currency + verification + counterparty** layer Harvey structurally does not do (its bar is citation
  *fidelity*, not *currency*; no legal-AI vendor markets point-in-time versioning).
- **Real near-competitors:** Komrisk / Avantis (amendment monitoring for enterprises), Lucio
  (published-price mid-market). **Do not** copy Harvey's document-review or free-text drafting — both
  were rejected on evidence for this buyer/budget (Indian-scan OCR collapse; lawyers reject AI
  drafting).

## 5. Brand identity (locked)
- **Palette — near-monochrome + one accent:** near-black `#0C0C0D` + warm cream `#F4EFE6` + neutral
  warm-grey; **Brass Gold `#C9A24B` as the single accent, ≤10% of any screen, one element per view**;
  Cool Grey `#5B6472` reserved for the **abstained/unknown** state only. (Reconciled from the original
  brand kit, which was navy+gold-heavy; the founder chose monochrome with a gold accent.)
- **Fonts:** Fraunces (display serif) · IBM Plex Mono (all citations/figures/dates) · Inter/Archivo
  (body). Assets live in `brand-kit/` (local, not in this repo).
- **Voice:** *Terse. Traceable. Unsparing. Claim, then evidence.* Filter: would it appear in a
  judgment? **Banned words:** streamline, empower, solution, easy, smart, seamless, revolutionary,
  unlock, supercharge, effortless, game-changer, cutting-edge. **Never invent a statutory figure.**

## 6. What is being built RIGHT NOW (overnight, LOCAL — not yet on GitHub)
- **`placedon-web/`** (local at `~/Desktop/PLACEDON/`) — Next.js 15 + TS + Tailwind + shadcn marketing
  site, built autonomously by Codex. Full site: Home, How-it-works, Product, Pricing, Security, FAQ,
  About, Privacy, Waitlist/Pilot, 404. Monochrome + gold, restrained animation map, a **backend-ready
  typed API client** (mock → http, matching the real engine contracts), a validated waitlist form,
  SEO + consent. **Status: in progress; local git only.**
- **`placedon-content/`** (local) — a second Codex agent produces the content/copy/legal/SEO pack
  (all page copy, 14–18 FAQ, privacy policy, terms, metadata, keyword clusters, JSON-LD). **To be
  merged into `placedon-web` in the morning.**
- These are **deliberately not pushed yet** — pushing while the agents are mid-build would collide
  with their own git commits. They'll be pushed as their own repos once the builds finish.

## 7. Validation / primary data (READY, not yet run)
- An empathy-map **discovery interview kit** + **two Google Forms** (a professional/buyer cohort and a
  law-intern early-adopter cohort) + a **results-analysis script**. Purpose: **validate the problem,
  not pitch the solution.** Interns targeted as an early-adoption channel and a proxy window into the
  buyer's pain (never as proof of demand).
- **Status:** forms and analysis are built; **interviews have not been run.** This is the single
  highest-leverage next action.

## 8. Key decisions (this session)
- **ICP:** corporate lawyers + Company Secretaries (buyer); startups/founders secondary; **law interns
  = adoption channel.**
- **Positioning:** honest pre-launch; **wedge = counterparty legal-standing verification.**
- **Website:** Next.js, monochrome + gold accent, full marketing site, pilot/waitlist CTAs.
- **Model:** verification-first; only the entailment head is trained; narration constrained.

## 9. Biggest gaps / risks (honest)
1. **Zero real validation** — no practitioner interviews run; demand is ~n=1.
2. **No shippable demo** — plans and specs exist; nothing a practitioner can use.
3. **No legal co-founder / domain verifier** — coverage stays 0% until a lawyer signs off on each
   provision; plus the company's own exposure (Bar Council rules, ToS, trademark, DPDP).
4. **Data access not started** — the licensed MCA aggregator is a contract, unsigned; task **S-002**
   (one human downloads G.S.R. 700(E), ~15 min) still not done, and it unblocks the currency engine.
5. **Focus** — many pivots; pick ONE wedge and ship it.
6. **Pricing / market model unvalidated** — still CS-shaped, ICP moved to lawyers; rebuild before
   quoting any number.
- **Highest-leverage next steps:** run the discovery forms · do S-002 · stand up one demo · find a
  legal advisor.

## 10. Where everything lives
- **This repo** — `placedon007-prog/Placedon-law-business-plan` (**PUBLIC**): business plan, design
  system, `docs/FEATURE_TECHNICAL_PLAN.md`, `docs/COMPANY_EVENT_LOG_SPEC.md`, and this file.
- **Backend engine** — `bubblebee1408/placedon-law-backend` (deterministic Python engine @ `8df7919`;
  `entity_graph`, `currency`, `as_of`, `obligations`, `cascade`, `model_adapter`, `drafting`,
  `doc_verification`, the licensed `corporate_data` seam).
- **Local only** (`~/Desktop/PLACEDON/`, not on GitHub): `brand-kit/`, `placedon-web/` (site,
  building), `placedon-content/` (content, building), `discovery-kit/`, the Codex prompts +
  `AGENTS.md`, `placedon-google-forms.gs`.
- **Artifacts** (private on claude.ai; URLs held by the founder): the Build-Plan roadmap, the Model-
  Architecture paper, the Discovery Kit.

## 11. For an AI reading this to catch up
Read in order: **this file** → `docs/FEATURE_TECHNICAL_PLAN.md` → `docs/COMPANY_EVENT_LOG_SPEC.md` →
`docs/WHITEBOARD_STRATEGY.md` → in the backend repo, `docs/BLOOMBERG_FOR_INDIA_ANALYSIS.md` and
`docs/PRODUCT_SCOPE.md`. That is the full current picture.

---
*This file is the running status log. Update it whenever a major decision, build, or validation result
lands, so it always reflects the true current state.*
