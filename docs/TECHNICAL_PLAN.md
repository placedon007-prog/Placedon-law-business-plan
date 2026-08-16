# Placedon — Technical Plan

Companion to BUSINESS_PLAN.md. Scope: **the Companies Act, 2013 — corporate and
financial law. DPDP is out of scope (decision 2026-08-16, §6.2).**
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

## 2. The DerivedDate problem

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



## 3. Corpus — ingestion order

Same shape as the prior `ingest_posh.py`: source is India Code or the Gazette PDF,
byte-verified, `source_quality` set at ingest (the prior corpus had this unset on all
30 PoSH provisions — do not repeat that gap).

**Phase 1 — Companies Act, six sections (the annual cycle):**
s.96, s.92, s.137, s.134, s.173, s.2(85)

**Phase 2 — Companies Act, remaining core (~15 sections):**
s.2(62), s.90, s.135, s.139, s.153, s.164, s.203


Re-run the retrieval benchmark (`bench_retrieval.py`) after each phase. The known risk
from the prior architecture doc stands: keyword+IDF is measured correct at ~30 sections
and is expected to degrade somewhere before ~500. The Companies Act corpus
lands around 50 sections — inside the safe range for now, but close enough to the first
re-measurement checkpoint that it should not be skipped.

## 4. Verifier — extensions needed

Two narrowing changes, consistent with the existing rule ("narrowing only, never
loosen the gate to ship a feature"):

1. **Companies Act penalty amounts must carry the amendment that set them.** s.92(5), s.137(3),
   s.203(5) and s.134(8) were each restructured by the 2019 or 2020 Amendment Acts, and s.203(5)
   was *not* touched by the 2020 Act. `_CONSEQUENCE` must reject a narration asserting a penalty
   figure whose amending instrument is not recorded.
2. **A prescribed figure requires the prescribing instrument.** Where a section says *"or such
   higher amount as may be prescribed"*, the operative number is not in the Act. A narration that
   states such a figure without its G.S.R. citation must be rejected — this is the s.2(85) failure
   in code form.


## 5. What is deliberately not being built right now

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

## 6. Build order

**Reordered 2026-08-16 — this order previously contradicted BUSINESS_PLAN.md §5.**

| Step | Work | Gate |
|---|---|---|
| 1 | `deadlines.py`, **day-granularity only**, tests first | Tests fail before they pass |
| 2 | `ingest_companies_act.py` Phase 1, six sections, byte-verified, with amendment lineage | `check_transcription.py` passes |
| 3 | Wire Companies Act rules into `applicability.py` and `deadlines.py` | GO |
| 4 | `ingest_companies_act.py` Phase 2 | `bench_retrieval.py` re-run, recall@3 checked |
| **5** | **Ten CS interviews** (not code — BUSINESS_PLAN.md §5) | **Determines whether any of steps 1–4 was worth doing** |

### 6.1 Why this was reordered

The previous order put **DPDP-specific work at steps 1 and 2** — hour-granularity intervals existed
solely for DPDP's 72-hour breach window, and `sdf_register.py` was Significant Data Fiduciary status
under DPDP s.10. Both were scheduled **before any Companies Act section was ingested**, which
directly contradicted BUSINESS_PLAN.md §5.

That contradiction is now moot: **DPDP is out of scope entirely** (§6.2), and both items are deleted
rather than deferred.

The reordering also moves the ten interviews from step 8 to **step 5** — the last step. They no
longer validate work already done; they decide whether any of it was worth doing.

**One thing kept deliberately:** `deadlines.py` still comes first, because the interval design must
survive its own mutation test before anything depends on it.

### 6.2 Why DPDP is out of scope

**Decision, 2026-08-16: the product is corporate and financial law — the Companies Act, 2013. Not
the DPDP Act.** Reasons, in order of weight:

1. **Different buyer.** Companies Act → practising Company Secretary. DPDP → Data Protection
   Officer, IT/security, in-house counsel. Different people, budget and sales motion. **Two buyers
   pre-revenue is two go-to-market motions pre-revenue**, which this project already rejected once.
2. **The corpus cost roughly doubles**, from ~₹25–50k to ~₹50–90k. At ₹5,000/month that is 5–10
   months becoming 10–18.
3. **No enforcement history to point at.** The Companies Act yields ~1,150 ROC adjudication orders in
   FY 2024-25 with named sections and rupee amounts. DPDP has effectively none. **A compliance
   product that cannot say what happens when you get it wrong is a reference tool, not a compliance
   tool.**
4. **Verification is harder.** A practising CS knows the Companies Act cold and will sign a reading.
   Who signs a DPDP reading while the profession is still forming views? `verified_by` means less
   where there is no settled position to check against.
5. **Stability.** §1 requires a second Act to be central *and* stable. DPDP is central but **not
   stable** — its subordinate legislation is still landing. If a second Act is ever added, Maternity
   Benefit or Gratuity are the safer candidates: both central, both settled, both verifiable by the
   same buyer.

**What was deleted, not deferred:** the SDF register (`sdf_register.py`), hour-granularity intervals,
the DPDP Schedule penalty check, and Phase 3 of the corpus.

**One good idea is kept.** The SDF analysis established that *some statutory statuses are not
computable from company facts at all* — they require an external register with its own provenance.
That is a real pattern and the Companies Act has instances of it. It is preserved as a design note,
not as DPDP code.
