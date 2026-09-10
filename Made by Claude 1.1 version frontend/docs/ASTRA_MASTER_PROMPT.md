# Master Build Prompt — Placedon Frontend (for ChatGPT‑Astra)

> **How to use this document.** This is the complete brief for designing and building the Placedon
> web frontend — the public marketing/explainer site **and** the in‑product application UI. Read it
> in full before writing a line of code. It is written to be executed by a senior product engineer
> working alongside a senior UI/UX designer; hold yourself to that standard. Do not improvise facts
> about the product — every product claim, figure, endpoint, and status in this brief is verified
> against Placedon's source repository. Where you need a fact that is not here, ask; do not invent it.
>
> **Assumptions made in this draft (correct any before handing to Astra):**
> 1. The currency system is presented publicly as **"Sentinel"**, tagline **"Know where the law stands — and
>    when it moved."** (see Part 7).
> 2. Backend integration is via a **typed API client** — `MockProvider` now, `HttpProvider` against the
>    six real endpoints below — with **no live/staging URL assumed** yet (local server binds `127.0.0.1:8020`).
> 3. The layman narrative **leads with the practitioner who signs the filing** (in‑house counsel /
>    corporate associate / advocate), grounded in the liability idea "it's your name on the order."
> 4. This is a **single master prompt**; the RAG / backend‑integration architecture is Part 8, written so
>    your backend team can lift it verbatim.

---

## 0. Your role, mission, and quality bar

You are the design‑and‑build lead for Placedon's frontend. You are **extending an existing Next.js
codebase** (the "Made by Claude 1.1" frontend: Next.js App Router, Tailwind v4, framer‑motion,
self‑hosted Fraunces / Inter / IBM Plex Mono, a dark near‑monochrome dashboard). You are not starting
from zero and you are not throwing it away. You are **evolving it into Placedon's own design system** and
adding the pages and product screens described here.

**The bar:** every screen should read as the work of people who cared. No template smell, no AI‑slop, no
decorative motion for its own sake. Each element must justify its place. It must be flawless on a phone
and on a 27" display. Grammar and typography are part of the product's credibility — a single sloppy
sentence undermines a tool whose entire promise is precision. Proofread everything.

**Three rules that override any design instinct:**
1. **Never render a citation, figure, date, or metric the backend did not supply.** The product's whole
   claim is that answers are traceable. Faking one in the UI destroys that.
2. **Abstention is a first‑class, designed state — never an error and never empty.** "I can't verify this
   yet, here is what's missing" is the most important screen in the product. Design it as carefully as the
   success state.
3. **No fabricated proof.** No invented customer counts, testimonials, logo walls, accuracy percentages,
   or "trusted by thousands." Placedon is pre‑launch and honest about it. (See Part 3.)

---

## 1. What Placedon is (say this to a total layman)

**In one line:** Placedon is a legal reference for Indian corporate law that **only answers when it can
point to the exact section behind the answer — and tells you plainly when it can't.**

**The category, in the brand's own words:** Placedon is a **witness, not a tool.** It testifies to what it
has actually seen in the statute, and refuses to testify to what it hasn't.

**The problem it removes (the layman version):** Indian company law (the Companies Act, 2013) changes
constantly — thresholds are amended, figures are superseded by government notifications. But the places
people look for answers — legal‑service sites, blogs, "FY 2026 guides" — keep publishing the **old numbers
as if they were current**, with no date and no way to tell. A professional reads a confident figure, uses
it, and only discovers it was superseded when it's on an official filing with **their** name on it. Placedon
calls this "confident unverifiability": answers written in the language of authority without the substance
of a citation. In 2026 the Supreme Court held that citing AI‑hallucinated authority is professional
misconduct — so "sounds right" is now a career risk, not a convenience.

**Who it's for (lead the copy at these):** corporate‑law associates (1–6 yrs, do the first‑pass work),
corporate advocates (draft corporate documents), **in‑house legal counsel** (review without escalating to
expensive outside counsel), and legal researchers. Company Secretaries are a **secondary** user, not the
headline buyer. The thread that unifies them all: **liability** — the tool is built around the person who
signs, not the vendor's convenience. Ground every audience message there.

