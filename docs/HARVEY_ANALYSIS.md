# Harvey, and what "Harvey for India" would actually mean

Written 2026-08-16. **Harvey's own figures — funding, valuation, pricing, product detail — are with a
research agent and are NOT stated here until verified.** Everything below is built on findings this
project has already established with sources, and it does not need Harvey's numbers to hold.

---

## 1. The uncomfortable opening

Harvey's two headline capabilities are **document review at scale** and **drafting**.

**This project rejected both, on evidence, in the last four days.**

**Drafting** — three practising lawyers in Bengaluru, interviewed directly:

> *"AI is inaccurate for documentation and drafting… robotic and irrelevant."*
> *"75% should be drafted by the person, 25% can be ChatGPT."*

They use AI for exactly one thing: **finding references and pulling quotations**. Drafting is where
professional trust ends, and they said so unprompted.

**Document review** — rejected on four measured grounds:

| | Finding |
|---|---|
| Cost | MCA charges **₹100 per company** for filed documents. ₹5,000/month buys **50 PDFs** and nothing else. |
| Accuracy ceiling | [BuDDIE](https://arxiv.org/html/2404.04003v1), the closest benchmark — corporate registration filings, **born-digital** — caps at **89.97% F1**; GPT-4 reaches **77.76%**. |
| Indian documents specifically | [Devanagari OCR](https://arxiv.org/abs/2606.29213) collapses from chrF++ 91–98 on clean text to a **76-point spread** on real scans. Structured pipelines fall **84.68 → 37.98 under skew alone**, with **tables** — every capital and director schedule — the most fragile element. |
| Failure mode | It fails **silently**. Stanford measured purpose-built commercial legal AI at **17–33% hallucination**, described in the literature as *"locally plausible fabrication."* |

**So "build Harvey for India" means building the two things this project's own research says do not
work for this buyer at this budget.** That is the first thing to be clear about, and it is not a
matter of ambition or effort.

## 2. Three structural reasons the framing fails

### 2.1 The price gap is not a discount problem

Verified Indian pricing for legal knowledge products sold to professionals:

| Product | Price/year |
|---|---|
| Taxmann, individual practitioner | ₹4,100–6,900 |
| Manupatra, 1-year plans | ₹24,700–55,460 |
| SCC Online Platinum | ₹33,500 |
| **Jhana.ai** — AI, Indian legal professionals | **₹39,600–60,000** |

Elite-firm legal AI in the US and UK is sold at enterprise contract values into firms billing in
dollars. **That is not the same market at a lower price. It is a different market.** An Indian
practising CS does not have a smaller version of a magic-circle budget; they have a retainer.

### 2.2 Harvey's moat is capital and distribution, not technology

Harvey sells into elite firms through an enterprise sales motion — long cycles, procurement,
security review, named accounts. **That moat is bought, not built.** A solo founder with ₹5,000/month
competing on that axis is competing precisely where they are weakest.

The architecture is not the hard part. **`verifier.py`, the epistemic lattice and the abstention gate
already exist and took 87 commits.** What does not exist is a sales team.

### 2.3 The buyer is different, and it is not a smaller version of Harvey's

Harvey's buyer is an innovation partner at a large firm, spending someone else's budget on
throughput. **This project's buyer is a practising Company Secretary who signs filings personally and
is named in the penalty order.** Hari Machines, ROC Cuttack, 28 Aug 2025: the company was in
liquidation, so **100% of the penalty fell on the Managing Director and the Company Secretary
personally.**

Those two buyers do not want the same product. One wants leverage. **The other wants not to be
wrong.**

## 3. What Harvey structurally cannot do — and it is the whole opportunity

Harvey's hard problem is **volume**: millions of documents, thousands of matters, retrieval at scale.
Capital solves that. More GPUs, more engineers, more data.

**India's hard problem is different, and capital does not solve it.**

`s.2(85)` of the Companies Act reads **"fifty lakh rupees."** It has read that since 2013. The
operative figure is **₹10 crore**, and it got there through subordinate legislation that moved
**three times**:

| Instrument | Paid-up | In force |
|---|---|---|
| Act as enacted | ₹50 lakh | 1 Apr 2014 |
| G.S.R. 92(E) | ₹2 crore | 1 Apr 2021 |
| G.S.R. 700(E) | ₹4 crore | 15 Sep 2022 |
| **G.S.R. 880(E)** | **₹10 crore** | **1 Dec 2025** |

A tool could cite s.2(85), link a genuine India Code page, quote it verbatim, and be **wrong by three
amendments**. Stanford calls this **misgrounding** — *"falsely asserts that a source supports a
statement."* **A citation that resolves is not evidence of correctness.**

Three independent sources were caught this week serving superseded statutory text **as current**:
`ca2013.com` (pre-amendment text labelled current for s.172 and s.90), `taxguru.in` (pre-2019 s.92(5)
with imprisonment), and **`indiankanoon.org`** (original unamended s.134(8), no annotation).

**This is not a compute problem. It is a care-and-provenance problem, and it does not get easier with
more capital — it gets harder, because it does not parallelise.** Someone has to read the Gazette.

## 4. So what is the actual platform thesis?

The user's framing — *"an AI platform for law, SMEs and corporations"* — is bigger than the current
scope, and it can be true. But the path runs through the wedge, not around it.

**The wedge:** *does this obligation bind my client, what is the operative figure, and when did it
become operative?* — Companies Act, practising Company Secretaries.

**Why it generalises:** the currency problem is not specific to s.2(85). It is the shape of **Indian
statutory law**. Prescribed figures, threshold notifications, staggered commencements and
retrospective amendments run through the Income-tax Act, GST rate notifications, the labour codes,
FEMA limits, SEBI thresholds. **The same machinery — amendment lineage, `as-at` dating, refuse-if-
undated — applies to all of them without redesign.**

**The platform, stated honestly:**

> **The statutory currency layer for India.** Not "what does the law say" — every incumbent claims
> that. **"Is what you are about to rely on still true, and since when."**

That is a platform claim a solo founder can start, because it is won one provision at a time and
each provision stays won.

**And it is the one thing Harvey's advantages do not transfer to.** They have more capital, more
engineers and better distribution. None of that reads a Gazette notification for an Indian
subordinate rule.

## 5. The approach — what I would actually do

**1. Do not build a Harvey competitor. Build the layer Harvey would have to buy.** If Indian legal AI
matures, every player needs to know whether a figure is current. That is infrastructure, and it is
the defensible position for someone without capital.

**2. Keep the wedge exactly as narrow as it now is.** Companies Act, practising CS, currency. One
Act covered properly beats five covered plausibly — and plausibly is what gets people fined.

**3. Do not chase SMEs and corporations directly yet.** The verified pricing says a CS pays for
professional tools. An SME founder does not know they need this until they are penalised. **Sell to
the professional who is personally liable; the SME is their client.**

**4. Let the corpus be the moat, and publish the method.** The Gazette work is slow, unglamorous and
compounding. Publishing *how* currency is tracked — the amendment lineage, the as-at dates — costs
nothing and is the strongest credibility signal available to an unknown founder.

**5. Revisit "platform" only after the ten conversations.** Everything above is reasoning. A
practising CS saying *"yes, I have been burned by a superseded figure"* converts it to evidence. One
saying *"no, I always check"* means the wedge is wrong and the platform thesis dies with it.

---

## 6. The one line

> **Harvey is a leverage product for firms that bill by the hour. This is an accuracy product for
> professionals who are personally named in the penalty order. Copying the first is how you fail at
> the second.**

*Harvey's verified figures — funding, valuation, pricing, product surface, and whether anyone is
credibly "Harvey for India" — pending from the research agent. Nothing in §§1–5 depends on them.*
