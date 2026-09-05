# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

The business plan and research record for **Placedon** — an evidence-backed statutory
compliance intelligence engine for Indian private limited companies.

**Agents: read [AGENTS.md](AGENTS.md) first.** It carries the working rules and applies
to every agent (Codex included); this file adds Claude-specific notes only.

**Scope is the Companies Act, 2013 — corporate and financial law.** The DPDP Act, 2023 is
**out of scope** (decision 2026-08-16) and was removed from the plan documents and the
landing page. Passages further down this file still describe DPDP mechanics (the 72-hour
breach window, `sdf_register`); they are **retained as a design record of a retired
direction, not as instructions**. Do not build them.

There IS a test runner and CI: `python3 -m pytest -q` (expect 12 passed, 19 skipped)
runs the engine's self-tests via the shim in `tests/`, and GitHub Actions runs the same
on Python 3.9/3.10/3.11 plus a flake8 syntax gate.

**`backend/` here is a partial, stale snapshot** — 145 files against the real 980,
missing the statute corpus. The engine's source of truth is the separate private
`placedon-law-backend` repository. Do not edit `backend/` here; the 19 skipped tests are
that absence, correctly reported, not a defect to fix.

**This repository is PUBLIC.** Anything committed is world-readable and remains in
history after deletion.

**PoSH is out of scope.** AI law is out of scope until an enacted statute exists to verify against.

## Repository layout

- `docs/` — three planning documents that together define the product:
  - `BUSINESS_PLAN.md` — buyer, scope, unit economics, go-to-market
  - `TECHNICAL_PLAN.md` — architecture decisions, the DerivedDate design, the SDF lookup problem, build order (8 steps)
  - `DESIGN_SYSTEM.md` — color tokens, typography, components, page-by-page UI spec
- `landing-page/` — static HTML/CSS prototype (no framework, no build step). Three pages: `index.html` (marketing), `dashboard.html`, `ask.html`. Uses a locally-hosted `Playfair Display` variable font (`fonts/`).
- `skills-lock.json` — Claude Code harness skill pins (not application code).

## Architecture decisions (from TECHNICAL_PLAN.md)

These are validated decisions, not preferences — do not reverse them without a measured reason:

- **Anthropic Claude only.** `CitationCharLocation` (character-level citation provenance) is the reason. No multi-provider routing.
- **Keyword + IDF retrieval, not embeddings.** Measured recall@3 = 1.00 vs. 0.75–0.95 for embeddings on the prior corpus. Re-measure with `bench_retrieval.py` after each corpus expansion phase, especially past ~50 sections.
- **No confidence floats.** Status is ordinal: `APPLIES` / `NOT_APPLIES` / `DISPUTED` / `ABSTAINS`. A prior safety benchmark showed confidence scores inverting trust.
- **Abstention is the default.** `verified_by` null → refuse. Coverage starts at 0% by design.
- **Hand-typing statute is barred.** Statute enters only via `ingest_*.py` from India Code or Gazette PDF, byte-verified. Six documented prior incidents of hand-typed statute silently dropping clauses.
- **Narrowing-only verifier changes.** Never loosen the verification gate to ship a feature.

## The DerivedDate pattern

Due dates are *computed* from an anchor (user-supplied fact) and a verbatim interval from the provision — they don't appear literally in statute. A `DerivedDate` is admissible iff `interval_text` appears verbatim in the cited provision AND re-running the arithmetic reproduces `result` exactly. The DPDP 72-hour breach notification window is a `DerivedDate` with an event-based anchor (`awareness_timestamp`) and hour-granularity — treat this arithmetic separately from Companies Act day/month intervals.

## The SDF lookup problem (critical)

**Do not write `is_significant_data_fiduciary()` as a threshold function.** SDF status (DPDP s.10) requires a Central Government gazette notification naming the specific Data Fiduciary — it is not self-computable from data volume or turnover. The correct pattern mirrors the district officer register (`register.py`): an `sdf_register` module that looks up `facts.cin` against a provenance-tracked external register and returns `ABSTAINS` when no gazette citation exists.

## Build order (from TECHNICAL_PLAN.md §7)

Steps 1–2 precede any corpus work deliberately:
1. `deadlines.py` — hour-granularity intervals (DPDP 72hr), tests-first
2. `sdf_register.py` — mutation-tested: no code path yields SDF status without a gazette citation
3. `ingest_companies_act.py` Phase 1 (s.96, s.92, s.137, s.134, s.173, s.2(85)) — `check_transcription.py` must pass
4. Wire Companies Act into `applicability.py` and `deadlines.py`
5. Phase 2 (~15 sections) — re-run `bench_retrieval.py`
6. `ingest_dpdp_act.py` — `check_transcription.py` must pass
7. Wire DPDP; `sdf_register.py` lookups; extend `_CONSEQUENCE` check for the Schedule penalty ceilings
8. Ten CS interviews (validates steps 1–7)

## Design system (from DESIGN_SYSTEM.md)

**Philosophy:** quiet authority. No gradients, no shadows, corners max 4px. One accent-colored element per screen maximum. No animation > 200ms.

**Color tokens:**

| Token | Hex | Usage |
|---|---|---|
| Ink | `#0A0A0A` | Primary text, headers, borders |
| Parchment | `#F5F3EF` | Background (90% of screen) |
| Slate | `#475569` | CTAs, active states, verified badges — 1 per view |
| Caution | `#8B4513` | Abstention warnings — never red |

**Typography:**
- Display/H1: Playfair Display (self-hosted variable font, SIL OFL)
- Body/UI: System sans (`-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`)
- Monospace: JetBrains Mono — used for all section citations (e.g. `s.96(1)`), dates, and amounts

**Implementation stack (when the app is built):** Next.js 15 App Router + TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Table, Recharts.

## What is deliberately not being built

The five-agent orchestration control plane (Senior Programmer / Legal Analyst / Document Analyst / Data Scientist / Compliance Auditor, 9 MCP tools, 6-model router, 7-level distributed tracing) is deferred until real query volume exists. Do not propose or implement it. A single internal debug view showing what `ask_engine.py` does (route taken, cost, abstention reason) is the right-sized version.

The `/loop` agent control panel page is also deferred — do not build it.

The Distress Modal from the prior PoSH build is removed entirely — do not repurpose it.
