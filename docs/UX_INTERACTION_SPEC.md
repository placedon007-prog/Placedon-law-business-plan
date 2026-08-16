# Placedon — UX Interaction Specification

**Companion to [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). That file decides how things look; this one
decides how they behave.** Where they disagree, DESIGN_SYSTEM.md wins on visual tokens and this file
wins on states and flows.

Written 2026-08-16, from Gazette-verified research and peer-reviewed HCI work. Every external claim
carries its source.

---

## 1. The thesis, in one sentence

> **This product's job is not to answer legal questions. It is to tell you whether the answer it has
> is still current — and to refuse when it cannot.**

Everything below follows from that, and it is a *narrower* claim than "AI for compliance." It is
narrow on purpose.

### Why: the failure that defines the product

`s.2(85)` of the Companies Act reads **"fifty lakh rupees."** It has read that since 2013 and reads
that today. The operative figure is **₹10 crore**, prescribed by **G.S.R. 880(E) dated 1 December
2025** — subordinate legislation that has moved **three times**:

| Instrument | Paid-up | Turnover | In force |
|---|---|---|---|
| Act as enacted, 2013 | ₹50 lakh | ₹2 crore | 1 Apr 2014 |
| G.S.R. 92(E) | ₹2 crore | ₹20 crore | **1 Apr 2021** *(inserted cl.(t); deferred commencement)* |
| G.S.R. 700(E) | ₹4 crore | ₹40 crore | 15 Sep 2022 *(on publication)* |
| **G.S.R. 880(E)** | **₹10 crore** | **₹100 crore** | **1 Dec 2025** *(on publication)* |

A tool could cite s.2(85), link a genuine India Code page, quote it **verbatim**, and still be wrong
by three amendments.

