# Placedon — Feature Technical Plan & Deep Analysis

**Written:** September 2026 · **Grounded in:** `placedon-law-backend` @ `8df7919` (995 files) and this
business-plan repository.
**Status of every claim below:** each feature names what the engine already holds vs. what must be built,
so this is an implementation plan, not a wish list.

> This document is the technical companion to the layman-language feature summary. It is **analysis and
> plan**, not a claim that any feature ships today. Where a capability does not yet exist it is marked
> `BUILD` or `WIRE DATA`, never asserted as done.

---

## 0. The one design decision that governs everything

Placedon is a **verification system**, not a legal-answer generator. The language model is the
**least-trusted component**: it never decides whether a law applies, never supplies a date, never selects
an authority, and never invents a citation. Those are done by deterministic code that can be read and
tested. This is forced by three measured findings (not preferences):

1. **Static RAG retrieves the date-applicable statutory version 0% of the time** (Cymbler et al. 2026,
   32,436 versioned articles). Point-in-time correctness is won in the *corpus*, not the model.
2. **Stronger-reasoning models are *worse* at temporal applicability** (Huang et al. 2026) — they collapse
   onto "apply today's law."
3. **LLM-as-judge is unsafe here** — it inherits the recency bias it is meant to detect (Magesh et al.).

**Consequence:** a better model does not close our gap and a worse one does not open it. The moat is
statutory currency + the admission gate + a small trained entailment head.

---

## 1. Architecture — a lattice, not a RAG pipeline

The standard legal-AI design (`parse → embed → retrieve → generate → check`) fails because **nothing
downstream of a bad retrieval can detect a bad retrieval** — a cosine search always returns its top-3,
even for a question the corpus cannot answer (measured: naive RAG answered 5/5 unanswerable questions
with confidence; the lattice abstained 0/5, correctly). Placedon instead asks *"is there a provision that
governs this, and has anyone verified our reading of it?"*

**Four layers, only two touch a model:**

| Layer | Model? | Modules | Role |
|---|---|---|---|
| **Decision** — applicability, dates, in-force, thresholds, obligations | **No model** | `admission.py`, `as_of.py`, `derived_date.py`, `obligations.py`, `s185/186/188` | This *is* the product |
| **Retrieval** — find governing spans | Encoder (MIT) | `legal_retrieval.py`, `corpus_retrieval.py`, `chunk_retrieval.py`; InLegalBERT rerank next | Keyword+IDF now; dense only if an eval demands |
| **Entailment** — does the claim follow from the span? | Trained head | `cascade.py` (E6→E5→E4→E3), `ground_span.py`, `entail_*` | SUPPORTED / NOT_SUPPORTED / NO_ANSWER |
| **Narration** — phrase verified results / fill draft slots | Claude API | `model_adapter.py`, `drafting.py` | Least-trusted; closed-world; fail-closed |

---

## 2. The core model, layer by layer

### 2.1 Decision engine — deliberately no model
Applicability and dates are decided by deterministic code. A model here would introduce a hallucination
surface into the one place that must be provable, so it is barred. `admission.py` gates what evidence is
admissible; `as_of.py` / `derived_date.py` compute point-in-time results; `obligations.py` (1,448 lines)
is the obligation register.

### 2.2 Retrieval — InLegalBERT, and why not embeddings-only
- **Now:** keyword + IDF over statute structure (section → sub-section → proviso). Beats embeddings on
  entity-rich exact match at this corpus size (Sciavolino et al., EMNLP 2021).
- **Next:** `law-ai/InLegalBERT` as a reranker — pretrained on ~5.4M Indian legal documents, **MIT**
  (commercially clean), CPU-cheap. Add dense retrieval only when an eval proves keyword recall
  insufficient.

### 2.3 The entailment head — the one model that earns training
The system can check that a citation *exists*, is *admitted*, and is *in force*. It cannot yet check that
a produced sentence *follows from* the served text — and inapplicable/misgrounded authority is **23–38%**
of hallucinations (Magesh et al.). This is where a trained model belongs, and **the labels already exist
in the corpus**:

| Label type | Source | Why valuable |
|---|---|---|
| **Positive pairs** | (section text, its own amendment-footnote claim) — 434 parsed records, 24 corroborated | Real "text supports claim" examples |
| **Hard negatives** | *prior* wording vs *current* wording of an amended span | Near-identical, legally opposite — the exact "serves repealed law as current" failure |
| **Date negatives** | same claim, wrong as-of date (`timeline.py`) | Point-in-time discrimination |
| **Instrument negatives** | `ACT:…:S56` vs `RULE:…:R56` (`legal_ref.py`) | Act-vs-Rule confusion |

**Method:** a fine-tuned NLI head on InLegalBERT + **ContractNLI** (CC-BY-4.0). Never ILDC/HLDC/IL-TUR/
Pile of Law (non-commercial). It runs as the `E3–E6` cascade: E6 gates (may refuse, never accept),
specialists bind role/quantity, E3 is the weak generalist fallback. Abstention (`NO_ANSWER`) is distinct
from refusal (`NOT_SUPPORTED`).

