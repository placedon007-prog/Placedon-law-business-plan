# Placedon — RAG & Backend Integration Architecture

**Audience:** the backend and frontend engineers integrating any client (the web app, the Word add‑in, or
another service) with the Placedon legal engine. **Status:** every endpoint, field, enum, and behaviour below
is verified against the source in `placedon-law-backend`. Where a memory/doc file disagrees with the code, the
**code wins** and it is flagged. This is the contract; build to it, and do not invent surface it does not define.

> **Product identity note.** Some `.claude/memory/` and older `docs/` files still describe an earlier **PoSH /
> HR‑compliance** product (FastAPI `checker/app.py`, `placedon-hr`, `verified_by IS NULL`). The shipped code has
> **pivoted to the Companies Act, 2013** (`corpus/companies_act/`). Trust the code.

---

## 1. The design invariant

> **"LLM explains. Code decides. Lawyer verifies."**

- **Code decides.** `applicability.py`, `jurisdiction.py`, `checker/obligations.py`, `checker/classify.py`,
  `checker/currency.py` decide *what the law requires* — pure, deterministic Python, **no model ever in the
  decision path.**
- **LLM explains (when wired).** A model may only translate a **pre‑verified evidence packet** into English and
  may only say what the served text **entails**. It never selects authority, decides applicability, or supplies a
  date/threshold. Every figure or citation it emits is checked verbatim against the source afterward; a value not
  in the served text discards the whole answer.
- **Lawyer verifies.** `verified_by` / `HUMAN_APPROVED` is the only thing that authorises a legal statement as
  grounded, and drafting approval is blocked while any value is model‑suggested or unfilled.
- **Model choice is a cost lever, not a correctness lever.** The safety properties are enforced by code, so the
  model can be the cheapest one that reads English.

**Implication for the UI:** the trustworthy parts of the product are the deterministic ones; the model is the
least‑trusted component and, today, is **not wired at all**. Do not imply a live model or semantic search.

---

## 2. System architecture — two paths

```
┌──────────────── DETERMINISTIC PATH (no model, no network) ─────────────────┐
 request ─▶ checker/api.handle ─▶ obligations.build / classify / currency
         ─▶ checker/diligence_pack.build_pack ─▶ JSON response
 Serves: POST /v1/compliance-pack · POST /v1/document-check
         GET /v1/company/{cin}/events · GET /v1/instruments/{fragment}/affected
 Every response carries "no_model": true.
└────────────────────────────────────────────────────────────────────────────┘

┌──── GROUNDED‑ANSWER PATH (feature F9 — spine BUILT, endpoint + model NOT wired) ────┐
 question ─▶ retrieve() ─▶ admission gate ─▶ EvidencePack (closed world, MODE_MODEL)
          ─▶ model_adapter.run()  [4 pre‑call refusals, budget‑gated]  ─▶ rigid Claims
          ─▶ claim_verifier.verify_all ─▶ cascade.verdict (E6→E5→E4→E3) ─▶ attribution ladder
          ─▶ serve (only if GROUNDED / HUMAN_APPROVED)  OR  abstain (INSUFFICIENT_EVIDENCE)
 LLM access is isolated to backend/services/llm.py (Anthropic claude-haiku-4-5, budget‑gated pre‑call).
└─────────────────────────────────────────────────────────────────────────────────────┘
```

The deterministic path is the live product today. The grounded‑answer path exists as a **safety spine** — the
guarantees are implemented and tested — but there is no answer endpoint and no model connected. Build the UI so
the spine's design (grounded‑or‑abstain) is the visible feature; do not present a working chatbot.

---

## 3. HTTP API surface

A **zero‑dependency, stdlib** server. The core is a pure function
`handle(method, path, body, *, generated_at) -> (status, dict)` in **`checker/api.py`**, wrapped by
**`scripts/serve_api.py`** (binds `127.0.0.1:8020`, `Cache-Control: no-store`, strict CSP, 256 KB body cap;
**facts go in the POST body, never the URL/query string**).

