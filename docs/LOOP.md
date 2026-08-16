# Loop runbook — Placedon-law-business-plan

Pattern **`sequential`**, mode **`safe`**. Created 2026-08-16.

> **This runbook lives in `docs/`, not `.claude/plans/`, because `.claude/` is gitignored in this
> repo. A runbook nobody can read is not a runbook.**

## Pre-flight

| Check | Result |
|---|---|
| Branch / state | `main`, clean, synced |
| `ECC_HOOK_PROFILE` not disabled | unset |
| Explicit stop condition | §4 |
| Secret scan | clean — no key-shaped strings committed |
| **Visibility** | **PUBLIC** — see §0 |

## 0. This repo is public. The other three are private.

`bubblebee1408/placedon-law-backend`, `-frontend` and `-research` are **private**. This one is
**PUBLIC**, and it is now the home for everything.

**That is a real change and it has consequences:**

- Every file pushed here is **world-readable and indexable**, immediately and permanently. Deleting a
  file later does not remove it from history.
- Earlier in this project a **live Google OAuth client secret** was pasted into a chat and had to be
  revoked. In a private repo that is a scare. **Here it would be a disclosure.**
- **Never commit:** API keys (`data.gov.in`, Anthropic), the Gmail OAuth JSON, customer names or
  contact details from the ten calls, or a lawyer's personal details before they agree to be named.
- **Safe to commit, and good to:** plans, research, statutory analysis with sources, the design
  system, benchmark numbers, and the honest list of what is unproven.

**Decision: keep it public.** The argument for it is the same one the product makes — the work is
checkable, and a student publishing Gazette-verified statutory analysis with its sources is more
credible than one who does not. **But the discipline has to match**, and §5 encodes it.

## 1. What this repo is, and is not

**Is:** the plan of record. Business plan, technical plan, design system, UX interaction spec,
research findings, and the landing pages.

**Is not:** the engine. `checker/`, `verifier.py`, the corpus and the 50-check ratchet stay in
`placedon-law-backend`, which is private and where `scripts/verify.py` gates every commit.

**Rule: no statutory corpus JSON in this repo.** Verified provisions live behind the ratchet that
byte-checks them, not in a docs repo where nothing would catch a drifted character.

## 2. Queue

### 1 — Resolve the seven undeclared colours · `UX_INTERACTION_SPEC.md` §6.4

`#FFFFFF` and `#F5E6D8` (Caution-20) are legitimate → **add to `DESIGN_SYSTEM.md` §2**.
`#141414 #262626 #6B6B66 #8A8A8A #C9C9C4` in `landing-page/index.html` are a parallel grey scale →
**replace with Ink / Ink-80 / Ink-40 / Ink-10**.

*Check: a script that greps every hex in `landing-page/` and fails on any not declared in
`DESIGN_SYSTEM.md`. A design system with undeclared values is a suggestion.*

### 2 — Build the PARTIAL state into `landing-page/ask.html`

Per `UX_INTERACTION_SPEC.md` §3.2. **Before the answered state, deliberately** — it is the state the
product spends its early life in, and building the happy path first is how the degraded path becomes
an afterthought.

*Check: with all colour removed, the three states are still distinguishable by their heading word.*

### 3 — The currency strip, static first

Hard-code the s.2(85) chain — ₹50L 2014 → ₹2cr 2021 → ₹4cr 2022 → **₹10cr 2025** — with instrument
numbers. Static HTML, no data layer.

*Check: `<table>` semantics underneath so a screen reader reads instrument, figure, in-force date as
rows. And an undated segment renders **dashed**, never omitted.*

### 4 — README states the scope boundary

The README says Companies Act + DPDP, PoSH out of scope. It should also say **what this repo does not
contain** (the engine, the corpus) and where that lives — otherwise a reader assumes the plans are
the product.

### 5 — DPDP commencement audit

`UX_INTERACTION_SPEC.md` §6.5 asserts DPDP needs currency treatment *more*, because its Rules
followed the Act separately. **That assertion is currently unverified.** Establish, from the Gazette:
which DPDP provisions are actually in force, and from when.

*Bar: Gazette or India Code only. `ca2013.com`, `taxguru.in`, `indiankanoon.org` are blocklisted —
all three were caught serving superseded statutory text as current.*

### Not in this loop

Anything requiring the ten CS conversations. `docs/FIELDWORK.md` and `docs/OUTREACH.md` in the
research repo are the instruments; the loop cannot make a phone call.

## 3. Per-iteration cycle

```
1. take the top open item
2. make the change
3. run the item's own check — it must FAIL before the change and PASS after
4. commit; the message says what changed and why
5. git push
```

## 4. Stop condition

Stop and report when **any** is true:

1. Items 1–5 done, committed, pushed.
2. Item 5 finds DPDP commencement is **not** establishable from primary sources — that changes
   `UX_INTERACTION_SPEC.md` §6.5 and is a decision for a person.
3. Three consecutive iterations find nothing actionable.
4. The ten conversations return — at which point the whole queue is re-ordered around what a real CS
   said.

## 5. Hard limits

| Never | Why |
|---|---|
| **Commit a key, token, or OAuth JSON** | **Public repo.** History is permanent. |
| **Commit names or contacts from the ten calls** | They spoke to a student, not to the internet. |
| Commit statutory corpus JSON | It belongs behind the byte-verification ratchet in the backend repo |
| Cite `ca2013.com`, `taxguru.in`, `indiankanoon.org` for statutory text | All three caught serving superseded text as current |
| State a figure without its instrument and in-force date | It is the one rule this entire product exists to enforce |
| Add a third screen | Only when a named user asks for it by name |
| Add a confidence score | Refused nine times, latterly with peer-reviewed support |

## 6. Start and monitor

```bash
cd /Users/nishantsingh/PlacedOn/Placedon-law-business-plan

/loop                                    # start, dynamic pacing

git log --oneline -8                     # what the loop has done
cat docs/LOOP.md                         # this file
cat docs/UX_INTERACTION_SPEC.md          # what it is building toward

/loop stop
```

## 7. The one line

> This repo holds the plan. The engine is private, the corpus is private, and the only thing that
> changes any number in here is a practising Company Secretary on a phone.
