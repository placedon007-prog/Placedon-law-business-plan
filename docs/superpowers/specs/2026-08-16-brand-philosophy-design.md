# Placedon — Brand Philosophy & Content Direction
**Spec date:** 2026-08-16
**Derived from:** Five-agent council (Brand Philosopher, CS/CA Buyer Voice, Devil's Advocate, Verbal Identity, GTM Reality Check)

---

## 1. What Placedon IS

Placedon is a **witness**, not a tool. It either has seen something in the statute or it hasn't. It testifies to what it has seen and refuses to testify to what it hasn't. That is not a feature — it is the category.

The product exists because of a specific failure mode in professional practice: **confident unverifiability.** Not ignorance. Practitioners are not ignorant. The risk is answers given in the language of authority without the substance of citation — answers that cannot be challenged because they sound right, and that carry professional liability when they're wrong. Placedon makes that gap visible.

The relationship between Placedon and its user is **division of epistemic labor**. The CS brings professional judgment, context, client relationship, interpretive experience accumulated over years. Placedon brings one thing: fidelity to what the statute literally says, and silence where it does not say. The CS decides. The witness says what it observed.

---

## 2. Core brand belief

> The gap between *sounds authoritative* and *is citable* is where professional liability lives.

Every practising CS has given an answer at speed that was right enough but couldn't be survived in an adjudication hearing. Every compliance tool before Placedon treated that gap as acceptable. Placedon's existence is a claim that it is not.

The abstention — `ABSTAINS` when no citation exists — is not a limitation to be worked around. It is the product's most important output. **A known silence is safer than an unknown error.**

---

## 3. Verbal identity

### Voice in three words
**Terse. Traceable. Unsparing.**

Filter test: would this sentence appear in a judgment? If it reads like advocacy or sales copy, cut it.

### Rhythm rule
**Claim, then evidence. Always split the assertion from its basis. Never merge them.**

"The law doesn't need an opinion. It needs a citation." — two sentences where most brands write one. The break is not stylistic; it is structural. The second sentence is the proof of the first. This rule governs all Placedon copy.

Variation: a longer sentence is permitted only when it carries a necessary qualification. Never for rhythm, never for warmth. Paragraph length: two to four sentences. White space signals confidence.

### Words IN
| Word | Why |
|---|---|
| Provision | Statute has provisions, not rules or guidelines |
| Verified | Earned, binary, with a citation behind it |
| Section [number] | Always in monospace (`s.96`), never paraphrased |
| Abstains | Used unashamedly — the product's most important word |
| Liability | The real word for what CS and CA professionals carry |

### Words OUT
| Word | Why banned |
|---|---|
| Streamline | Implies friction was the problem — it wasn't |
| Empower | Placedon cites statute; empowerment is a promise the law never made |
| Solution | Implies a product category; Placedon is a reference instrument |
| Easy | Compliance is not easy; pretending otherwise destroys credibility |
| Smart | A modifier that signals insecurity; the work is verifiable, not clever |

### Register
| Spectrum | Position | Reason |
|---|---|---|
| Formal ↔ Conversational | 80% formal | The buyer uses formal register in their own work; matching it signals competency |
| Warm ↔ Cold | 65% cold | Not hostile — indifferent to persuasion. Copy does not want to be liked; it wants to be trusted |
| Confident ↔ Humble | 75% confident | Humility appears exactly once: in abstention. Citing statute is demonstration, not claim |
| Technical ↔ Plain | 60% technical | CS professionals do not need a glossary; founders get plain language only where necessary |

### The governing paragraph (use as reference for all new copy)
> Placedon covers the Companies Act, 2013. Every provision that drives the annual filing cycle — fully, with the amending instrument recorded where the Act was changed — or not at all. When it cannot point to the exact section behind an answer, it says so. That refusal is not a gap in coverage. It is the standard. The scope is narrow because the standard is not.

---

## 4. What the brand can honestly claim today

The GTM rule: **brand claims should always be one step behind the last provable artifact.**

Today's provable artifact is the architecture — the abstention-first design exists. The corpus does not yet exist. The claims follow accordingly.

| Claim | Credible now | Notes |
|---|---|---|
| "The law doesn't need an opinion. It needs a citation." | Yes | Philosophy, not feature. Keep. |
| The architecture refuses to guess | Yes | Design property, verifiable |
| When it doesn't know, it says so | Yes | Design property |
| "~50 provisions covered" | No | Zero ingested yet — qualify as planned or remove |
| "Built for practising CS/CA" | No | Zero interviews done — soften to "practitioners who sign the filings" |
| "0% claims shipped unverified" | Only as design intent | Not a track record yet — say "designed so that" |
| "1,150+ ROC orders in FY 2024-25" | Use only for problem framing | Source unverified; do not use as product proof |

---

## 5. The emotional core

The CS/CA buyer agent surfaced the line no compliance tool has ever said:

> *"We know that when this answer is wrong, it's your name on the order — not ours."*

This is the emotional territory Placedon owns. Every piece of content should be grounded in the awareness that **this product was designed around the practitioner's liability, not the founder's convenience.** That is the asymmetry no competitor acknowledges.

---

## 6. Landing page changes that follow from this spec

### Cut / replace
| Current | Problem | Replacement direction |
|---|---|---|
| "Statutory compliance, verified" (tagline) | "Verified by whom?" — no answer | "Every answer traced to the exact section." Mechanistic, falsifiable, auditable |
| "~50 provisions covered — every compliance-relevant section" | Zero ingested, "every" is overclaim | Remove or qualify as "planned coverage" until first provisions are live |
| "Built for practising Company Secretaries and CAs" | Zero interviews — dangerous overclaim | "Designed for practitioners who sign the filings" |
| Waitlist framing | Implies late-beta product; misleads CS audience | Early-access research program: "Ten practitioners. You shape what gets built. First access." |

### Add
| Addition | Rationale |
|---|---|
| Corpus date / amendment lineage transparency | The CS buyer's first question: "As of what date? Which amendment?" |
| One real verified answer (when first provision is live) | The only thing that converts a CS: "Show me s.96(1) and let me check it myself in three minutes." |
| Explicit scope statement — what is NOT covered | Devil's Advocate: saying what you won't do is a stronger trust signal than what you will |

### Do not change
| Element | Why |
|---|---|
| "The law doesn't need an opinion. It needs a citation." | Lands with CS audience, credible on day zero |
| "We don't guess." | Philosophy claim, correct and defensible |
| "Slow / Blind / Confident" gap grid | Problem framing is right regardless of statute |
| Design system (colors, type, spacing) | Quiet authority is correct for this audience |

---

## 7. The waitlist reframe

Current: *"Join the waitlist"*

Honest reframe: Placedon has no corpus yet and zero CS interviews done. A waitlist implies imminent delivery. The honest ask is:

> *"We're talking to ten practising Company Secretaries before we ingest a single provision. If you help shape what gets built, you get first access."*

This treats the CS as the authority they are. It's also how the business plan describes the actual next step — ten conversations before any corpus spend.

---

## 8. First proof artifact (when ready)

Before any brand claim about coverage, publish one public verification log:
- Take `s.96(1)` of the Companies Act
- Ingest via `ingest_companies_act.py`, byte-verified against India Code
- Run `check_transcription.py`
- Post the diff publicly

A CS who sees that understands immediately what abstention-first means in practice. It is more credible than any landing page copy.

---

## 9. What is NOT being decided here

- The product roadmap (covered in TECHNICAL_PLAN.md)
- Whether to add a second statute (BUSINESS_PLAN.md §5 — no, until Companies Act has paying users)
- Pricing or unit economics
- Visual design changes beyond copy

This spec governs: what the brand believes, how it sounds, what it can honestly say, and what content direction the website follows from that.
