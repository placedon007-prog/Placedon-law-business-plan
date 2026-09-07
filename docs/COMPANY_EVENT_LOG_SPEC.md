# Company Event Log — Engineering Specification

**Written:** September 2026 · **Companion to:** [`FEATURE_TECHNICAL_PLAN.md`](FEATURE_TECHNICAL_PLAN.md)
**Grounded in:** `placedon-law-backend` @ `8df7919` — specifically `checker/currency.py`,
`checker/entity_graph.py`, `checker/as_of.py`, `checker/obligations.py`, `checker/corporate_data.py`.

> **What this feature is, in one line.** For any Indian company, a single **dated, sourced stream of
> everything that changed** — the company's own events (directors, charges, filings, status) *and* the
> law changes that move its obligations — each entry marked verified fact / deterministic consequence /
> signal, and carrying whether its legal basis is **current, superseded, or unacquired.**
>
> It is simultaneously our answer to Harvey's "integrated workspace," the concentration point of our
> currency moat, and — per `checker/currency.py`'s own docstring — our version of *"Legora's Monitors /
> Harvey's Horizon Scanning."* No competitor markets point-in-time statutory currency as a feature.

---

## 1. Why this feature, and who uses it

The two users are deliberately different, and the design must serve both:

| User | Who | What they need | Design consequence |
|---|---|---|---|
| **The buyer** | Corporate legal / GC / Company Secretary — personally liable, signs off | *Verifiable, auditable, defensible.* An exportable record a partner or court accepts. | Every event hash-stamped, dated, source-traced; bitemporal; abstention visible |
| **The daily user** | Third-year law intern / junior associate — runs the first-pass work | *Simple, fast, "what changed and what do I do."* Used every day, zero training. | One scrollable timeline; plain-language one-liner per row; a "so what" line; type-a-CIN, no upload |

**The daily test:** an intern opens it each morning, types a client's CIN, and sees *"3 new things since
yesterday — one needs action."* The buyer opens the same log at review time and exports it as proof.

---

## 2. Data model

### 2.1 Reused, already built (`checker/entity_graph.py`)
```python
Kind        = COMPANY | INDIVIDUAL
Rel         = DIRECTOR_OF | RELATIVE_OF | CONTROLS | HOLDS_SHARES_IN | PARTNER_IN | MEMBER_OF
Entity(id, kind)
Relationship(src, rel, dst, as_of: date, percent, basis)   # DATED edges, carry provenance
Complete(entity, rel, direction)                           # lets a query answer NO instead of UNKNOWN
EntityGraph(entities, relationships, completeness)         # immutable
```

### 2.2 Reused, already built (`checker/currency.py`)
```python
Dependency                       # an obligation -> the dated instrument its answer depends on
Finding(state, instrument, ...)  # state ∈ CURRENT | NOT_YET_IN_FORCE | SUPERSEDED | UNACQUIRED
currency_of(dep, as_of) -> Finding
report(as_of)  -> list[Finding]  # every obligation's currency at a date
stale(as_of)   -> list[Finding]  # obligations resting on superseded/unacquired law
affected_by(instrument_fragment) -> list[str]   # REVERSE map: which obligations a new instrument moves
```
`affected_by()` is the engine of the law-change feed: a new Gazette instrument → the obligations (and
therefore the companies) it changes.

### 2.3 New — the unifying `Event` type (to build)
```python
class EventKind(Enum):   COMPANY_FACT | LAW_CHANGE
class OutputClass(Enum): VERIFIED_FACT | DETERMINISTIC_CONSEQUENCE | SIGNAL   # never blurred
class CurrencyState(Enum): CURRENT | NOT_YET_IN_FORCE | SUPERSEDED | UNACQUIRED

@dataclass(frozen=True)
class Event:
    id: str
    company: str                 # CIN
    at: date                     # when the event took effect  (valid time)
    known_at: date               # when WE learned it          (transaction time)  ← bitemporal
    kind: EventKind
    subtype: str                 # DIRECTOR_APPOINTED | CHARGE_CREATED | SHAREHOLDING_CHANGED |
                                 # STATUS_CHANGED | FILING_MADE | THRESHOLD_MOVED |
                                 # OBLIGATION_SUPERSEDED | OBLIGATION_NOW_IN_FORCE | BASIS_UNACQUIRED
    title: str                   # the intern's one-liner, plain language
    output_class: OutputClass
    currency: CurrencyState | None       # set for LAW_CHANGE events
    source: Source                       # instrument/registry ref + sha256 + fetch_time + as_at date
    consequence: str | None              # the deterministic "so the company must…", dated
    verified_by: str | None              # None ⇒ abstain / SIGNAL, never a hidden fact
```
**Bitemporality is load-bearing.** `at` vs `known_at` answers two different questions a lawyer asks —
*"what do we now know about the company as of 31 March"* and *"what was knowable to us on 31 March"* —
which is exactly the point-in-time correctness the whole product is built on.

---

## 3. How it is built — the pipeline

```
CIN
 │
 ├─ COMPANY-FACT events
 │    corporate_data.py / mca_aggregator.py (licensed)  OR  OGD CIN-master bulk (free, Phase 1)
 │      → entity_graph.py (dated Relationship edges, basis = source)
 │      → derive Events: DIRECTOR_APPOINTED/RESIGNED, CHARGE_CREATED/SATISFIED,
 │        SHAREHOLDING_CHANGED, STATUS_CHANGED (active→strike-off), FILING_MADE
 │
 ├─ LAW-CHANGE events
 │    obligations.py → which obligations apply to THIS company's facts
 │      → for each: currency.currency_of(dep, as_of) → Finding
 │      → currency.affected_by(new_instrument) → obligations (and companies) a new instrument moves
 │      → derive Events: THRESHOLD_MOVED, OBLIGATION_SUPERSEDED, OBLIGATION_NOW_IN_FORCE, BASIS_UNACQUIRED
 │
 ├─ each Event dated via as_of.py; `consequence` computed deterministically (derived_date, obligations)
 │    verified_by == None  ⇒  OutputClass.SIGNAL (shown, never asserted as fact)
 │
 └─ merge into ONE time-ordered, bitemporal stream; tag OutputClass; hash-stamp each Event
        → API  +  timeline UI  +  subscription/monitor
```