**What the site must make an ordinary visitor understand within 30 seconds:** *what Placedon is, the
problem it solves, and why "it refuses to guess" is a feature, not a limitation.* If a non‑lawyer leaves
confused, the page has failed.

---

## 1A. India‑first — build this for the Indian practitioner, specifically

Placedon is a product for **Indian corporate law and Indian legal professionals.** The site should feel made in
India and for India — precise and professional, never clichéd. Personalise every layer to this audience:

- **Domain language (use these real reference points; never US/UK framing):** the Companies Act, 2013 and its
  rules; the **MCA / MCA21** portal; the **Registrar of Companies (ROC)**; **CIN** and **DIN**; the **Official
  Gazette** and **G.S.R. / S.O.** instruments; statutory registers; the AGM and board‑meeting cadence; annual
  filings (**AOC‑4, MGT‑7**). No "SEC," no "Companies House," no "$".
- **Money & numbers:** Indian rupees in the Indian numbering system — **lakh / crore** with Indian digit
  grouping (`₹10,00,00,000`, "₹10 crore"), never millions/billions. The ₹ symbol everywhere a figure appears.
- **Dates:** unambiguous, judgment‑style — `1 December 2025` or `01‑12‑2025` — never US `MM/DD/YYYY`.
- **Language:** **Indian English** spelling and register (organisation, judgment, licence, offence), formal and
  exact. Where an example is needed, use a realistic Indian one (a private limited company, the small‑company
  threshold) — but never present an invented company as a real customer.
- **The Indian stake:** the audience is the associate, advocate, in‑house counsel or researcher whose name goes
  on an ROC filing. The **2026 Supreme Court** holding that citing AI‑hallucinated authority is professional
  misconduct is *the* India‑specific reason this product exists — lead with it, factually.
- **Design cues (subtle, premium — not decoration):** you may draw restrained inspiration from Indian legal and
  administrative documents — the typography of a gazette notification, the ruled columns of a statutory
  register, the sober gravity of an official seal or instrument. **No tricolour gradients, no Ashoka‑chakra
  clip‑art, no monument photography.** India should live in the bones of the design, not on its surface.

---

## 2. The product and its features (build the site future‑ready for all of them)

Placedon's product spans **ten features across three phases**, and the site must be built to house **all ten
now.** The information architecture, component library, and design system have to be **future‑ready**, so that
shipping a feature later is a matter of dropping in content — never a rebuild. You are told this because the
team cannot re‑cut the website every time a feature lands.

Two hard limits on that ambition: **(a) build only the real, in‑plan features below — invent nothing outside
this list; (b) never fabricate a feature's data.** Where a feature's engine exists but its screen does not,
**design the screen now** against the real contract (Part 8) so it is ready the day it is wired. The status
column is engineering context for you — use it to sequence work and to bind each screen to real data — not a
disclaimer to plaster across the interface. Ten features across three phases:

| # | Feature | What it does (plain) | Status (do not overstate) |
|---|---|---|---|
| F1 | **Document Currency Check** | Audits the document open in front of you against the law in force *on that document's date* — flags superseded figures, names the instrument that moved them, refuses what it can't verify. | **Specced, not built** (ships first) |
| F2 | **Compliance Matrix** | Company facts → 15 obligation rows: does the duty attach, is it met, or what's missing. Rows come from the law, so a company that uploaded nothing still gets a full matrix. | **Built** (`POST /v1/compliance-pack`) |
| F3 | **Evidence Pack / Verified Report** | The matrix as a dated, cited, hash‑stamped document a CFO can hand to diligence counsel — with an explicit "what could not be verified" list. | **Built** |
| F4 | **Company Event Log** | One dated, sourced stream of what changed — the company's events and the law changes that move its obligations. Bitemporal. | **Built (v0, law‑change stream)** |
| F5 | **Law‑change Monitor** | A new government notification lands → these obligations move → these companies. Dated, sourced alerts. | **Engine built; alerts not built** |
| F6 | **Point‑in‑Time Answer** | "What did this provision say on 15 March 2019?" — the version in force on a past date. | **Machinery built; needs corpus depth** |
| F7 | **Staleness Audit** | For every instrument an answer leans on: is it held, reviewed, superseded, or missing? | **Built** (internal today) |
| F8 | **Bulk Document Review** | Many documents → key terms in a table; **refuses the cell it couldn't read** rather than guessing. | **Not built** (riskiest item) |
| F9 | **Grounded Research Assistant** | Ask a question → a cited answer, or an honest refusal. Never composes advice, never invents a citation. | **Safety spine built; no endpoint/model wired** |
| F10 | **Controlled Drafting** | Every value in a draft is typed by where it came from; an unsourced draft **cannot be approved.** | **Built** (one template) |

