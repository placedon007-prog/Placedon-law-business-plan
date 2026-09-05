# Model development — engineering assessment and staged plan

Written 2026-09-05 in response to a research plan proposing a PEFT/QLoRA fine-tuned
8B model, a Qdrant hybrid vector store, NCLT/e-Courts scraping, an entity graph, and
a 3D spatial investigative console for Indian corporate legal intelligence.

This is the engineer's answer: what in that plan is right, what reverses decisions we
have already recorded, and what is actually being built.

## 0. The verdict in one paragraph

**The plan's philosophy is right, and we already implement it more strictly than the
plan describes.** Its own refinement converged on our architecture — "the model should
act as a controlled transformation layer rather than an unconstrained reasoner",
"accuracy is a systems property, not a model property", "start from high-agreement
extraction tasks, not free-form legal reasoning", and an explicit refusal/abstention
dataset. Independent convergence on a design we shipped months ago is genuine
validation. **But five of its concrete recommendations reverse recorded decisions**,
four of them made this week. Those are not adopted, and the reasons are below.

## 1. Where the plan and this project agree

| Plan's principle | Our implementation |
|---|---|
| Model as controlled transformation layer, not reasoner | `checker/model_adapter.py` — four refusals fire *before* any model call |
| Retrieval is the system of record; generation is downstream | `cascade.py` E3→E6: a claim not entailed by a retrieved span is NOT_ESTABLISHED |
| Chunk by legal structure, not token windows | `checker/structural_chunk.py` — chunks on the statute's own units |
| Hybrid exact + semantic retrieval | BM25 shipped and measured (`chunk_retrieval.py`, `corpus_retrieval.py`) |
| Refusal/abstention as a first-class output | The five-state discipline; `CANNOT_DETERMINE` naming the blocking instrument |
| Citation must be structural, not string luck | Structural paths (`2(85)(i)`) carried with hash into the evidence pack |

The plan proposes building these. They exist, are tested, and are measured.

## 2. The five reversals — and why we decline each

### 2.1 PEFT / QLoRA fine-tuning of an 8B model
`NON_GOALS.md`: *"Fine-tuning or a foundation model — no data rights, no budget, and
not the moat."* All three still hold. Decisive point: **fine-tuning cannot produce the
thing we sell.** Our moat is statutory *currency* — that a threshold is ₹10 crore
operative from 1 Dec 2025 via G.S.R. 880(E). A model's weights are a snapshot; the
moment a Gazette notification lands, a fine-tuned model is confidently wrong and an
acquisition pipeline is merely out of date. Those are different failure modes and only
one is recoverable.

### 2.2 Qdrant / vector search
`NON_GOALS.md` cites Sciavolino et al. (EMNLP 2021): BM25 wins on entity-rich exact
match. More concretely, **we measured it yesterday.** Cross-section retrieval is
p@1 0.71 / recall@5 0.91 over 70 cases with zero dependencies. The operator took
decision A (ship BM25) and deferred decision B (embeddings) on 2026-09-04. Adding a
vector database now would reverse a decision taken against measurements, on the
strength of generic advice that has not seen the numbers.

### 2.3 NCLT / e-Courts scraping with proxy rotation
`CLAUDE.md`: *"Do not bypass the MCA WAF, robots restrictions, access controls, or
source terms."* This is not fastidiousness. We sell risk reduction to a CFO; a platform
one cease-and-desist from zero cannot be that product. The licensed path already exists
in code — `checker/corporate_data.py` and `checker/mca_aggregator.py` refuse to run
without a contracted aggregator and contain no scraping fallback, enforced by an AST
check.

### 2.4 Zero-human LLM labelling as ground truth
Rejected in `BLOOMBERG_FOR_INDIA_ANALYSIS.md` §3.2 as the exact hallucination trap this
project exists to refuse. A model may *propose* a label; it is not truth until a
deterministic check or a human review passes it. Model-assisted, never
model-authoritative.

### 2.5 The 3D spatial console
Declined in §3.3. Live telemetry that matters for Companies Act compliance is Gazette
amendments and registry filings, not ships and aircraft. A separate bet with a separate
buyer, not a feature of this one.

## 3. What we DID take from the plan

One idea was genuinely new, non-conflicting, and missing: **schema-constrained
extraction with deterministic field validators.** Strip the vLLM/Unsloth packaging and
the principle is ours — model proposes, system disposes — pushed one layer earlier, to
the *shape* of the output. A field that cannot possibly be valid should be rejected at
parse time, not argued about downstream. That needs no model, no GPU and no dependency.

Shipped as `checker/extraction_schema.py` (27/27, zero dependencies):

- **`validate_cin`** — the 21-character grammar plus an incorporation-year check,
  because a corrupted 4-digit year is the one component that still looks plausible.
  Unknown ownership codes are MALFORMED. State codes are deliberately *not* checked
  against a list: the MCA adds and renames them, and a stale allow-list rejecting real
  data is worse than a well-formed impossible value, which fails visibly at the registry
  instead of silently here.
- **`validate_din`** — eight digits; leading zeros significant and never stripped.
- **`validate_section_ref`** — parses `s.2(85)(i)` into a `SectionRef` whose `path()`
  matches what `structural_chunk.py` emits, so citation checking compares structures
  rather than strings.
- **`Extraction.admissible`** — any malformed field poisons the record. A good company
  name with a malformed CIN is not "mostly right"; it may be a *different company*, and
  merging on the name is precisely the entity-resolution error that produces confident
  nonsense.

Three-state discipline throughout: ABSENT (not proposed) ≠ MALFORMED (proposed and
impossible), and WELL_FORMED explicitly does not assert existence — every reason string
says so, so no caller can read well-formed as verified.

## 4. The staged plan, in the order that actually raises accuracy

The plan's own strongest sentence is *"accuracy is a systems property, not a model
property."* Taken seriously, that reorders its roadmap: the model layer moves last,
and most of what precedes it is already built.

| Stage | Work | Status |
|---|---|---|
| 1 | Structural chunking + BM25 retrieval + eval harness | **DONE**, measured 0.71/0.91 |
| 2 | Deterministic deciders on the entity graph (s.177/180/184/185/186/188/203) | **DONE**, 15 register rows |
| 3 | Schema-constrained extraction + validators | **DONE** (§3 above) |
| 4 | **Practitioner validation (H-C)** | **BLOCKING — not started** |
| 5 | Licensed corporate-data ingestion (contracted aggregator) | Adapter built; needs a contract, not code |
| 6 | Dense embeddings + RRF | Deferred by decision, revisited only if usage shows 0.71 is insufficient |
| 7 | Fine-tuning | Not planned. See §2.1 |

**Stage 4 outranks everything below it.** Building stages 5–7 before a practising
Company Secretary has reacted to what stages 1–3 already produce is the
grand-architecture-on-an-unvalidated-core failure our own strategy reviews warn about.
The evidence pack exists. The validation kit is live and accurate. What is missing is
one conversation.

## 5. The honest summary

The external plan is competent generic advice. Its weakness is that it is generic: it
does not know we measured BM25 at 0.71/0.91 and chose not to add a dependency, that our
moat is statutory currency rather than model capability, or that scraping the sources it
names would forfeit the risk-reduction product we sell.

Adopting it wholesale would mean spending months rebuilding, on a GPU we do not have,
with data we may not lawfully hold, a system whose verification discipline we already
possess — while the one genuinely blocking task remains a twenty-minute conversation
with a Company Secretary.