**The model is not in this pipeline.** Every step is deterministic or registry-sourced. The LLM (if used
at all) only *phrases* an event title in plain language, from the verified fields — it never creates an
event, a date, or a consequence.

---

## 4. API contract

```
GET  /v1/company/{cin}/events
        ?as_of=YYYY-MM-DD        point-in-time view (default: today)
        &since=YYYY-MM-DD        only events known after this (the "what's new" feed)
        &kind=law|company        filter
        &class=fact|consequence|signal
     → { as_of, generated_at, events: [Event…], abstentions: [...] }

GET  /v1/company/{cin}/events/{event_id}
     → one Event + full evidence panel (source, instrument, as-at, sha256, deterministic working)

GET  /v1/instruments/{gsr}/affected
     → reverse index: companies + obligations a new instrument moves (powers the monitor)

POST /v1/subscriptions   { cin, channels }
     → watch a company; new law-change / company events push a dated, sourced alert
```
`GET /v1/company/{cin}/events` extends the pure-function `handle()` pattern in `checker/api.py` (today
only `POST /v1/compliance-pack` exists), so it is testable without a server and fails closed.

---

## 5. The experience

### 5.1 For the intern (daily driver)
- **One input:** type a CIN. No upload, no account, no legal question.
- **One timeline, newest first.** Each row:
  `01-Dec-2025 · "Small-company limit rose to ₹10 cr" · [law change] · ⚠ was on a superseded figure`
- **A colored chip** for the output class (verified fact / consequence / signal) and a **currency badge**
  (● CURRENT / ⚠ SUPERSEDED / ○ UNACQUIRED).
- **A "so what" line** on consequence events: *"AOC-4 now due 30 days after AGM → 12 days left."*
- **Filters:** *law changes only · action needed · since my last visit.*
- Click any row → the **evidence panel** (source, instrument, as-at date, the working).

### 5.2 For the buyer (verification & audit)
- Every event is **hash-stamped and dated** → the log exports as a reproducible audit record.
- **Bitemporal toggle:** "what was knowable on the transaction date."
- **Abstention is visible:** `UNACQUIRED` / `UNKNOWN` shown as first-class rows, never hidden — the
  feature states what it cannot yet verify.

---

## 6. Reuse vs. build

| Component | Status |
|---|---|
| `entity_graph.py`, `currency.py` (report/stale/affected_by), `as_of.py`, `obligations.py`, `prescribed_thresholds.py`, `cascade` abstention | **BUILT** |
| `corporate_data.py` / `mca_aggregator.py` seam | **WIRE DATA** (free OGD Phase 1; licensed Phase 2) |
| `Event` model + event-derivation module (graph + currency → Events) | **BUILD** |
| `GET /v1/company/{cin}/events`, `/events/{id}`, `/instruments/{gsr}/affected`, subscriptions | **BUILD** |
| Timeline UI + evidence panel | **BUILD** (in the existing landing-page repo first) |
| Bitemporal store (Postgres) | **BUILD** (Phase 3; in-memory for v0) |

---

## 7. Phasing

- **v0 (Phase 1) — law-change log, buildable now.** Company facts entered by the user or from OGD bulk;
  law-change events from `currency.report/stale/affected_by`. Mostly composition of built parts. Unblock
  the s.2(85) case with task **S-002** (download G.S.R. 700(E)). Ships fast, demoable.
- **v1 (Phase 2) — company-fact events + monitor.** Wire the licensed MCA aggregator for live
  directors/charges/status; add subscriptions and the "what's new since" feed.
- **v2 (Phase 3) — persistent bitemporal store + dossier.** Full history, tenant isolation, audit log.

---

## 8. Correctness, metrics, testing

- **The one correctness metric that matters:** *never render `CURRENT` on a superseded instrument.* A
  false `CURRENT` is the exact failure the product exists to prevent.
- **Every event traces to a source + a date;** no event without provenance.
- **Abstention rate is visible;** coverage grows only as sources are acquired, never by loosening the gate.
- **Testing (repo convention):** a self-testing module printing `[PASS]/[FAIL]`, a golden company with
  known events, and the **s.2(85) superseded case as a fixture** (₹50L→₹2cr→₹4cr→₹10cr across G.S.R.
  92(E)/700(E)/880(E)).

---

## 9. Risks
- **Company-fact events need licensed data** — v0 dodges this by shipping the *law-change* log first on
  data we hold; company facts arrive in v1.
- **`affected_by()` completeness** — if the instrument→obligation map misses an edge, a change is missed.
  The `Complete` assertions in `entity_graph` and the currency dependency map must be maintained.
- **No OCR needed** — this feature runs on registry + statute data, not uploaded documents, so it sidesteps
  the physical-document/OCR problem that gates Document Review.
- **Scope discipline** — the log shows *verified* change and *honest* gaps; it must never fabricate an
  event to look complete.

---

> **The rule, applied here:** the system may surface a change and its consequence; it must date and source
> both, and it must show what it cannot verify. The model may phrase; it never creates an event.