**Not in the plan — do not add** (explicitly cut or barred in the repo, so they are *not* future features
either): a general legal chatbot, a free‑text document generator, clause benchmarking, docket analytics, a
"verified company card," or any five‑agent "orchestration" language. These are cut or impossible in India
today; adding them would be inventing a feature.

**Metrics — build the surface, bind it to real data, never invent a number.** The site should carry a
"state of the record" trust surface — for example: the sections of the Companies Act, 2013 currently held,
the number of obligations tracked, the date the law is current to (`law_as_of`), and the corpus/benchmark
versions. Bind these to **real backend data** (`/v1/health` provenance and the pack `summary`), so the figures
are true today and grow on their own as coverage grows — future‑ready without a rebuild. Do **not** hard‑code a
count, and do **not** display any metric that isn't computed from real data (no accuracy %, no "hours saved,"
no customer counts — those are hypothetical data, which is out).

---

## 3. Voice, and the honesty constraints (non‑negotiable)

**Register:** a witness giving evidence, not a vendor selling. Filter test for every sentence: *would this
appear in a judgment?* If it reads like advocacy or sales copy, cut it. Voice in three words: **Terse.
Traceable. Unsparing.**

**The rhythm rule (governs all copy):** *Claim, then evidence — in two sentences, not one.* The second
sentence is the proof of the first. Paragraphs run two to four sentences. White space signals confidence.
Render section numbers in monospace (`s.96(1)`), never paraphrased.

**Use freely:** provision · verified · section / `s.96` · **abstains** (the product's most important word)
· liability · instrument · operative.

**Never use:** streamline, empower, solution, easy, smart, seamless, revolutionary, unlock, supercharge,
effortless, game‑changer, cutting‑edge. (Each is off‑register for a reference instrument.)

**On‑voice examples to imitate:**
- "Placedon covers the Companies Act, 2013. When it cannot point to the exact section behind an answer, it says so."
- "Every provision carries its effective date and the instrument that amended it."
- "When there is no citation, Placedon abstains. That refusal is the standard, not a gap."
- "This is what the law said on the date your meeting happened — not what a webpage shows today."
- "The scope is narrow because the standard is not."

**Never write** (off‑voice): "the smart, all‑in‑one solution to streamline your compliance"; "empower your
team to unlock effortless compliance"; "trusted by thousands to supercharge their workflow"; "never worry
about compliance again."

**Honesty constraints — the one rule is: nothing hypothetical.** You may present the full planned product and
real, data‑bound figures; you may **not** invent a feature that isn't in the plan or a number that isn't
computed from real data. Concretely:
- **No invented data.** Every figure on the site comes from real backend/provenance data (Part 8) or is left as
  a data‑bound surface that fills itself. No fabricated accuracy %, "hours saved," "0% unverified," or any
  number typed by hand to look impressive.
- **No fabricated proof.** No made‑up customer/user counts, testimonials, or logo walls — there are none yet.
  Build those sections as clearly‑labelled, data‑ready placeholders (so they populate when real ones exist), or
  omit them. Never invent one.
- **No feature outside the plan** (Part 2). Every capability shown must be a real, in‑plan feature; design
  unbuilt‑but‑planned screens against the real contract so they're future‑ready — but don't invent a capability
  the plan doesn't contain.
- **No "legally compliant / certified" claim.** Placedon identifies *potentially applicable* provisions; a
  legal conclusion is the lawyer's act. Say what the product does, not that it guarantees compliance.
- **CTAs:** "Request a pilot" / "Request early access" / "Join the early‑access program." **Not** "Join the
  waitlist." Frame the ask as a research program: *"Ten practitioners. You shape what gets built. First access."*
- **Never** the retired HR/PoSH framing or the tagline "expert in the room." That product is dead.
- **Never** quote a competitor's shortcomings as fact (see Part 7 on Sentinel for the honest contrast).

---

## 4. Information architecture

Two surfaces. Build both; keep their chrome distinct (a marketing nav vs. an application shell).

**A. Marketing / explainer site** (public, un‑authenticated)
1. **Home** — the 30‑second explanation: what Placedon is, the stale‑law problem, the "answers or abstains"
   promise, Sentinel as the headline USP, and one honest CTA. This is the most important page.
2. **The problem** — "Legal answers go stale and rarely say so," with the concrete, checkable
   stale‑vs‑current example (Part 7). One demonstration beats ten adjectives.
3. **Product** — how Placedon works in three beats: *retrieve the exact provision → verify it against the
   source → answer or abstain.* Show the built features (F2/F3/F4/F7/F10) honestly; show the roadmap as roadmap.
4. **Sentinel** — the currency system as a USP (Part 7). Its own page or a strong home section.
5. **Evidence / How it works** — the "witness, not a tool" thesis; the abstention design; source‑defect
   preservation; the "LLM explains, code decides, lawyer verifies" division of labour (in plain language).
6. **Pricing / Early access** — the pilot program framing; no fake tiers.
7. **About / Company**, **Legal** (privacy, terms — templates for counsel review, marked "not legal advice").

**B. In‑product application UI** (the app shell — can be behind a login stub for now)
1. **Compliance Matrix** (F2/F3) — the facts‑in form → the 15‑row matrix → the evidence pack. The core screen.
2. **Document Currency Check** (F1) — paste/enter a document's date + company facts → "what moved since then."
3. **Sentinel / Event timeline** (F4/F5/F6) — the bitemporal event stream, law‑change alerts, point‑in‑time lookup.
4. **Research Assistant** (F9) and **Drafting** (F10) — present with their *safety story visible*; where the
   model isn't wired yet, show the grounded/abstain design as the feature, not a broken input.

Each app screen must render the backend's **honesty surfaces** (provenance block, `what_this_is` /
`what_it_is_not`, `unverified` list) as first‑class content, not footnotes. See Part 8.

