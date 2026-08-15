# Placedon — Technical Plan

Companion to BUSINESS_PLAN.md. Scope: Companies Act, 2013 + DPDP Act, 2023.
Written 2026-08-16.

## 1. Non-negotiable principles

These carry forward unchanged from the prior (PoSH-era) build, because they were
validated by measurement, not asserted by preference:

| Principle | Evidence |
|---|---|
| The model never decides applicability | A deterministic engine reads `CompanyFacts` and a verified provision and returns a status. The model only narrates that decision. |
| No confidence float | A safety benchmark on the prior corpus rated two verbatim statutory quotes as more suspect than four outright fabrications — confidence scores inverted trust. Status is ordinal (`APPLIES` / `NOT_APPLIES` / `DISPUTED` / `ABSTAINS`), never a float. |
| Abstention is the default | `verified_by` null means refuse. Coverage starts at 0% by design, not by accident. |
| Keyword + IDF retrieval, not embeddings | Measured on the prior corpus: recall@3 = 1.00 (keyword+IDF, IDF-weighted) vs. 0.75–0.95 (embeddings), at near-zero latency and zero dependency cost. Re-measure before every corpus expansion past ~50 sections — this is a measured decision, not a permanent one. |
| Hand-typing statute is barred | Six documented instances of typed statute silently dropping a clause, one of which deleted a hard legal requirement. Statute enters only via `ingest_*.py` from a primary source (India Code, Gazette), byte-verified. |
| Every check is mutation-tested | Break the guard, confirm it fails, restore. A check that doesn't fail when broken is theatre. |
| Anthropic Claude only, not a multi-provider router | Deliberately rejected Groq/Gemini/DeepSeek/GPT-4o routing. Anthropic's SDK ships `CitationCharLocation` — character-level citation provenance — which no other evaluated provider has, and `max_retries`/backoff is handled natively rather than hand-rolled. |

## 2. The DerivedDate problem (carries forward, applies to both modules)

A due date is a number that does not appear in the statute — it is computed from an
anchor (a user-supplied fact) and an interval (verbatim text in the provision). A
verifier that rejects any figure absent from source text would reject every correct
deadline unless dates are treated as arithmetic, not retrieval.

```python
@dataclass(frozen=True)
class DerivedDate:
    result: date            # 2026-09-30
    anchor: date             # 2026-03-31, a fact the USER supplied
    anchor_label: str        # "close of the financial year"
    interval_text: str       # "six months" — verbatim from the provision
    interval: relativedelta  # parsed; must re-derive from interval_text
    citation: str            # "s.96(1), Companies Act 2013"
    quote: str                # the provision's sentence, verbatim
```

**Admissibility rule:** a `DerivedDate` passes iff `interval_text` appears verbatim in
the cited provision AND re-running the arithmetic on `(anchor, interval)` reproduces
`result` exactly. The date itself is never sought in the source — it is a claim about
arithmetic performed on the source, not a claim about the source.

### DPDP-specific application: breach notification

The 72-hour breach notification window (Rules, 2025) is a `DerivedDate` with a twist:
the anchor is an *event* ("becoming aware of a breach"), not a fixed date like FY close.
`resolve_anchor()` needs an explicit `awareness_timestamp` fact, and the interval is
"72 hours," not calendar days — test this arithmetic separately from the Companies Act
day/month intervals, since hour-granularity intervals are a new case this corpus hasn't
had before.

## 3. Applicability — the SDF lookup problem (new, DPDP-specific)

`applicability.py`'s existing pattern works by reading a threshold from the corpus and
comparing it to a `CompanyFacts` field:

```python
def is_small_company(facts: CompanyFacts) -> Status:
    threshold = get_threshold("s.2(85)")  # from corpus, never hardcoded
    if facts.paid_up_capital <= threshold.cap and facts.turnover <= threshold.turnover:
        return Status.APPLIES
    return Status.NOT_APPLIES
```

**This pattern does not extend to Significant Data Fiduciary status under DPDP s.10.**
SDF designation is not self-computed from volume/turnover — it requires a Central
Government gazette notification naming the specific Data Fiduciary or class, based on
non-cumulative risk factors. A company is not an SDF no matter how much data it
processes until that notification exists.

Required instead: an `sdf_register` module structurally identical to the district
officer register pattern already proven in the prior build — an external, provenance-tracked
lookup, not a computed threshold:

