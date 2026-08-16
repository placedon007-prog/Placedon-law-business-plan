# Interviews — four, and the fourth changes things

Written 2026-08-16. Three practising lawyers (Bengaluru, property/family and general practice) and
**one company decision-maker** — Manoj Murarka, Manishankar Oil.

**Transcript caveat:** interview 4 is automatic speech recognition of a Hindi phone call and is
noisy in places. Only passages that are unambiguous across the two transcript versions are relied on
below. Where meaning is uncertain it is marked.

---

## 1. The single most important line in four interviews

Asked *which kind of lawyer should we talk to about this*, he answered "corporate lawyer" — then
corrected himself, unprompted:

> **"सबसे ज़्यादा काम करेगा वो CA है, company secretary."**
> *(The one who will use this most is the CA — the company secretary.)*

**A company decision-maker, from the buying side, independently named the buyer this project chose
from desk research.** That is the strongest validation the buyer thesis has received, and it came
from someone with no reason to flatter the idea.

He goes further: *"बहुत ज़्यादा contract corporate lawyer से नहीं करता"* — he doesn't use a corporate
lawyer much — but suggests talking to one anyway, for information.

**Consequence: the ten calls should now be to Company Secretaries. Not corporate lawyers, not
in-house counsel.** That question is closed.

## 2. What he actually asked for — and it is not what we are building

His own product input, offered unprompted and returned to **three times**, was **counterparty
identity verification**:

| Ask | His words |
|---|---|
| **PAN validation** | *"PAN number दिया — verify कर सकें कि सही है"* |
| **GST validation** | *"GST number डालने का — सामने वाली पार्टी को authenticate करके दे सकें, GST site से link हो जाए, बता दे क्या इस नाम की firm है"* |
| **Bank account name match** | *"लोग करते हैं फर्जी — account number दे दिया और नाम अलग दे दिया… इसमें बहुत बड़ा fraud हो जाता है"* |

His concrete fraud example: account details say **Rajesh Kumar** when the payee should be **Mahesh
Kumar**; the payment goes out to the wrong person. He suggested a UPI-based check on the account
holder's name.

And what he wants at the end of it:

> **"एक verified का sign लग जाए"** — *a "verified" mark on the document.*

**That is a provenance stamp.** It is the same instinct this product already has, applied to
counterparties rather than statutes.

## 3. What this interview kills

**Contract review as the wedge.** He says plainly: *"हम लोग contract का ज़्यादा काम होता नहीं, क्योंकि
कोई third party काम नहीं करते."* Their contracts are mainly **government tenders**. A contract-AI
pitch has almost no surface here.

**Document parsing, again.** Asked whether documents are physical or online: **"सब physical रहते
हैं."** This is the fourth independent confirmation, and it now includes the company side, not just
the courtroom.

**"Legal AI for enterprises" as a category.** His actual legal work is **licences** — food licence,
GST, income tax — mostly **one-time with renewals**, handled by an internal team and then passed to
a party. That is not a document-review problem or a drafting problem. **It is a calendar-and-status
problem**, which is much closer to what this product already does than to Harvey.

## 4. What it validates

**Cross-document consistency checking**, precisely scoped by him:

> *"99% contract में झमेला नहीं होता, लेकिन 1% में… tender में तो लिखा हुआ है, copy-paste कर देते
> हैं, amount जो लिखना चाहिए था वो गलत हो गया… normally चल जाएगा, लेकिन कहीं litigation आ गया."*

**A copy-paste error between the tender and the contract, in the amount.** He estimates 1%. He is
explicit that it does not matter until it matters — and then it is litigation.

**That is a checkable fact, not a judgment** — exactly the "substrate not strategy" layer. It is the
same shape as the conjunctive-limb check in s.2(85): compare two numbers that must agree, and say so
when they do not.

## 5. The honest tension, and I am not resolving it yet

His top ask — **PAN, GST and bank-account verification — is not legal AI.** It is vendor onboarding
and fraud prevention. That market has funded incumbents (Signzy, IDfy, Karza/Perfios, Surepass), and
eligibility rules for PAN verification in particular are restrictive.

**A feasibility agent is checking three things right now:** whether these APIs are available to a
solo founder with no registered company, what they cost, and whether regulation forbids it outright.
**No decision until that returns.**

But note what the ask *shares* with the existing product, because this is not a coincidence:

| His ask | What already exists here |
|---|---|
| Look up a GSTIN, get the registered name | **Verified live**: OGD company master data, CIN → name, capital, status, 3.67M records, ₹0 |
| Show a "verified" mark | The `as-at` date and instrument citation on every figure |
| Refuse to confirm when it cannot | The abstention gate |

**He is describing structured-lookup-with-provenance.** That is the architecture already built —
pointed at counterparties instead of statutes.

## 6. Four interviews, synthesised

| | Lawyer 1 (property) | Lawyer 2 (senior) | Lawyer 3 (senior) | **Murarka (company)** |
|---|---|---|---|---|
| Uses AI for | references, quotations | — | — | n/a |
| Rejects AI for | **drafting** — "robotic", 75/25 | all of it — "prejudice" | all of it — "irrelevant to my field" | n/a |
| Documents | **physical**, except e-filed types | — | — | **"सब physical"** |
| Names the buyer | — | — | — | **Company Secretary** |
| Top pain | precedent extraction | — | — | **counterparty fraud** |

**Three consistent findings across all four:**

1. **Documents are physical.** Four sources. Any plan assuming a digital pipeline is wrong, and this
   is now settled rather than suspected.
2. **The trusted use of AI is finding and sourcing, never composing.** Lawyer 1's 75/25 is the only
   quantification anyone offered.
3. **Nobody asked for drafting. Nobody asked for a chatbot.** Every stated pain was
   *verification* — of a quotation, of an amount, of a counterparty.

**That third point is the thesis, arrived at independently four times.** The product's job is to
confirm or refuse, not to compose.

## 7. What changes now

**Closed:**
- **The ten calls go to Company Secretaries.** Named by the company side, unprompted.
- **Contract review is not the wedge.** Killed by the one enterprise interview we have.
- **Document parsing stays rejected.** Now on four independent confirmations, not just cost and F1.

**Open, pending the feasibility agent:**
- Whether counterparty verification (GST/PAN/bank) is legally and financially buildable by a solo
  founder. If yes, it is a strong second surface *because it is the same architecture*. If no, it is
  noted and dropped.

**Unchanged:**
- The Companies Act statutory-currency wedge. Nothing in this interview contradicts it, and his
  licence-renewal description is adjacent to it.

## 8. What is still not known

- **Zero Company Secretaries interviewed.** The buyer is now named by two independent routes — our
  research and a company decision-maker — and **still has not been spoken to.**
- One enterprise interview is one data point. Murarka runs an oil manufacturer; a services company or
  a startup would have a different legal surface.
- He said of his own suggestion: *"पता नहीं कितना feasible है, मैंने कभी देखा नहीं"* — **he does not
  know if it is buildable and said so.** He was describing a pain, not specifying a product.