---

## 5. Design system — a fresh identity in the same family

**The directive:** keep Placedon's *feel* — disciplined, monochrome‑editorial, serif‑led, evidentiary —
but give it a **new, distinct identity** that is unmistakably Placedon and not a copy of anything. Similar
palette and type *temperature*, genuinely new *specifics*. It must never read as generated or templated;
every choice should look considered.

**Colour** — near‑black‑and‑white, ~60/40. Establish a token set: an ink ground, a warm off‑white/paper, a
warm‑grey scale, hairline rules, and **at most one restrained accent** reserved for a single purpose (e.g.
the "verified" mark or a live indicator) — not sprinkled. Reserve one neutral specifically for the
*abstained / unknown* state so uncertainty has its own visual language. Fully theme‑aware (light and dark),
defined with tokens, no hard‑coded hex in components. WCAG AA contrast throughout.

**Type** — keep the tri‑voice structure (a display serif with character, a clean body sans, a monospace for
every citation/figure/date — the mono is Placedon's signature and must be used for every `s.96(1)`,
`₹10,00,00,000`, `G.S.R. 880(E)`, and date). Choose your **own** pairing rather than the current
Fraunces/Inter/IBM Plex — something with the same editorial gravity but its own personality. Set a real type
scale with intentional weights and tracking; tabular numerals for all figures and dates.

**Iconography** — design a **custom, coherent icon set** with a single stroke logic (one weight, one join
style, one corner radius). Do not use an off‑the‑shelf pack as‑is. Icons should feel drawn for a legal
instrument — restrained, precise, a little severe.

**Texture / technique** — you may explore glassmorphism, subtle neumorphism, fine grain/paper texture,
hairline "ledger" rules, letterpress‑style depth, or engraving motifs — **but only where they serve the
evidentiary feel and never as a trend.** Pick one or two techniques and commit; a page wearing five is slop.
Corners restrained, shadows minimal and physical, depth used to signal hierarchy, not decoration.

**The signature** — decide the single element Placedon will be remembered by (a candidate: the *citation
chip* — a monospace section reference with its effective date and amending instrument, treated as a
first‑class, reusable object across the whole product). Whatever you choose, make it consistent and central.