> There is **no** FastAPI `checker/app.py` (the memory docs are wrong). Use `checker/api.py` + `scripts/serve_api.py`.

**The six routes that exist — build the client against these only:**
```
GET  /v1/health
POST /v1/compliance-pack
POST /v1/document-check
GET  /v1/company/{cin}/events
GET  /v1/company/{cin}/events/{event_id}
GET  /v1/instruments/{fragment}/affected
```
**There is NO `/v1/ask` and NO `/v1/company/{cin}/standing`** (F9's answer endpoint is unbuilt). Do not stub
them into the client as if they exist. Errors: `400 {"error":"bad_request","detail":…}` (the `detail` names the
exact offending field — surface it), `404 {"error":"not_found","detail":…,"routes":[…]}`.

### 3.1 `GET /v1/health`
```json
{ "status":"ok", "no_model":true, "benchmark_version":"…", "corpus_version":"…", "checker_commit":"…" }
```
On provenance failure the three version fields are replaced by `{"provenance_error":"…"}`. This route is the
source of the "state of the record" metrics a client may surface (versions, law currency).

### 3.2 `POST /v1/compliance-pack`
A company's Companies Act position on a date — the pre‑diligence evidence pack. Built by
`checker/diligence_pack.build_pack`, serialised by `checker/api.compliance_pack`. **No model.**

**Request body** (`checker/api._profile` + `_evidence`):
- **Required:** `company_class` ∈ `"private"|"public"|"opc"`, `incorporation_date` (ISO `YYYY-MM-DD`), `as_of` (ISO).
- **Optional profile:** `cin`, `financial_year`, `is_listed`, `is_section_8`, `is_holding_company`,
  `is_subsidiary_company`, `governed_by_special_act` (booleans), `director_count` (int).
- **Money** — integer **whole rupees**, suffix **`_rupees`**, and **require `financial_year`**:
  `paid_up_capital_rupees`, `turnover_rupees`, `net_worth_rupees`, `net_profit_rupees`. (Negative / bool / non‑int → 400.)
- **`evidence`** (object): `agm_dates` (ISO list), `financial_year_end` (ISO), `board_meetings` (ISO list),
  `calendar_year`, `aoc4_filed_on` (ISO), `annual_return_filed_on` (ISO), `resident_director_days`,
  `first_financial_year_end` (ISO).

**Response `200`** (exact keys):
```json
{
  "company_class":"…", "cin":"…", "as_of":"YYYY-MM-DD", "financial_year":"…",
  "generated_at":"…", "provenance": { … },
  "summary": { "not_satisfied":0, "undetermined":0, "cannot_determine":0, "satisfied":0, "not_applicable":0 },
  "rows": [ {
    "obligation_id":"CA13-S96-AGM", "duty":"…", "provision":"…",
    "state":"APPLIES_SATISFIED|APPLIES_NOT_SATISFIED|APPLIES_UNDETERMINED|DOES_NOT_APPLY|CANNOT_DETERMINE",
    "basis":"…", "missing_facts":["…"], "blocked_by":"task-id|null",
    "cited_spans": [ {"path":"…","sha256":"…","resolved":true} ]
  } ],
  "unverified": [ {"obligation_id":"…","to_settle":"…"} ],
  "law_currency_watch": [ {"obligation_id":"…","status":"…","instrument":"…","detail":"…"} ],
  "what_this_is": [ … ], "what_it_is_not": [ … ]
}
```
`provenance = {benchmark_version, corpus_version, checker_commit, working_tree_dirty, law_as_of}` (or an `error`/`note`).
Render `provenance`, `what_this_is`, and `what_it_is_not` as **first‑class content** — they are the product's honesty surface.

### 3.3 `POST /v1/document-check` (feature F1 — the Word add‑in engine)
*A document made on one date is read on another — has the law it rests on moved between them?* Deterministic.

**Request** — only these keys (unknown key → 400): `document_date` (required ISO), `as_of` (ISO, default today),
plus the same profile fields as compliance‑pack (`company_class`, `incorporation_date`, `cin`, `financial_year`,
the boolean flags, `director_count`, the four `*_rupees`). `document_date > as_of` → 400.

**Response `200`:**
```json
{ "document_date":"…", "as_of":"…", "generated_at":"…",
  "summary": {"superseded":0, "cannot_verify":0, "verified":0},
  "superseded":  [ {"obligation_id","duty","provision","was_at_document_date","is_at_read_date",
                    "governed_then","governs_now","instrument","detail","reference"} ],
  "cannot_verify":[ {"obligation_id","duty","provision","detail","already_open_at_document_date","reference"} ],
  "verified":    [ {"obligation_id","duty","provision","state","basis"} ],
  "what_this_is":[…], "what_it_is_not":[…], "no_model":true }
```
"Moved" = a change of governing **instrument** or a status degrade from `CURRENT`. Fails closed → `cannot_verify`.

### 3.4 `GET /v1/company/{cin}/events[/{event_id}]` (features F4 · F5 — the Sentinel stream)
Backed by `checker/event_log`. **v0 serves LAW‑CHANGE events only**; company‑fact events need a licensed
registry feed. The response `scope` says so — *"law_change_only … an absence here is not evidence that nothing
happened to this company."* Surface that caveat; do not hide it.

Query params: `as_of` (ISO, default today), `since` (ISO; `since > as_of` → 400),
`kind` ∈ `"law"|"company"` (`company` returns `[]`), `class` ∈ `"fact"|"consequence"|"signal"`
(→ `VERIFIED_FACT | DETERMINISTIC_CONSEQUENCE | SIGNAL`).

**Response `200`** (list route):
```json
{ "cin":"…", "as_of":"…", "since":null, "generated_at":"…",
  "scope":"law_change_only …", "no_model":true,
  "events": [ {
    "id":"<16-hex content hash>", "at":"YYYY-MM-DD", "known_at":"YYYY-MM-DD",
    "kind":"LAW_CHANGE|COMPANY_FACT", "subtype":"THRESHOLD_MOVED|OBLIGATION_SUPERSEDED|…",
    "title":"…", "output_class":"VERIFIED_FACT|DETERMINISTIC_CONSEQUENCE|SIGNAL",
    "currency_state":"…", "obligation_id":"…", "consequence":"…", "verified_by":null,
    "source": {"instrument":"…","as_at":"YYYY-MM-DD|null","sha256":"…|null","url":"…|null"}
  } ] }
```
Single‑event route wraps one event under `"event"`; missing → `404`.

### 3.5 `GET /v1/instruments/{fragment}/affected` (feature F5 reverse index)
`fragment` is URL‑encoded; empty → 400. Response `200`:
`{ "instrument":"<fragment>", "generated_at":"…", "obligations":[…], "no_model":true }`.

---

## 4. Output taxonomies — three vocabularies, kept distinct

Do not blur these; each belongs to a different layer.

**4.1 Obligation row `state`** (`checker/obligations.ROW_STATES`, the compliance‑pack `state`):

| Literal | Meaning |
|---|---|
| `APPLIES_SATISFIED` | duty attaches and evidence shows it met |
| `APPLIES_NOT_SATISFIED` | duty attaches and evidence shows it unmet |
| `APPLIES_UNDETERMINED` | duty attaches; can't say whether met (names missing facts) |
| `DOES_NOT_APPLY` | duty does not attach |
| `CANNOT_DETERMINE` | can't even say whether the duty attaches |

`NEEDS_ATTENTION = (APPLIES_NOT_SATISFIED, APPLIES_UNDETERMINED, CANNOT_DETERMINE)`. **`DOES_NOT_APPLY` (a real
"no") and `CANNOT_DETERMINE` (an "I don't know") are never collapsed** — they must look different in the UI.

**4.2 Event `output_class`** (`checker/event_log.OUTPUT_CLASSES`):

| Literal | Meaning |
|---|---|
| `VERIFIED_FACT` | instrument/registry‑sourced; **requires a `verified_by`** or construction raises |
| `DETERMINISTIC_CONSEQUENCE` | computed, reproducible ("so the company must…") |
| `SIGNAL` | shown, **never asserted** as fact; `verified_by` is `null`. An unverified event is a SIGNAL, never a hidden fact |

A `SIGNAL` must never wear the visual costume of a `VERIFIED_FACT`.

**4.3 Model‑adapter `DECISIONS`** (`checker/model_adapter.py`, the future F9 answer path): `APPLIES`,
`DOES_NOT_APPLY`, `INSUFFICIENT_FACTS` (law is here; document says too little), **`INSUFFICIENT_EVIDENCE`** (the
**abstention** — the law itself is not here/not admissible). `BUDGET_EXHAUSTED` exists but is **not** a
model‑emittable decision. (`applicability.Result` primitive: `APPLIES`, `DOES_NOT_APPLY`, `INSUFFICIENT_DATA`.)

**When the engine abstains:** no admissible evidence → `INSUFFICIENT_EVIDENCE`, no model call; a relief is
withheld while any exclusion is unknown (asymmetric proof); a non‑servable/defective provision is withheld;
model output that is malformed, cites outside the pack, or has no surviving claim → downgraded to
`INSUFFICIENT_EVIDENCE` (fail‑closed, never an exception to the caller).

---

## 5. The safety spine (feature F9 — built; model not wired)

Flow: **retrieve → admission gate → evidence pack (closed world) → model adapter (4 pre‑call refusals) → rigid
claims → claim_verifier → cascade → attribution ladder → abstain‑or‑serve.**

- **`checker/evidence_pack.py`** — the only thing a model is ever shown. **Closed world**: `prompt_block()` states
  the rule as a prohibition — *"the provisions below are the ONLY law available to you … do not use anything you
  know about Indian law from outside this pack."* Servability is inherited, not asserted (state ∈ `SERVABLE` **and**
  no blocking `Defect` **and** has text). Unusable provisions are **named but withheld** (the model is told the
  provision exists and why it can't be used, not shown the text). **No repair** — defective government text is kept
  verbatim in `raw_text`, with a separate cleaned `reading_text` and every transform logged. `mode`: `MODE_MODEL`
  (reviewer‑admitted material only) vs `MODE_REVIEW`; the pack attests to its own mode.
- **`checker/model_adapter.py`** — the only place an LLM may touch the system. Four refusals **before any model
  call**: (1) a non‑`MODEL` pack is refused; (2) a pack with no admissible evidence → `INSUFFICIENT_EVIDENCE`,
  model never consulted; (3) a real model with no budget → `BUDGET_EXHAUSTED`; (4) output citing an evidence id
  not in the pack → the claim is rejected, not repaired. The model must return strict JSON (`decision` + `claims[]`
  with `claim_id`, `text`, `claim_type`, `evidence_ids[]`, `support`, `confidence` + `missing_facts[]` +
  `warnings[]`); malformed → abstain with a parse‑failure warning; duplicate claim ids → all copies rejected.
  Default model is a deterministic `StubModel`.
- **`checker/claim_verifier.py`** — necessary‑condition citation check (no model). `establishes_support(v)` is True
  **only for `SUPPORTED`**, which is currently unreachable — so today nothing the code produces authorises a legal
  statement on its own. This is the honest state, by design.
- **`checker/cascade.py`** — deterministic entailment cascade, order **E6 → E5 → E4 → E3**. E6 (qualifier gate) may
  **refuse, never accept**. `None` = abstention and is not a soft `False`.
- **`checker/attribution.py`** — ladder `RETRIEVED → ADMITTED → SERVED → CITED → GROUNDED`. **`GROUNDED` cannot pass
  today**; only `verified_by` / `HUMAN_APPROVED` reaches it.

---

## 6. Controlled drafting (feature F10 — built)

`checker/provenance_slots.py` + `checker/drafting.py`. Every value in a draft carries a **typed origin**:

| Slot type | Meaning |
|---|---|
| `SOURCE_QUOTE` | verbatim from an admitted provision — verified (`verify_quote()` fails if the text isn't in the cited provision) |
| `USER_FACT` | supplied by the person |
| `DERIVED_FACT` | computed from user facts + a quoted interval — must carry its `working` or construction raises |
| `TEMPLATE_TEXT` | fixed drafting language approved in advance |
| `MODEL_SUGGESTION` | produced by a model — never legally supported on its own |
| `UNKNOWN` | a slot nobody filled |

**`BLOCKING_TYPES = (MODEL_SUGGESTION, UNKNOWN)`** → `Draft.approve()` **raises** while either is present. One
template exists (`draft_agm_notice`, s.96). No model wired; `MODEL_SUGGESTION` is in the vocabulary so future model
output arrives pre‑labelled as unsupported. **UI:** a provenance panel that colour/label‑codes each value by origin
and blocks "approve" until nothing is `MODEL_SUGGESTION`/`UNKNOWN`.

---

## 7. Corpus, retrieval, provenance, bitemporal

- **Corpus:** `corpus/companies_act/<section_id>.json`, ~530 files, one per section: `section_id`, `act_id`,
  `content` (raw India Code HTML), `footnote`, **`sha256`**, `source_url`, `fetched_at`. Admission store in
  `corpus/admission/`; hashed source artifacts (the Act, G.S.R. 700(E)/880(E), rules) in `corpus/sources/` with
  `SHA256SUMS`.
- **Retrieval:** **lexical/BM25 by citation, not vector.** `checker/corpus_retrieval.py` (BM25, pure arithmetic,
  zero deps; heading boosted ×5; measured precision@1 ≥ 0.5). An exact citation resolves directly. **Vector/dense
  (InLegalBERT) is a planned V1.5, not wired.** The repo has zero third‑party runtime dependencies.
- **Evidence states** (`checker/provenance.STATES`, weakest→strongest): `UNRESOLVED`, `INFERRED`,
  `UNFETCHED_CORROBORATION`, `CORROBORATED`, `VERIFIED`, `RETRACTED`. **`SERVABLE = (CORROBORATED, VERIFIED)`** —
  only these reach a user. Nothing reaches `VERIFIED` without a hashed local artifact **and** human review.
- **Bitemporal:** events carry `at` (valid time — when the change took effect) and `known_at` (transaction time —
  when we learned it); the content‑addressed `id` excludes `known_at`. `checker/as_of.py` can reconstruct a past
  version but is UNVERIFIED, so nothing is presented as point‑in‑time yet; `document-check` compares two `as_of`
  evaluations to detect movement.

---

## 8. Client integration

**Typed provider — one interface, two implementations, so mock and server are interchangeable:**
```ts
interface EngineProvider {
  health(): Promise<Health>;
  compliancePack(req: CompliancePackRequest): Promise<CompliancePack>;
  documentCheck(req: DocumentCheckRequest): Promise<DocumentCheckResult>;
  events(cin: string, q?: { as_of?: string; since?: string; kind?: "law"|"company";
                            class?: "fact"|"consequence"|"signal" }): Promise<EventsResponse>;
  event(cin: string, eventId: string): Promise<EventResponse>;   // 404 → not-found state
  instrumentAffected(fragment: string): Promise<AffectedResponse>;
}
type RowState    = "APPLIES_SATISFIED"|"APPLIES_NOT_SATISFIED"|"APPLIES_UNDETERMINED"|"DOES_NOT_APPLY"|"CANNOT_DETERMINE";
type OutputClass = "VERIFIED_FACT"|"DETERMINISTIC_CONSEQUENCE"|"SIGNAL";
```
- **`MockProvider`** returns fixtures shaped exactly per §3 — borrow real examples from `checker/api._test()` and
  the serialisers `_row_json` / `_event_json`. Keep enum strings identical to the backend.
- **`HttpProvider`** targets `scripts/serve_api.py` (`127.0.0.1:8020`), POSTs facts in the body (never the query
  string), and treats `{"error":…}` bodies as typed failures. Swapping providers must be a one‑line change. Do
  **not** add `/v1/ask` or `/v1/company/{cin}/standing` — they don't exist.

**Four required client states for every data view:**
1. **Loading / skeleton** — deterministic packs are fast (~0.6 s) but treat as async; skeletons shaped like the
   real content, never a full‑page spinner.
2. **Verified answer** — render `rows` grouped by `summary`; show `provision`, `basis`, and `cited_spans`
   (`path` + `sha256`) as visible proof; badge each row by `state`; always render `provenance`, `what_this_is`,
   `what_it_is_not`.
3. **Abstained** — first‑class, not an error. `APPLIES_UNDETERMINED` / `CANNOT_DETERMINE` render `missing_facts`
   / `blocked_by` ("what would settle this"); `unverified[]` is the map of gaps. The future F9 path renders
   `INSUFFICIENT_EVIDENCE` as *"the law is not here / what is missing"* — visibly different from an error and from
   `DOES_NOT_APPLY`.
4. **Error** — surface `detail` (the exact bad field) on 400; render `routes[]` on 404. A degraded/network state
   must look different from an abstention: an abstention is a correct answer; an error is not.

**Copy discipline:** never render a citation, figure, or date the backend did not supply. The honest "we hold
statute only / no judgments" and the abstention **are** the differentiator, not a limitation to hide.

---

## 9. Contract stability & what is not built

- **Stable and live today:** the deterministic path — `/v1/compliance-pack`, `/v1/document-check`,
  `/v1/company/{cin}/events`, `/v1/instruments/{fragment}/affected`, `/v1/health`. Build against these now.
- **Designed, engine present, surface pending:** the grounded‑answer path (F9) — spine built, **no `/v1/ask`, no
  model.** Do not build a client method for it yet; when it lands it will follow the model‑adapter claim schema in §5.
- **v0 limitations to surface honestly:** the event stream is **law‑change only** (company‑fact events need a
  licensed registry feed); point‑in‑time reconstruction is present but **UNVERIFIED**, so nothing is served as
  point‑in‑time; four compliance‑matrix rows (s.2(85), s.177, s.188, s.203) refuse until their delegated rules are
  held/reviewed.

---

## Appendix — key file map
- **API:** `checker/api.py`, `scripts/serve_api.py`
- **Deterministic decision:** `applicability.py`, `jurisdiction.py`, `checker/obligations.py`, `checker/classify.py`,
  `checker/currency.py`, `checker/diligence_pack.py`, `checker/event_log.py`
- **Safety spine (F9):** `checker/evidence_pack.py`, `checker/model_adapter.py`, `checker/claim_verifier.py`,
  `checker/cascade.py`, `checker/attribution.py`, `checker/grounding_policy.py`, `checker/retrieve.py`,
  `checker/corpus_retrieval.py`
- **Drafting (F10):** `checker/provenance_slots.py`, `checker/drafting.py`
- **Provenance / versioning:** `checker/provenance.py`, `checker/release_record.py`
- **LLM + budget:** `backend/services/llm.py`, `backend/budget.py`
- **Docs:** `docs/FEATURES.md`, `docs/MODEL_PLAN.md`, `.claude/memory/PRODUCT.md` (the golden rule)