### 2.4 The descriptive (narration) model — Claude, on a tight leash
Provider: **Anthropic Claude** (Sonnet tier) via API — chosen for character-level citation provenance;
**not** a fine-tune. It lives behind `model_adapter.py` (the only place an LLM is called) under a hard
**generation contract**: receives only admitted evidence; may produce only language entailed by it;
never selects authority, decides applicability, or supplies a date; output citing an id absent from the
pack is **rejected, not repaired**; malformed output fails closed to `INSUFFICIENT_EVIDENCE`.

---

## 3. The features

Each feature names its pipeline, what it reuses (built), what is new, its data source, and the model's
constrained role.

### F1 · Verified Company Card  (the wedge / "Bloomberg" pillar)
**What:** CIN or name → a dated, source-cited legal-standing snapshot: identity & active status,
directors, s.164 disqualification, s.77 charges, strike-off risk, capital, red flags. Unverifiable fields
render as `not established`, never guessed.

```
CIN → corporate_data.py / mca_aggregator.py (licensed OR free OGD bulk, never scraped)
    → entity_graph.py (companies · directors · holdings · charges, dated, tri-state)
    → standing checks (status, s.164, s.77, strike-off, s.185/186/188 exposure)
    → currency.py + as_of.py (every field dated to its instrument)
    → the Card (+ Verified Report: hash-stamped, reproducible)
```
- **Reuse (built):** `entity_graph`, `corporate_data` seam, `mca_aggregator` adapter (refuses w/o
  credentials — no scraping), `diligence_pack`, `cascade`, `api.handle`.
- **Build:** OGD CIN-master ingest, disqualification/strike-off list ingest,
  `GET /v1/company/{cin}/standing`, the Card UI + PDF/shareable report.
- **Data:** Phase 1 = free public bulk (OGD CIN master ~3.67M records, ₹0) + MCA published lists; Phase 2
  = licensed MCA aggregator for live charges/directors.
- **Model role:** none. Registry facts + deterministic checks only.
- **Three output classes, enforced in UI:** *verified fact* / *deterministic conclusion* / *predictive
  signal* — never blurred.

### F2 · Document Review  (draft analysis) — two independent layers
**Layer 1 — Authenticity** (`doc_verification.py`): returns *dimensions*, never a binary real/fake —
file integrity, signature, cert chain, revocation, trusted timestamp, issuer match, official-record
match. `COMPLETE` only if every dimension is established, else `INCOMPLETE_VERIFICATION`.

