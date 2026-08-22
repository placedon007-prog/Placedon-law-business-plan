# Placedon — Law Business Plan

Scope: **corporate and financial law — the Companies Act, 2013, and nothing else.**
PoSH is out of scope. The DPDP Act, 2023 is out of scope (decision 2026-08-16 —
see TECHNICAL_PLAN.md §7.1). AI law is excluded until an enacted statute exists.

- [Business Plan](docs/BUSINESS_PLAN.md) — buyer, scope, unit economics, go-to-market, risks
- [Technical Plan](docs/TECHNICAL_PLAN.md) — architecture, the DerivedDate design, the SDF lookup problem, build order
- [Design System](docs/DESIGN_SYSTEM.md) — colors, typography, components, page-by-page UI spec
- [UX Interaction Spec](docs/UX_INTERACTION_SPEC.md) — the three answer states, the currency strip, and the rule that governs them: refuse when a provision cannot be *dated*
- [Interviews](docs/INTERVIEWS.md) — four, incl. the first company-side one; the buyer was named unprompted from the buying side
- [Harvey Analysis](docs/HARVEY_ANALYSIS.md) — what "Harvey for India" would mean, and why the wedge is the opposite of it

## Repository layout

| Path | What it is |
|---|---|
| [`docs/`](docs/) | Business plan, technical plan, interviews, design system, Harvey analysis |
| [`backend/`](backend/) | **The verification engine.** Corpus admission, retrieval, evidence packs, claim validation, the Section 96 slice. 35 test suites, no dependencies |
| [`landing-page/`](landing-page/) | Marketing site and waitlist |

The backend is where the product thesis is actually implemented. It runs an existing language model
behind a verified legal corpus rather than training one — and currently runs with **no model wired
at all**, because the parts that must be right do not depend on one.

```bash
cd backend
python3 scripts/slice_s96.py     # matter -> s.96 -> derived deadline -> draft -> provenance
./scripts/run_tests.sh
```

`backend/` deliberately excludes the statutory corpus itself. Copyright Act 1957, s.52(1)(q)(ii)
permits reproducing an Act only together with original matter, and a public repository of clean
statutory text is an Act download. It regenerates from `backend/scripts/ingest_companies_act.py`.
See [`backend/README.md`](backend/README.md).

Written 2026-08-16. Every business-plan number is a hypothesis except the one
measured figure (₹2.91 marginal cost per answer) until ten conversations with
practising Company Secretaries validate or correct the rest.