---

## 6. Motion & micro‑interaction

Motion should feel like precision, not flourish. One easing family, a small set of durations, and a clear
rule for where motion is allowed.

- **Purposeful, ≤ ~250ms** for interface transitions; **one orchestrated "hero" moment** per major view at most.
- **Scroll‑reveals** that are calm (short fade + small translate), never bouncy or staggered to excess.
- **Micro‑interactions** on the things that matter: a citation chip expanding to show its source, a matrix row
  resolving to its state, the abstain state arriving with weight (it should feel deliberate, not apologetic).
- **Physics where it adds humanity** (spring on interactive elements), used sparingly.
- **Respect `prefers-reduced-motion`** everywhere — render the final state, no motion. This is a legal‑adjacent
  audience; some will have it on. Non‑negotiable.
- Nothing that causes layout shift or jank; 60fps or don't ship it. Every animation must degrade gracefully on
  a mid‑range phone.

Available libraries (already in the codebase): **framer‑motion** (primary), plus `@react-spring/web` and
`anime.js` for specific needs. Prefer framer‑motion; reach for the others only where they're clearly better.

---

## 6A. The brand at every touchpoint (nothing is off‑brand — not a spinner, not a 404)

Placedon's brand is not the logo and the homepage; it is the feeling that the **same** exacting, evidentiary
intelligence is present in every moment of contact. A user should be able to land on any single frame — a
loading state, an error toast, a tooltip, a confirmation email — and know, without seeing the wordmark, that it
is Placedon. No moment is neutral. Carry the brand — the "witness, not a tool" voice (Part 3), the
monochrome‑editorial system (Part 5), and the **citation chip** as the signature object — through all of these:

- **First paint & loading.** Skeletons are shaped like the real content — matrix rows, citation chips, a
  provenance block — not generic grey bars. The wait already feels like the product. Never a full‑page spinner.
- **Empty states.** An empty screen is an invitation in the witness voice, never a blank: *"No obligations to
  show yet. Enter the company's facts and Placedon will build the matrix."*
- **The abstained state — the brand's defining moment.** This is where Placedon differs from every "confident"
  tool. Make it the most considered screen in the product: calm, competent — *"here is what I can't verify, and
  exactly what would settle it."* It must never read as an error or a gap.
