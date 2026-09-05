# ML program — measured results

> **⚠️ SUPERSEDED IN PART — see [ABLATION_CORRECTED.md](ABLATION_CORRECTED.md).**
> The ablation tiers below (V1/V2/V4/V5) were measured with prompts that fed the model an
> example section number, on 20 cases. A de-anchored re-run over all 70 cases moves V2
> from 0.00 to 0.24 and V4 from 0.10 to 0.63, and **overturns the headline claim that the
> model could not select from evidence placed in front of it.** The retrieval numbers in
> this document (BM25 0.71, dense 0.73, fusion 0.80) are unaffected and stand.

Run 2026-09-05 with full delegated authority. Every number here was measured on this
machine against the project's frozen 70-case retrieval eval. Nothing is projected,
estimated, or carried over from a plan document.

## 0. The result in one table

| Configuration | p@1 | recall@5 |
|---|---|---|
| BM25 (what was shipped) | 0.71 | 0.91 |
| Dense embeddings (MiniLM-L6) | 0.73 | 0.96 |
| **RRF fusion of the two** | **0.80** | **0.97** |
| Learned reranker (held-out, 7-fold) | 0.83 ± 0.10 | 0.96 |
| `gemma3:1b` + hybrid retrieval + schema constraint | 0.45 | — |
| `gemma3:1b` + dense retrieval | 0.00 | — |
| `gemma3:1b` alone | 0.00 | — |

**Adopted: fusion.** Everything else was measured and declined, on the record.

## 1. Two questions the hardware answered, not opinion

The machine was measured before anything was planned on it: **Apple M1, 8 GB unified
memory, Metal only, no CUDA.** Ollama holds `gemma3:1b`, `llama3`, `qwen3.5`,
`mistral-nemo`. Python already has `numpy`, `torch`, `transformers`,
`sentence_transformers`, `sklearn`.

**The 8B QLoRA fine-tune is cancelled.** Unsloth requires NVIDIA/CUDA; there is none.
8 GB is *total* unified memory and `qwen3.5` alone occupies 6.6 GB of it. This is
arithmetic, not a judgement to revisit. Ablation tiers requiring a trained adapter are
recorded NOT_RUNNABLE with the reason — never approximated.

**Decision B is unblocked, and was reversed.** Embeddings were deferred on 2026-09-04
for one recorded reason: adding a heavy dependency. `sentence_transformers` and
`all-MiniLM-L6-v2` were already on disk. The stated blocker did not exist, so the
experiment ran.

## 2. Why fusion wins: the errors are disjoint

Dense beat BM25 by one case on p@1 — noise at n=70. The structure of the failures was
the real finding:

- BM25 misses that dense answers (11): 13, 14, 42, 73, 129, 134, 137, 139, 164, 169, 271
- Dense misses that BM25 answers (8): 8, 88, 110, 118, 123, 152, 179, 230
- Defeat both (9): 47, 62, 77, 94, 101, 135, 180, 232, 248

Nearly disjoint failure sets are the precondition for Reciprocal Rank Fusion, which
predicts fusion should beat *both* rather than land between them. It did: **0.80 p@1,
0.97 recall@5, with zero regressions** — not one case either retriever answered is lost
— and it rescued s.101 from the nine that defeated both.

RRF fuses **ranks**, never scores: BM25 scores and cosines are incommensurable and are
never added or normalised into each other. k = 60, the published default, used as-is and
not fitted to the eval.

This also retroactively vindicates the earlier decision to ship BM25. It was not the
wrong signal. It was half the signal.

## 3. The reranker: built, measured, declined

A from-scratch linear model over interpretable features, 7-fold cross-validated and
grouped by section so paired questions cannot leak across a split. Held-out **p@1 0.83
± 0.10**, training fit 0.84 — a 0.01 gap, so not badly overfit.

**Declined anyway.** 0.83 sits well inside one fold standard deviation of fusion's 0.80;
at n=70 they are not distinguishable. It is also slightly *worse* on recall@5, since it
can only reorder the pool handed to it. Against an undemonstrable gain it adds fitted
parameters — a permanent overfitting and maintenance liability in a system whose thesis
is auditability. Fusion achieves the same with nothing learned. The cheaper component
wins.

