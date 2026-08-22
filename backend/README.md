# Placedon backend — the verification engine

The part of Placedon that decides **which law may be used, which version applies, what evidence
supports a result, what was derived from user facts, and when a professional must review it.**

No language model is wired in. Every answer this produces today comes from an admitted provision,
a fact the user supplied, or arithmetic on the two. That is deliberate: the parts that must be
right do not depend on a model, and the model adapter was built against a stub so that swapping a
real one in is a single argument rather than a rewrite.

```
35 self-testing suites · red-team 85/85 · full suite ~4s · enforced by a pre-commit hook
```

## Run it

```bash
python3 scripts/preflight.py     # what this checkout needs; a fresh clone needs the corpus rebuilt
python3 scripts/slice_s96.py     # the Section 96 vertical slice, end to end
./scripts/run_tests.sh           # every suite
./scripts/install_hooks.sh       # pre-commit gate (blocks a red commit)
```

Python 3.12, **no third-party dependencies**. Nothing here needs a package manager.

## What is not in this repository

`corpus/companies_act/`, `corpus/sources/` and `corpus/rules/` are excluded — roughly 7.5 MB of
bare statutory text and source PDFs.

That is a legal decision, not a size one. Copyright Act 1957, s.52(1)(q)(ii) permits reproducing an
Act only *together with commentary or other original matter*; a public repository of 527 clean
statutory sections is an Act download, which `CLAUDE.md` explicitly forbids this project from
building. Gazette matter is free under (q)(i), but re-hosting the corpus wholesale serves no
purpose the ingestion script does not.

Regenerate it:

```bash
python3 scripts/ingest_companies_act.py
python3 scripts/build_section_index.py
python3 scripts/seed_admission.py
```

`corpus/admission/` (review state and audit trail) and `corpus/benchmark/` (frozen test fixtures,
which quote short passages as the subject of commentary) **are** included.

## Layers

| Layer | Module | Does |
|---|---|---|
| Provenance | `checker/provenance.py` | Evidence states; nothing reaches VERIFIED without a hashed, reviewed artifact |
| Admission | `checker/admission.py` | State machine; only reviewed material may be served to a model |
| Review | `checker/review_queue.py`, `scripts/review.py` | The human gate. Records a decision; never supplies one |
| Reference | `checker/legal_ref.py` | A provision number is never an identity — the Act's s.56 and a Rule's r.56 are different provisions |
| Retrieval | `checker/legal_retrieval.py`, `text_search.py`, `retrieve.py` | Exact + keyword; abstains rather than guessing |
| Evidence | `checker/evidence_pack.py` | The closed world a model may see, and nothing else |
| Assessment | `checker/assessment.py` | A non-admitted provision can never yield DOES_NOT_APPLY |
| Generation | `checker/model_adapter.py` | Refuses before the model; fails closed after it |
| Verification | `checker/claim_verifier.py` | Lexical triage. **Does not establish entailment** — see below |
| Attribution | `checker/attribution.py` | Which stage failed, and whether that is a defect or a correct refusal |
| Adversarial | `checker/redteam.py` | 8 frozen attacks, each asserting the layer that must catch it |
| Legal logic | `checker/agm.py`, `derived_date.py`, `as_of.py`, `amendment.py` | Deterministic; no model involvement |
| Drafting | `checker/drafting.py`, `provenance_slots.py` | Every value typed by origin; unsupported values block approval |

`docs/RELIABILITY_CONTRACTS.md` states the behaviours other code may rely on, each with the
reasoning and the test that enforces it.

## Known limitations, stated rather than buried

- **No entailment checking.** The lexical verifier tops out at `LEXICAL_CANDIDATE`, and
  `establishes_support()` is False for it. Against `corpus/benchmark/entailment_v1.json` it agrees
  with ground truth on **0 of 4** — it grades a true restatement of s.173 and a claim that swaps
  "thirty days" for "ninety days" identically, because "ninety" appears elsewhere in the section.
  No threshold fixes that.
- **The corpus is single-sourced.** Everything rests on one India Code PDF, cross-validated against
  India Code's own JSON endpoint but never against an independent publisher.
- **Point-in-time reconstruction is unverified.** `as_of.py` works; nothing external confirms it.
  No historical claim is made anywhere in the product.
- **Two source defects are recorded and preserved, not repaired** — see `docs/SOURCE_DEFECTS.md`.
  s.1 carries a non-statutory editorial tail; four sections carry pre-amendment text and are
  SUSPENDED.
- **30 review items are open.** The Board Powers Rules are parsed and unreviewed, so retrieval
  reports them as withheld rather than serving them.