- **Errors.** Terse and precise; name the exact problem (surface the API's `detail` — it names the bad field).
  The interface's voice, not an apology: *"That date is after the read date. A document can't be checked against
  a law that didn't exist yet."*
- **404 / not found.** On‑voice: *"This page is not on the record."* Offer the way back.
- **Action vocabulary, carried end to end.** A control keeps its name through the whole flow: the button that
  says "Request a pilot" produces a confirmation that says "Requested." One verb per action, everywhere.
- **The citation chip, everywhere.** Any time a section, figure, instrument, or date appears — hero, matrix,
  tooltip, PDF, email — it wears the identical monospace treatment, with its effective date and amending
  instrument one interaction away. This single object is what makes the whole product feel like one thing.
- **Forms & inputs.** Labels name what the person controls, in plain terms; statutory inputs render in mono;
  validation speaks inline, in voice, and fails closed.
- **Plain‑language glosses.** Where a legal term is unavoidable on a layman surface, an inline plain gloss on
  hover/tap — never a wall of jargon, never dumbed down for practitioners.
- **Focus, hover, selection, cursor, scrollbars.** Part of the system, not the browser default: a deliberate
  focus ring, a brand selection colour, considered hover feedback. These micro‑details are how care becomes visible.
- **Favicon, app icon, tab title.** The mark as favicon; a stable, specific `<title>` (a name, not a category),
  so Placedon is recognisable in a crowded tab bar.
- **Share surfaces (meta / OG / social cards).** When a link is pasted anywhere, the preview is branded and
  correct — monochrome, the wordmark, an honest one‑line description. The brand travels even where the site doesn't.
- **Transactional email (pilot confirmation, Sentinel alerts).** Same voice, same type discipline, even in
  plain text. A Sentinel alert is dated and sourced — what changed, which obligation, from what date, with the
  instrument — never a bare reminder.
- **Exported documents (the Evidence Pack).** The brand carries into the artifact a CFO hands to diligence
  counsel: the typography, the provenance block, and the explicit "what could not be verified" list are all
  present in the PDF/print. The export is a Placedon document, not a screenshot.
- **App shell vs marketing chrome.** They may look different — a working surface vs a reading surface — but they
  are unmistakably the same family; moving between them feels continuous, not like two products.
- **Continuity in motion.** Consistent easing and shared elements across transitions, so the product feels like
  one connected space (Part 6).
- **Every string.** All microcopy is design material: on‑voice, grammatically flawless, Indian English, mono on
  every citation. One sloppy sentence anywhere undoes the credibility everywhere.
- **Accessibility as brand.** Visible focus, reduced‑motion final states, honest colour‑independent status — a
  witness that respects the reader is part of the identity, not a compliance checkbox.

**The test:** capture any random frame — mid‑load, an error toast, a disabled button, the abstain state, an
email — and it should be unmistakably Placedon and never generic. Build **one source of truth** (design tokens +
a component library + a copy/voice guide) so the brand cannot drift as the product grows.

---

## 7. Sentinel — the headline USP (present it generally, never the architecture)

**What to say Sentinel is (layman, ~kept to this spirit):**

> **Sentinel — know where the law stands, and when it moved.** Indian company law changes more often than most
> people realise. A rule that was correct last year can be quietly replaced by a new government notification,
> and the old number keeps circulating for months — most websites, advisors, and even AI tools simply don't
> notice. Sentinel is built to notice. It keeps a live, dated record of the rules that apply to a company and
> watches for the moment any of them changes; when a new notification lands it can tell you, in plain language,
> **what changed, which of your obligations it affects, and from exactly which date** — always pointing back to
> the original government source. It can also look backwards: for something you did last year, it tells you what
> the law actually said *on that date*, not just what it says today. And when it isn't certain, it says so
> instead of guessing.

**The concrete demonstration to build a section around (state it exactly — these figures are verified):**
- The current rule: a **small company's** paid‑up capital must not exceed **₹10 crore** and turnover must not
  exceed **₹100 crore**.
- Set by **G.S.R. 880(E)** — the Companies (Specification of Definition Details) Amendment Rules, 2025 — dated
  **1 December 2025**.
- The old, now‑superseded figures: **₹4 crore / ₹40 crore** (set by the 2022 amendment G.S.R. 700(E)).
- The observed problem: as checked in 2026, widely‑read Indian compliance sites (e.g. Vakilsearch,
  IndiaFilings, PatronAccounting) **still publish the old ₹4 crore figure**, undated.

**Two honesty guardrails you must honour in this section:**
1. **Frame Sentinel as what Placedon does, not as what others cannot do.** "Absence from a marketing page is
   not absence from a product." Describe the *dated observation* ("as checked on [date], site X still showed
   the pre‑amendment figure") or the *pattern* ("most sources publish a figure with no date and no amendment
   lineage") — never assert a competitor "cannot" or is "fraudulent."
2. **The disciplined behaviour is the story, not just the new number.** Placedon does not simply type in the
   new figure. Until a human verifies the actual government notification and attests it, the engine **refuses**
   every small‑company amount for dates on/after 1 Dec 2025 — and does **not** fall back to the old ₹4 crore
   figure, because that figure is superseded. "It would rather stay silent than restore a superseded figure"
   is the point. (Copy caution: treat ₹10 cr / ₹100 cr as the correct current figures for a stale‑vs‑current
   contrast; do not present them as Placedon's *own verified served answer* unless told the artifact is attested.)

**Positioning line (posture, not superiority):** *"Most legal AI is built to answer. Placedon is built to
abstain when it can't cite — and to look backward on purpose: what did the law say on the date this happened."*

---

## 8. RAG / backend integration architecture (lift this for the backend team)

This is the exact contract. It is **verified against the code.** Build the frontend against a typed client so
the mock and the real server are interchangeable.

**Golden rule (the design invariant):** *"LLM explains. Code decides. Lawyer verifies."* Deterministic Python
decides what the law requires — **no model is ever in the decision path.** A model, when wired, only rewrites
pre‑verified text and may only say what the served source entails; every figure it emits is checked verbatim
afterward. The UI must reflect this: the trustworthy parts are deterministic; the model is the least‑trusted
component and, today, is not wired at all.

**The real API (a zero‑dependency stdlib server; local bind `127.0.0.1:8020`; facts go in the POST body, never
the URL). These six routes exist — do not build the client against any others:**
```
GET  /v1/health
POST /v1/compliance-pack
POST /v1/document-check
GET  /v1/company/{cin}/events
GET  /v1/company/{cin}/events/{event_id}
GET  /v1/instruments/{fragment}/affected
```
There is **no `/v1/ask`** and **no `/v1/company/{cin}/standing`** yet (F9's answer endpoint is unbuilt). Do not
stub them into the client as if they exist. Every deterministic response carries `"no_model": true`; errors are
`400 {error:"bad_request", detail}` (surface `detail` — it names the exact bad field) and
`404 {error:"not_found", detail, routes:[…]}`.

**Key response shapes** (exact field names):
- **`POST /v1/compliance-pack`** → `{ company_class, cin, as_of, financial_year, generated_at, provenance,
  summary{ not_satisfied, undetermined, cannot_determine, satisfied, not_applicable }, rows[ { obligation_id,
  duty, provision, state, basis, missing_facts[], blocked_by, cited_spans[ {path, sha256, resolved} ] } ],
  unverified[], law_currency_watch[], what_this_is[], what_it_is_not[] }`. Request needs `company_class`
  (`private|public|opc`), `incorporation_date`, `as_of`, optional profile flags and an `evidence` object; money
  fields are integer whole rupees, suffix `_rupees`, and require `financial_year`.
- **`POST /v1/document-check`** → `{ document_date, as_of, summary{ superseded, cannot_verify, verified },
  superseded[…named-instrument…], cannot_verify[…], verified[…], no_model:true }`.
- **`GET /v1/company/{cin}/events`** → bitemporal events: each has `at` (valid time — when it took effect) and
  `known_at` (transaction time — when we learned it), plus `output_class`, `title`, `obligation_id`, `source{…}`.
  v0 serves **law‑change events only**; the response `scope` says so — surface that caveat, don't hide it.

**Three taxonomies — keep them distinct in the UI, do not blur them:**
- **Obligation row `state`** (compliance‑pack): `APPLIES_SATISFIED` · `APPLIES_NOT_SATISFIED` ·
  `APPLIES_UNDETERMINED` · `DOES_NOT_APPLY` · `CANNOT_DETERMINE`. Never collapse `DOES_NOT_APPLY` (a real "no")
  with `CANNOT_DETERMINE` (an "I don't know"): they must look different.
- **Event `output_class`**: `VERIFIED_FACT` (instrument/registry‑sourced, has a verifier) · `DETERMINISTIC_CONSEQUENCE`
  (computed, reproducible) · `SIGNAL` (shown, **never asserted** as fact). A `SIGNAL` must never wear the visual
  costume of a `VERIFIED_FACT`.
- **The future answer path** (F9) abstains as `INSUFFICIENT_EVIDENCE` — "the law itself is not here / here's what's
  missing," visibly different from an error and from `DOES_NOT_APPLY`.

**Typed client to build:**
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
type RowState = "APPLIES_SATISFIED"|"APPLIES_NOT_SATISFIED"|"APPLIES_UNDETERMINED"|"DOES_NOT_APPLY"|"CANNOT_DETERMINE";
type OutputClass = "VERIFIED_FACT"|"DETERMINISTIC_CONSEQUENCE"|"SIGNAL";
```
`MockProvider` returns fixtures shaped exactly per the above (keep enum strings identical to the backend).
`HttpProvider` targets the real server and treats `{error:…}` bodies as typed failures. Swapping them must be a
one‑line change.

**Four required frontend states for every data view:**
1. **Loading / skeleton** — deterministic packs are fast (~0.6s) but treat as async; never a full‑page spinner.
2. **Verified answer** — render `rows` grouped by `summary`; show `provision`, `basis`, and `cited_spans`
   (`path` + `sha256`) as visible proof; badge each row by `state`. **Always** render `provenance`,
   `what_this_is`, and `what_it_is_not` — these are the product's honesty surface, not chrome.
3. **Abstained** — first‑class, not an error. `APPLIES_UNDETERMINED` / `CANNOT_DETERMINE` show `missing_facts`
   and `blocked_by` ("what would settle this"); the `unverified[]` list is the map of gaps. Design this to feel
   competent and intentional.
4. **Error** — surface `detail` (the exact bad field) for 400; render `routes[]` for a 404. A degraded network
   state must look different from an abstention: an abstention is a correct answer; an error is not.

**Retrieval note for anyone extending the engine:** today retrieval is **lexical/BM25 by citation**, not vector
(dense/InLegalBERT is a planned V1.5, not wired). The corpus is per‑section JSON, each record hash‑stamped
(`sha256`). Nothing reaches a user below the `CORROBORATED`/`VERIFIED` evidence state. Do not imply semantic
search or a live model in the UI.

---

## 9. Tech, performance, accessibility

- **Stack:** Next.js (App Router) + Tailwind v4 + framer‑motion, extending the existing frontend. TypeScript
  strict; ESLint/Prettier clean; it builds and runs.
- **Accessibility:** WCAG AA, visible keyboard focus, 44px targets, labelled controls, no colour‑only status
  (row states and event classes must be distinguishable without colour — pair each with a shape/label/pattern),
  reduced‑motion respected.
- **Responsive:** design mobile‑first for the reading surfaces; degrade the matrix/timeline gracefully to a
  single column; wide tables and diagrams scroll inside their own container — the page body never scrolls
  sideways.
- **Performance:** self‑host fonts, lazy‑load below‑the‑fold media, no layout shift, no blocking animation.
- **SEO:** real metadata, OG, JSON‑LD, sitemap/robots; an FAQ schema where honest. Target Indian search intent
  (Companies Act 2013, MCA, small‑company threshold, ROC filings).
- **Localisation (India):** format every figure as ₹ with Indian lakh/crore grouping, every date as
  `1 December 2025`, and all copy in Indian English — centralise the formatters so it is consistent everywhere
  and easy to keep correct.
- **Data:** everything behind the typed `EngineProvider`; `MockProvider` now, `HttpProvider` matching the
  contracts in Part 8. Fail closed — never render a fabricated legal figure when data is missing; render the
  abstained state.

---

## 10. Deliverables and acceptance checklist

**Deliverables:** the extended Next.js frontend — the marketing site (Part 4A), the app screens (Part 4B), the
Placedon design system (Part 5) as reusable tokens/components, the motion system (Part 6), and the typed
`EngineProvider` with a `MockProvider` (Part 8). Include a short design‑decisions note (palette, type, icon
logic, signature element, motion rules) so the choices are legible.

**Before you call any screen done, check:**
- Near‑B&W + one restrained accent held; the abstain‑neutral used only for uncertainty · mono on every
  citation/figure/date · custom icon set, one stroke logic · type scale intentional · one signature element
  used consistently.
- Every data view has all four states (loading / verified / abstained / error), and the abstained state is
  designed, not empty.
- Copy is real, grammatical, on‑voice, no banned words, no fabricated proof, self‑explanatory to a layman.
- No feature outside the plan (Part 2) is invented, and no data is fabricated; no endpoint used that Part 8
  doesn't list; no citation/figure/metric rendered that isn't computed from real backend data.
- India throughout: ₹ in lakh/crore, dates as `1 December 2025`, Indian English, real Companies Act / MCA
  reference points — no US/UK framing, no tricolour kitsch.
- The brand holds at **every touchpoint** (Part 6A): pick any random frame — loading, empty, abstain, error,
  404, a form field, a tooltip, the favicon, a share card, an email, the exported Evidence Pack — and it is
  unmistakably Placedon, never generic.
- a11y AA · reduced‑motion respected · responsive to 360px · no horizontal body scroll · 60fps motion.

**How to work:** brainstorm the design system first (palette, type, icon logic, signature, motion) and lock it
before building screens; build the marketing home and the compliance‑matrix app screen first (they exercise the
whole system); critique your own output against Part 10 as you go, and remove one thing that isn't earning its
place before you ship each view.

---

*End of master prompt. If anything here is ambiguous or you need a fact not stated, ask before inventing it —
this is a product whose entire value is that it does not guess.*