**Layer 2 — Legal analysis** (this is `PRODUCT_SCOPE.md`'s "one workflow"):
```
upload → classify document → extract facts+spans (extraction_schema; model proposes, span-verified)
       → determine law applicable ON THE DOCUMENT'S DATE (as_of)
       → run applicability/obligations (obligations, s185/188)
       → lawyer-reviewable report: "provisions that MAY apply" + defects + gaps; ABSTAIN where insufficient
```
- **Reuse (built):** `doc_verification`, `extraction_schema`, `claim_schema`, `claim_verifier`,
  `cascade`, `obligations`, `as_of`, `admission`, `assessment`, `matter`, `diligence_pack`.
- **Build:** document classifier, **OCR intake**, review UI.
- **Model role:** *extract only* — proposes facts, each span-verified; the system decides applicability.
- **Risk (load-bearing):** all four interviews say documents arrive on **paper**; the test corpus is all
  text-extractable — the opposite. **Collect 20 real documents before building intake.**

### F3 · Grounded Assistant  (chatbot)
> NON_GOAL flag: `NON_GOALS.md` bars a *general* legal chatbot. This is **not** that. It answers only from
> verified sources or abstains.
```
question → retrieve (legal_retrieval, keyword+IDF) → closed evidence pack (evidence_pack, MODE_MODEL, admission)
        → model_adapter.run() (cite pack ids only; typed claims) → claim_verifier + cascade.verdict()
        → answer WITH citations+dates  OR  INSUFFICIENT_EVIDENCE
```
- **Reuse (built):** `model_adapter`, `cascade`, `claim_verifier`, `legal_retrieval`, `evidence_pack`,
  `admission`, `as_of`.
- **Build:** `POST /v1/ask`, conversation state, chat UI (answer → evidence panel → abstention).
- **Model role:** narrate only. Never decides, never cites outside the pack; never runs on an empty pack.

### F4 · Controlled Drafting  (draft generation)
> NON_GOAL flag: "document generator" is barred *as free-text prose*. We win on **provenance**, not prose.
> Already architected in `drafting.py` + `provenance_slots.py`.

A draft is a set of **typed slots**: `TEMPLATE_TEXT · USER_FACT · SOURCE_QUOTE · DERIVED_FACT ·
MODEL_SUGGESTION · UNKNOWN`. `approve(reviewer, at)` **raises** if any slot is `UNKNOWN` or
`MODEL_SUGGESTION` — an unsupported draft cannot be approved. Derived dates carry their working; quotes are
verified verbatim against the provision.
- **Reuse (built):** `drafting.py`, `provenance_slots.py`, `agm.py`. Currently **one** template (AGM
  notice); **no model wired**.
- **Build:** template library (board resolution, RPT approval, EGM notice, director appointment) with
  slots mapped to sources; wire the model to fill `MODEL_SUGGESTION` slots (still approval-blocked); the
  drafting UI with the provenance panel.
- **Model role:** suggest only — output labelled `MODEL_SUGGESTION`, blocks approval until sourced.

### Shared spine (all four)
```
model_adapter · cascade(E3–E6) · claim_verifier · as_of · entity_graph · obligations · currency · abstention
```

---

## 4. Roadmap & validation gates

The largest historical risk is building ahead of evidence. **Phase 0 is not code**, and each phase clears
a gate before the next.

| Phase | When | Deliverable | Gate |
|---|---|---|---|
| **0** | Wk 0–1 (no code) | Mock the Verified Company Card; show to the company-side interviewee + 4–5 corporate lawyers; task **S-002** (human downloads G.S.R. 700(E)) | Would they use it before a deal/onboarding? Which fields would a partner rely on? |
| **1** | Wk 1–6 | **F1** Card + Report on **free OGD data**; `GET /v1/company/{cin}/standing` | 5 users run it on a real counterparty and return within 2 weeks (retention, not sign-ups) |
| **2** | Wk 6–14 | **F3** Currency/As-of + F5 Compliance Matrix surface; **F2** Document Review begins; contract a licensed MCA aggregator | Do Phase-1 users adopt it? Does anyone pay? Price only once retention shows |
| **3** | Mo 4–8 | **F2** full, **F3** Assistant, **F4** Drafting, Dossier + Monitor; persistence + tenant isolation | Build the platform only once the wedge has paying, returning users |

---

## 5. Model & build sequence
- **M0** — unblock (S-002) & confirm keyword-retrieval recall.
- **M1** — mine the entailment label set from the corpus (positive/hard-negative/date/instrument) +
  ContractNLI. Highest-leverage ML work; needs no new data rights.
- **M2** — PEFT-fine-tune the NLI head on a short-rented GPU; evaluate on a preregistered set, two axes;
  ship into the `E3–E6` cascade.
- **M3** — wire narration (Claude) in **shadow mode**, measured against reviewer decisions before user-visible.
- **M4** — features in wedge order: F1 → F2 → F3 → F4, each gated on the prior showing returning users.

---

## 6. Training strategy & infrastructure
- **Live data ≠ live training.** Fresh law/company facts flow through **retrieval updates** (a current,
  dated source database), *not* weight updates. Fine-tuning does not preserve exact amounts/dates/
  citations; new law contradicts old; corrections and licence-withdrawal must be traceably removable.
- **Fine-tune only the entailment head**, only after the corpus-mined labels exist. No foundation model,
  no broad "Indian legal reasoning" model — no data rights, no budget, not the moat.
- **Compute:** deterministic engine + keyword retrieval = **CPU, ₹0**; InLegalBERT rerank = CPU; NLI
  fine-tune = a short-lived rented GPU (hours); narration = Claude API, budget-gated. **No** vector DB,
  graph DB, k8s, or GPU fleet until a measurement demands it.
- **Data path (never scraped):** India Code + e-Gazette (human-browser, hashed) for statute/Gazette;
  free OGD bulk then a **licensed** MCA aggregator for company data; Indian Kanoon API (attribution) for
  case law. Postgres + object store when the dossier arrives.

---

## 7. Evaluation methodology
- **Preregister** the question set before running anything.
- **Two axes:** correctness *and* groundedness — `hallucinated = incorrect OR misgrounded`.
- **Deterministic scoring nuggets, no LLM judge** (it shares the bias under test).
- **Metrics:** fact-extraction P/R · evidence-span precision · **false-accept rate on legal rows** ·
  abstention usefulness · reviewer-correction rate · cost & latency per answer.
- **Coverage starts at 0% by design** — a row with no verified source refuses; coverage grows as sources
  are acquired, never as the gate is loosened.

---

## 8. Risks & what would falsify the thesis
- **Entailment labels thinner than hoped** (434 amendment records may under-cover) — supplement with
  ContractNLI + hand-built hard negatives; measure before relying on the head.
- **OCR / physical documents** — corpus is text-extractable, reality is paper. Settle with 20 real
  documents before Document Review intake.
- **Licensed data is a contract, not code** — deep company fields wait on an MCA-aggregator agreement;
  Phase 1 runs on free OGD bulk.
- **Model IDs / provider tiers rot** — pin and re-check; a plan naming a model without checking fails on
  first run.
- **NON_GOALS tension:** the Assistant and Drafting are current non-goals; they are defensible *only* in
  the constrained forms above (grounded-or-abstain; slots-with-provenance). Do not ship a general chatbot
  or a free-text generator.
- **Falsifiers:** a practitioner calls the abstention useless ("just answer"); nobody is ever caught by a
  stale figure; the as-of date reads as hedging, not rigour. All answerable in ten interviews, none by
  building more.

---

> **The rule that governs the whole system:** the model may propose, the system must verify, the reviewer
> decides.