```python
def is_significant_data_fiduciary(facts: CompanyFacts) -> Status:
    entry = sdf_register.lookup(facts.cin)
    if entry is None:
        return Status.NOT_APPLIES  # not NOT_APPLIES-by-default silently — must log why
    if entry.notified_by_gazette:
        return Status.APPLIES
    return Status.ABSTAINS  # e.g. petition pending, not yet notified
```

Do not write `is_significant_data_fiduciary()` as a threshold function. It will be wrong
by construction — the statute does not permit self-classification.

## 4. Corpus — ingestion order

Same shape as the prior `ingest_posh.py`: source is India Code or the Gazette PDF,
byte-verified, `source_quality` set at ingest (the prior corpus had this unset on all
30 PoSH provisions — do not repeat that gap).

**Phase 1 — Companies Act, six sections (the annual cycle):**
s.96, s.92, s.137, s.134, s.173, s.2(85)

**Phase 2 — Companies Act, remaining core (~15 sections):**
s.2(62), s.90, s.135, s.139, s.153, s.164, s.203

**Phase 3 — DPDP Act core (~8 sections):**
s.2 (definitions), s.8, s.9, s.10, s.27, s.33, plus the Schedule and the 72-hour breach
Rule

Re-run the retrieval benchmark (`bench_retrieval.py`) after each phase. The known risk
from the prior architecture doc stands: keyword+IDF is measured correct at ~30 sections
and is expected to degrade somewhere before ~500. Combined Companies Act + DPDP corpus
lands around 70 sections — inside the safe range for now, but close enough to the first
re-measurement checkpoint that it should not be skipped.

## 5. Verifier — extensions needed

Two narrowing changes, consistent with the existing rule ("narrowing only, never
loosen the gate to ship a feature"):

1. **DPDP penalty amounts must be matched against the Schedule, not paraphrased.**
   The Schedule gives fixed rupee ceilings per violation category (₹250cr / ₹200cr /
   ₹50cr / ₹500cr / ₹10,000). A narration asserting a wrong ceiling for the wrong
   category is the same class of error `_CONSEQUENCE` already catches for Companies
   Act penalties — extend that same check to DPDP figures rather than writing a
   parallel mechanism.
2. **SDF status claims require the register citation, not the threshold citation.**
   The verifier must reject any narration that cites s.10 as if it were a computable
   threshold (e.g., "your data volume exceeds the SDF threshold") — s.10 does not
   state a self-executing threshold; only a gazette notification does.

## 6. What is deliberately not being built right now

**The five-agent orchestration control plane** (Senior Programmer / Legal Analyst /
Document Analyst / Data Scientist / Compliance Auditor agents, 9 MCP tools, 6-model
router, 7-level distributed tracing, HSM-signed audit log) proposed in an earlier
research document is not being built at this stage. It specs infrastructure for a
company with paying customers and query volume; this project currently has neither.
The ideas worth keeping — deterministic routing, human checkpoints tied to real
liability, "if it's not in the trace it didn't happen" — should inform a single
internal debug view showing what `ask_engine.py` already does (route taken, cost,
abstention reason), not a multi-agent platform. Revisit the full spec only once there
is real query volume to observe.

## 7. Build order

| Step | Work | Gate |
|---|---|---|
| 1 | `deadlines.py` extension: hour-granularity intervals (DPDP 72hr), tests first | Tests fail before they pass |
| 2 | `sdf_register.py`, mirroring `register.py`'s provenance discipline | Mutation-tested: no code path yields SDF status without a gazette citation |
| 3 | `ingest_companies_act.py` Phase 1, six sections, byte-verified | `check_transcription.py` passes |
| 4 | Wire Companies Act rules into `applicability.py` and `deadlines.py` | GO |
| 5 | `ingest_companies_act.py` Phase 2 | `bench_retrieval.py` re-run, recall@3 checked |
| 6 | `ingest_dpdp_act.py`, DPDP core sections | `check_transcription.py` passes |
| 7 | Wire DPDP rules; `sdf_register.py` lookups; extend `_CONSEQUENCE` for the Schedule | GO |
| 8 | Ten CS interviews (not code — see BUSINESS_PLAN.md §5) | Determines whether steps 1–7 were worth doing |

Steps 1–2 precede any corpus work deliberately, same discipline as before: if the
interval/register designs don't survive their own mutation tests, nothing downstream
is worth building.
