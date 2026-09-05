# Retrieval findings, round 2 — two corrections to round 1

Measured 2026-09-05, after the first ML program run. Both findings correct things the
first run reported. Published because a result that survives its own re-examination is
worth more than one that was never re-examined.

## 1. The fusion win does NOT transfer to within-section retrieval

Round 1 adopted RRF fusion for **cross-section** retrieval ("which section governs this
question?"): BM25 0.71 → dense 0.73 → **fusion 0.80**, zero regressions.

There is a second retrieval surface: **within-section** ("given a known section, which
sub-clause is the witness span?"). Fusion was tested there and **fails**.

| | p@1 | recall@5 |
|---|---|---|
| BM25 (shipped) | 0.62 | 0.92 |
| Dense (MiniLM-L6) | **0.92** | 1.00 |
| RRF fusion | 0.77 | 1.00 |

13 scoreable cases; 3 `NEEDS_LAWYER` cases excluded and never scored.

**Why it fails, precisely.** Cross-section fusion worked because the two retrievers had
nearly *disjoint* error sets. Here that precondition collapses: `both=8`,
**`only_bm25=0`**, `only_dense=4`, `neither=1`. BM25's correct set is a strict **subset**
of dense's. Fusion has no complementary signal to recover — it is diluting a good ranker
with a strictly worse one.

**The mechanism is a lexical trap, not a lexical gap.** Every BM25 miss is a chunk that
contains the queried term in a *negating* use:

- `2(71)/proviso[1]` — *"…not being a **private company**…"* ranks #1 for "definition of
  a private company"
- `2(85)` — *"…other than a **public company**…"* ranks #1 for "definition of a public
  company"

BM25 sees the term and cannot see that the chunk mentions it only to *exclude* it.
Within one section, what discriminates is not *whether* a term appears but *how it is
used* — which dense dominates rather than complements. Fusion loses both cases by ~0.8%
of RRF score: k=60 trades confidence for agreement, which is right when retrievers are
comparably reliable and backwards when one is strictly worse. k was run once at the
published default and never tuned.

**Dense is not adopted either, and not merely for sample size.** 10 of the 13 cases are
a single template — *"the definition of X"*, where the target chunk literally reads
`"X" means…`. Query and answer are near-lexical restatements, the easiest thing an
embedding does, and dense scores 10/10 there. On the three *genuinely structural* cases
it scores 2/3. The evidence for dense on the hard part of this surface is **three
cases**. 12 of 13 cases also sit in s.2, so recall@5 is carried by one section.

**The blocker is the eval, not the ranker.** 0.92 looks like a result; it is largely a
measurement of how easy the test is. Next action is to grow the scoreable set with
structurally-derived proviso and limb cases across more sections, then re-measure.

## 2. The ablation confound was worse than round 1 reported

Round 1 recorded V4 (p@1 0.10) as **CONFOUNDED**: its prompt ended `"for example: 185"`
and `gemma3:1b` echoed **185** for unrelated questions. The stated remedy was V5's three
varied examples, and V5's 0.45 was reported as a clean number.

**That remedy does not work. V5 was contaminated too.**

Measured on `gemma3:1b` over 6 probe cases: a prompt listing `"185 or 188(1)(a) or
2(85)"` returned **185 for five of the six**. Three examples anchor almost as hard as
one, because the model latches the first real number it is shown. *Any* real section
number in the template is an anchor.

So the correction runs in both directions: V4's 0.10 understated hybrid retrieval, and
V5's 0.45 was not a clean measurement either. Round 1's conclusion — that the V4-vs-V5
delta could not credit schema constraint — was right, but for a broader reason than
stated: the tiers differed in *example exposure* as well as schema constraint, so
neither number measured what its label claimed.

**What survives untouched:**

- V5's **100% schema-validity rate** (20/20 first try, zero repair retries). That is a
  property of the constraint, not of the examples.
- **The headline finding, which never depended on these tiers.** V1 (no retrieval) and
  V2 (dense retrieval) both scored exactly **0.00** with no example numbers in play at
  all — the model could not name the section even when handed it in context 90% of the
  time. Meanwhile RRF fusion scores **0.80 with no model at all**.

The harness is now de-anchored throughout (including the repair prompt — a repair prompt
naming a section is the same trap in a different hat), and `instruction_block()` is
exposed so an anchoring test can inspect exactly what the template contributes. Tests
40 → 50.

**Outstanding and explicitly not done:** the corrected full re-run (n=70 rather than 20,
plus a second model) did not complete — `llama3` proved far slower than estimated on
8 GB. The harness is fixed and tested; the re-measurement is **not** reported as done.

## What neither finding moves

**H-B** (a lawyer resolving the `NEEDS_LAWYER` labels) and **H-C** (a practising Company
Secretary reacting to the evidence pack). Round 2 produced two corrections, one new
module and nineteen commits, and changed neither.

Both findings point the same way as round 1: the limiting factor is the quality of the
evaluation and the absence of practitioner review — not the ranker, not the model, and
not the hardware.