[Magesh et al., *JELS* 2025](https://arxiv.org/abs/2405.20362) name this **misgrounding** — an answer
is hallucinated if it *"falsely asserts that a source supports a statement."* **A citation that
resolves is not evidence of correctness.** They measured Lexis+ AI, Westlaw AI-AR and Ask Practical
Law AI at **17–33% hallucination**, against LexisNexis's own marketing claim of *"hallucination-free
linked legal citations."*

**Design consequence, and it is the whole spec:** every figure on screen carries the date it became
operative, and the instrument that made it so. Not in a tooltip. Not behind a link. **Next to the
number.**

---

## 2. The rule that governs every state

> ### Refuse when a provision cannot be **dated** — not merely when it cannot be **found**.

This replaces the earlier rule ("refuse when unverified") and is better on three counts:

- **Narrower.** Ask Practical Law AI returns incomplete answers **62%** of the time and is the
  *worst* performer in the Stanford study. **Refusal is not self-justifying.** A product whose
  distinguishing behaviour is refusal is one design mistake from being that tool.
- **More defensible.** *"I will not state a threshold I cannot date"* is a judgment a practising
  Company Secretary recognises as their own.
- **It explains the whole blocklist in one line.** `ca2013.com`, `taxguru.in` and `indiankanoon.org`
  each serve real statutory text **with no as-at date**.

---

## 3. The three answer states

Screen 1 has exactly three outcomes. **There is no fourth, and no loading skeleton.**

### 3.1 ANSWERED — the figure is dated

```
┌──────────────────────────────────────────────────────────────┐
│  Not a small company.                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Paid-up capital   ₹12,00,00,000                        │  │
│  │ Limit             ₹10,00,00,000   ✗ exceeds            │  │
│  │                   ├ s.2(85)(i) + rule 2(1)(t)          │  │
│  │                   ├ G.S.R. 880(E)                      │  │
│  │                   └ as at 01-Dec-2025                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Both limbs must be satisfied — the test is conjunctive      │
│  ("or" → "and", S.O. 504(E), 13-Feb-2015). One limb fails,   │
│  so turnover was not evaluated.                              │
│                                                              │
│  [ See the source ]                                          │
└──────────────────────────────────────────────────────────────┘
```

**Decisions taken here:**

- **The as-at date is part of the figure, not metadata.** It sits in the same bordered block, in
  mono, directly under the number.
- **The instrument is named** — `G.S.R. 880(E)`, not "as amended."
- **Short-circuit is stated.** When one conjunctive limb fails, say the other was not evaluated.
  Silence would imply it passed.
- **No confidence percentage.** Refused now for the ninth time, and with independent support:
  [Zhang, Liao & Bellamy, FAT\* 2020](https://arxiv.org/abs/2001.02114) found confidence scores
  *calibrate trust but do not improve decisions*, and
  [Google PAIR](https://pair.withgoogle.com/chapter/explainability-trust/) says **don't show
  confidence if it doesn't change the decision.** To a CS, "87% confident" changes nothing; the
  verbatim provision changes everything.

### 3.2 PARTIAL — we hold the provision but cannot date it

**This is the state that decides whether the product is trusted or discarded, and it gets the most
design effort.**

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠  Answered in part.                                        │
│                                                              │
│  CONFIRMED                                                   │
│    Not a public company.        s.2(85), opening words       │
│                                 as at 01-Apr-2014            │
│                                                              │
│  NOT CONFIRMED                                               │
│    The paid-up capital limit.                                │
│    s.2(85)(i) says "fifty lakh rupees or such higher         │
│    amount as may be prescribed."                             │
│    The prescribed amount is in subordinate legislation       │
│    we have not dated. We will not state a figure.            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ s.2(85)  "small company" means a company, other than   │  │
│  │ a public company,— (i) paid-up share capital of which  │  │
│  │ does not exceed fifty lakh rupees or such higher       │  │
│  │ amount as may be prescribed…                           │  │
│  │                                                        │  │
│  │ India Code · ingested 16-Aug-2026 · text unchanged     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [ See the source ]    [ Tell us this is blocking you ]      │
└──────────────────────────────────────────────────────────────┘
```

**Decisions taken here:**

- **Degrade, never stop.** [Amershi et al., CHI 2019](http://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf)
  **G10: *"gracefully degrade the AI system's services when uncertain."*** PAIR: *"explain why a
  certain result couldn't be given and provide alternative paths forward."* A blank *"I cannot
  answer"* is a broken product; handing back what we hold is a degraded one. **To a CS those are not
  the same thing.**
- **Split CONFIRMED from NOT CONFIRMED explicitly.** Partial credit is the honest output.
- **Show the verbatim text in the partial state, always.** This is where it matters most — the words
  *"or such higher amount as may be prescribed"* are visible, so the user can see exactly why we
  stopped.
- **"Text unchanged" is a distinct claim from "figure current."** The transcription is byte-verified;
  the prescribed amount is not dated. Say both.
- **Second button is a demand signal, not a support ticket.** Which provisions block real users is
  the input to what gets verified next. Cheap to build, and it is the only usage telemetry worth
  having pre-revenue.

### 3.3 OUT OF SCOPE — we do not hold this Act

```
┌──────────────────────────────────────────────────────────────┐
│  Outside what Placedon covers.                               │
│                                                              │
│  Placedon holds the Companies Act, 2013 and the DPDP Act,    │
│  2023. This question is about the Income-tax Act, which we   │
│  do not hold.                                                │
│                                                              │
│  We would rather say this than guess.                        │
└──────────────────────────────────────────────────────────────┘
```

Per Amershi **G1** (*make clear what the system can do*) and **G2** (*make clear how well*). Naming
the covered Acts explicitly is the cheapest trust signal available and costs one sentence.

---

## 4. The distinctive component: the currency strip

Nothing else in this market has this. It is the product made visible.

```
  s.2(85)(i) — prescribed paid-up capital limit

  ₹50L ────── ₹2cr ────── ₹4cr ────── ₹10cr ●
  2014        2021        2022        2025    now
              G.S.R.      G.S.R.      G.S.R.
              92(E)       700(E)      880(E)
```

**Specification**

| Property | Decision |
|---|---|
| Placement | Screen 2 (The Source), full width; collapsed to the current node on Screen 1 |
| Current node | Filled circle, Slate `#475569`. Superseded nodes: hollow, Ink-40 |
| Figures | Mono, per DESIGN_SYSTEM.md §3 |
| Instrument labels | Caption, Ink-80. **Always the G.S.R./S.O. number, never "as amended"** |
| Undated segment | Rendered as a **dashed** rule with `?` — never omitted, never guessed |
| Interaction | Hover/tap a node → the operative words at that date. No modal; inline expansion |
| Motion | None. Per DESIGN_SYSTEM.md, and because a timeline that animates reads as decorative |

**Why it earns its place:** the only Indian statutory question that reliably burns a practitioner is
*"which figure is current?"* — and every free ROC calendar (TaxGuru, ClearTax) omits the section
column entirely. This is the one screen element a competitor cannot copy without doing the Gazette
work.

---

## 5. Screen inventory — two, and the reasons for each cut

| Screen | Status | Reason |
|---|---|---|
| **1 — Ask & Answer** | **Build** | The product. Three states from §3. |
| **2 — The Source** | **Build** | Where dating lives. Verbatim text, instrument, as-at date, currency strip. |
| Dashboard | **Cut** | Zero clients, zero queries. Nothing to count. |
| Corpus manager | **Cut** | One person and a JSON file. A CLI does this. |
| Client manager / document upload | **Cut** | Document parsing was rejected on measured evidence — MCA charges ₹100/company, and the closest benchmark caps at 89.97% F1 on *born-digital* filings. |
| Deadlines calendar | **Cut for now** | `deadlines.py` unwritten, and applicability outranks it: ROC adjudication data shows s.12, s.90 and s.203 — **applicability questions** — dominate enforcement, not missed arithmetic. |
| District officer lookup | **Cut** | We hold **PoSH District Officers**, not Registrars of Companies. Different office, different Act. Shipping it would print the wrong official's email. |
| Settings / billing | **Cut** | No paying users; pricing unresolved. |
| `/loop` console | **Deferred** | Already deferred in DESIGN_SYSTEM.md §8. Zero users, ₹0.00 spend. |

**Rule: a third screen ships only when a named user asks for it by name.**

---

## 6. Decisions taken

Stated plainly, because the brief was to decide rather than present options.

**6.1 Mobile-first, desktop-capable — in that order.** Not because CS work is mobile (it is not; it
is desktop filing work), but because **the first ten uses of this product will be shown on a phone
to a practitioner during a fifteen-minute conversation.** The demo constraint outranks the usage
constraint until there are users.

**6.2 No loading skeletons.** Deterministic paths return in milliseconds. The model path shows a
single inline caption — *"checking the source…"*. Skeletons imply content is coming; abstention means
it may not be.

**6.3 Answer states are server-decided, never client-inferred.** The API returns
`state: answered | partial | out_of_scope`. The UI renders; it never decides. A client that could
infer "answered" from a non-empty string is a client that can misground.

**6.4 The seven undeclared colours get resolved, not tolerated.** `#FFFFFF` and `#F5E6D8`
(Caution-20) are legitimate and should be **added** to DESIGN_SYSTEM.md §2. The five greys in
`index.html` — `#141414 #262626 #6B6B66 #8A8A8A #C9C9C4` — are a parallel scale on the landing page
and should be **replaced** with Ink / Ink-80 / Ink-40 / Ink-10. A design system with 7 undeclared
values is a suggestion, not a system.

**6.5 DPDP Act 2023 gets the same currency treatment, and needs it more.** The Act received assent
in August 2023; its Rules followed separately. **A DPDP obligation is exactly the kind that is
frequently quoted as in force when its commencement is not established.** Screen 2 must show the
same instrument-and-date trail for DPDP as for the Companies Act — and where commencement is
unestablished, that is a **PARTIAL**, not an answer.

**6.6 The distress route stays removed.** DESIGN_SYSTEM.md §7 removed it, and with PoSH out of scope
that is right. **But the code stays in the backend**: it costs ₹0, calls no model, and deleting
working safety code to tidy a repo is how it fails to exist when scope changes back.

---

## 7. Accessibility — the two that are load-bearing

DESIGN_SYSTEM.md §9 covers the general case. Two specifics this spec adds:

- **Never encode state in colour alone.** The three answer states must be distinguishable with all
  colour removed — via the heading word (*"Answered" / "Answered in part" / "Outside…"*) and the
  CONFIRMED / NOT CONFIRMED labels. Caution `#8B4513` on Parchment is ~5.8:1, which passes AA, but a
  compliance answer must not depend on a reader distinguishing brown from black.
- **The currency strip needs a table fallback.** A timeline is a picture of a data structure. Ship
  `<table>` semantics underneath it so a screen reader reads *instrument, figure, in-force date* as
  rows.

---

## 8. Build order

| | Work | Depends on |
|---|---|---|
| 1 | `GET /api/company/{cin}` — OGD fetch, CIN regex validation, blank → `UNCHECKED` | nothing |
| 2 | Answer-state contract: API returns `answered \| partial \| out_of_scope` | nothing |
| 3 | Screen 1, three states, **PARTIAL built first** | 1, 2 |
| 4 | Screen 2 + currency strip | corpus with `Amendment` lineage |
| 5 | Resolve the seven undeclared colours (§6.4) | nothing |

**PARTIAL is built first, deliberately.** It is the state the product will spend most of its early
life in, it is the one that decides trust, and building the happy path first is how the degraded path
ends up as an afterthought — which is exactly how a product becomes Ask Practical Law AI.

---

## 9. What would falsify this spec

Honest failure conditions, so this is testable rather than merely asserted:

- **A practising CS shown the PARTIAL state says "this is useless, just give me an answer."** Then
  the dating thesis is wrong and the whole spec is wrong with it.
- **Nobody has ever been caught by a superseded prescribed figure.** Then the currency strip is
  solving a problem that does not bite.
- **The as-at date reads as hedging rather than rigour.** Then it moves from the figure block to
  Screen 2 and Screen 1 gets simpler.

**All three are answerable in the ten conversations, and none is answerable by building more.**