The weights are the useful output, and are published rather than hidden:

| feature | weight | reading |
|---|---|---|
| `dense_top1` | +2.71 | trusts each retriever's top hit… |
| `bm25_top1` | +2.61 | …almost exactly equally |
| `both_retrieved` | +2.19 | **retriever agreement is a strong independent signal** — the model rediscovered the RRF insight from data |
| `heading_overlap` | +1.85 | section titles carry real topical signal |
| `rrf_bm25`, `rrf_dense` | ~0.00 | continuous rank features add nothing once top-1 indicators exist |
| `query_has_number` | **+0.000** | **never fires** — the eval's questions are plain English and name no sections |

The dead feature is reported rather than quietly dropped. A feature contributing exactly
nothing is a finding about the evaluation set, not only about the model.

## 4. The ablation: a small model degrades a working pipeline

`gemma3:1b`, first 20 of the 70 cases (stated on every line — an unstated sample is a
lie by omission).

| Tier | p@1 | gold in context | schema-valid | latency |
|---|---|---|---|---|
| V1 base model, no retrieval | 0.00 | — | — | 0.62 s |
| V2 + dense top-5 | 0.00 | 0.90 | — | 0.73 s |
| V3 PEFT, no retrieval | **NOT_RUNNABLE** | — | — | — |
| V4 + hybrid BM25⊕dense | 0.10 **CONFOUNDED** | 0.95 | — | 0.85 s |
| V5 V4 + schema-constrained | 0.45 | 0.95 | **1.00** (20/20 first try) | 0.89 s |

**V3 was never run, so its p@1 is reported as *not measured*, never as 0.00.** A row
that was never run must not look like a row that scored zero.

**V4 is confounded, and the cause was our own prompt.** The jump from 0.10 to 0.45 on
*identical* retrieved context was implausible, so raw outputs were inspected before
publishing rather than after. Extraction was not at fault. The V4 prompt ended
`"...for example: 185"`, and the model echoed **185** for unrelated questions — observed
directly on "rules for a private placement offer" (gold 42) and "how does a company
issue further shares" (gold 62). V5 offered three varied examples, so no single number
dominated. 0.10 therefore measures a badly written prompt, and **the V4-vs-V5 delta
cannot be used to claim schema constraint improves accuracy.** What V5 does legitimately
demonstrate is a 100% schema-validity rate with zero repair retries.

**The finding that survives every caveat:** V1 and V2 at exactly 0.00 are the sharpest
data point. *Handed the right section in its context 90% of the time*, the model still
could not name it. The bottleneck is neither knowledge nor retrieval — it is the model's
ability to select from evidence already placed in front of it.

The original plan predicted V5 would be "state of the art" with retrieval as the
enabling layer. Measured, **retrieval is the system, and this model subtracts from it.**
Accuracy is a systems property — and the corollary the plan did not draw is that a weak
model is not a neutral addition to a good pipeline. It is a regression.

## 5. What this licenses, and what it does not

- It does **not** show fine-tuning is pointless. V3 was never run and cannot be on this
  hardware. A tuned model might clear 0.80; that is untested.
- It **does** show that putting a small local model in the answer path today would
  roughly halve accuracy.
- It **does** justify fusion on its own merits: 0.80, no GPU, no fitted parameter, no
  new dependency, no model.

Caveats stated plainly: n=20 for the ablation (one case moves p@1 by 0.05); one model
only; prompts not tuned per tier — which is precisely what confounded V4.

## 6. What none of this moved

**H-B** — a lawyer resolving the `NEEDS_LAWYER` retrieval labels. **H-C** — a practising
Company Secretary reacting to the evidence pack.

Sixteen commits, four new measured components, one adopted. The bottleneck is where it
was at the start of the day: a conversation with a practitioner, which no amount of
retrieval, fusion, or fine-tuning substitutes for.
