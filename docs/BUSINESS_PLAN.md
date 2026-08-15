# Placedon — Business Plan

**Scope:** Financial law (Companies Act, 2013) and digital law (Digital Personal Data
Protection Act, 2023). Written 2026-08-16. Supersedes all prior PoSH-first framing —
PoSH is not a module, not a wedge, not in scope. AI law is explicitly excluded until
an enacted statute exists to verify against (see §2).

## 1. What Placedon is

A statutory compliance intelligence engine for Indian private limited companies. It
answers "does this law apply to my company, and when" — every answer traced to the
exact section of the Companies Act or the DPDP Act, every figure verified against
source text. When uncertain, it refuses to answer. That refusal is the product's
distinguishing feature, not a limitation to work around.

**What it is not:** a chatbot, a drafting tool, a filing service, an AI that "thinks"
about law. A deterministic engine decides applicability; a model only narrates the
decision in plain language.

## 2. Scope

### In scope: Companies Act, 2013

One central statute, one verification pass covers all of India. ~50 compliance-relevant
sections, not the Act's full ~470.

| Area | Core provisions |
|---|---|
| AGM timing | s.96(1), proviso |
| Annual return | s.92 (MGT-7) |
| Financial statements | s.137 (AOC-4) |
| Board's Report | s.134 |
| Board meetings | s.173 |
| Small company / OPC definitions | s.2(85), s.2(62) |
| CSR obligation | s.135 |
| KMP appointment | s.203 |
| Significant beneficial owners | s.90 |
| Auditor rotation | s.139(2) |

### In scope: Digital Personal Data Protection Act, 2023

Also a central statute. Real, near-term urgency: Rules notified 13 Nov 2025; Phase II
operational provisions go live **13 Nov 2026**; full compliance including Significant
Data Fiduciary (SDF) obligations by 13 May 2027. Penalties are fixed rupee ceilings,
not turnover percentages, and stack per incident: up to ₹250 crore for security-safeguard
failures, ₹200 crore for breach-notification failures, ₹50 crore per violation for
consent/rights failures.

| Area | Core provisions |
|---|---|
| Data Fiduciary core obligations | s.8 |
| Children's data / verifiable parental consent | s.9 |
| Significant Data Fiduciary — additional obligations | s.10 |
| Consent Manager duties | s.27 |
| Board penalties / Schedule | s.33 |
| Breach notification (72-hour reporting to Board) | Rules, 2025 |

**Architectural note, not a business one:** SDF status under s.10 is *not* a computable
threshold the way small-company status is. A company becomes an SDF only when the
Central Government notifies it by gazette, based on non-cumulative risk factors (volume,
sensitivity, risk to rights, electoral integrity, security). This must be modeled as an
external lookup/register, not a `CompanyFacts` threshold function. See TECHNICAL_PLAN.md.

### Explicitly out of scope

| Excluded | Why |
|---|---|
| PoSH Act, 2013 | Direction change, 2026-08-16. Not a module, not a fallback. |
| AI law | No enacted Indian AI statute exists as of Aug 2026 — only advisory MeitY guidelines (Feb 2026) and a draft RBI proposal (banking-sector only, not final). Nothing to byte-verify against. Revisit only if a binding statute is enacted. |
| GST / income tax | Owned by ClearTax and incumbents; not enterable by a solo effort. |
| FEMA, PMLA, NBFC/RBI | Unstable text, enterprise buyer, well-funded incumbents. |
| SEBI / listed company obligations | Buyer is not an SME; market already served. |
| Drafting, document review, litigation | Strategy, not substrate. Three prior lawyer interviews established methodology varies too much to standardise, and drafting is where professional trust ends. |

## 3. The buyer

**Primary: practising Company Secretaries and CAs doing ROC/compliance work.**
~12,000 practising CS in India (ICSI), serving 40–80 clients each. They are paid a
retainer already (₹5,000–15,000/month per client) — this is an existing budget, not a
new line item. They personally certify filings (MGT-7, AOC-4), so a wrong answer is
their professional liability, not just a client's problem.

**Secondary: founders and finance staff at companies without a CS on retainer.** Lower
willingness to pay, higher price sensitivity, but discover obligations by missing them
today.

**Not the buyer:** large enterprises, listed companies, litigation lawyers, tax
professionals — see exclusions above.

## 4. Unit economics

Every figure below is arithmetic on assumptions except one: **₹2.91 per answer**,
measured (Sonnet, list price, in the live cost tracker). Treat everything else as a
hypothesis until validated in conversations with practising CS.

| Metric | Value | Status |
|---|---|---|
| Cost to verify one provision | ₹500–1,000 | Estimate (professional fee) |
| Full corpus (Companies Act + DPDP, ~70 sections combined) | ₹35,000–70,000 | Estimate |
| Marginal cost per answer | ₹2.91 | **Measured** |
| Subscription price (annual, hypothesis) | ₹3,000–6,000 | Unvalidated — market research suggests ₹1,000–2,000/yr is the current practice-management band; a premium is only justified if statutory grounding proves valuable in interviews |
| Break-even customers | ~15–35 | Depends on which price point validates |

Do not quote a specific ARR projection externally. The prior documents' Year-2/Year-3
numbers disagreed with each other by 2–4x depending on which pricing model and
customer mix was assumed. Until ten CS conversations happen, there is no reconciled
number worth presenting as a forecast.

## 5. Go-to-market

1. **Ten conversations with practising CS in Bengaluru**, before any further corpus
   spend. Question: *"Walk me through the last annual filing cycle you ran for a
   client. Where did you have to stop and check what the section actually said?"*
2. Verify the six Companies Act sections that drive the annual filing cycle
   (s.96, s.92, s.137, s.134, s.173, s.2(85)) — ~₹5,000.
3. Ten unpaid design partners, weekly check-ins on what they actually ask.
4. Convert to paid only if 5+ design partners ask to continue.
5. Add DPDP module once the Companies Act wedge has real usage — the November 2026
   deadline gives a natural, time-bound second launch moment rather than needing to
   ship both simultaneously.

## 6. Risks

| Risk | Assessment | Mitigation |
|---|---|---|
| **The next pivot** | This project has changed direction multiple times in under two weeks. This document is the commitment: no scope change without customer evidence. | Ten conversations before any further build. |
| No CS wants to pay | Untested — zero interviews as of this writing | Ten conversations before corpus spend |
| DPDP corpus complexity (SDF lookup) | Real technical gap identified 2026-08-16 | Model as external register, not threshold function — see TECHNICAL_PLAN.md |
| Verification bottleneck | Needs a lawyer or CS to sign off on each provision | ~70 sections at ₹500–1,000 is ₹35,000–70,000, reachable in phases |
| Solo builder bottleneck | High likelihood, critical impact | Scope discipline; no feature without customer evidence first |

## 7. What is honestly unproven

- Zero interviews with a practising CS about either Companies Act or DPDP compliance.
- Zero interviews with anyone about DPDP specifically — the urgency argument (Nov 2026
  deadline) is real and externally verifiable, but willingness-to-pay is not tested.
- Every number in §4 except ₹2.91.
- Whether one CS wants both modules from one vendor, or would rather buy them separately.
