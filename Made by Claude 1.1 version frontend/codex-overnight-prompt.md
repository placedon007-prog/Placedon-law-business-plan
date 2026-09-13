# AUTONOMOUS OVERNIGHT BUILD — read fully, then execute without stopping.

## MODE
You are running **unattended overnight**. The human will NOT respond until morning.
- **Never ask a question and never wait for approval.** If a decision is needed, choose the option
  most consistent with the specification, record it in `DECISIONS.md` with a one-line rationale, and
  continue. A single unresolved decision must never stall the build.
- **Your complete specification is `./codex-website-prompt.md` (the full brief) and `./AGENTS.md`
  (the standing rules). Read both, in full, before doing anything.** They are the source of truth;
  obey them exactly. Brand assets are in `./brand-kit/`.
- Work continuously through the loop below until the entire Definition of Done is met, then keep
  hardening quality. **Do not stop early and do not idle.** If you complete everything, spend the
  remaining time on tests, edge cases, polish, and the morning report.

## GUARDRAILS (hard)
- **Local only.** Do NOT push to any git remote, deploy, or publish anything. Do NOT modify or delete
  anything outside this project directory.
- **Never invent** a statutory figure, section, date, metric, customer, or logo. When unsure, use the
  abstain state or a clearly-marked placeholder and log it in `DECISIONS.md`. Pre-launch framing only —
  no live-product/accuracy/customer claims.
- Keep secrets out of the repo; maintain `.env.example` only. Fail closed: never render a fabricated
  legal figure when data is missing — show the abstain state.
- Re-read `AGENTS.md` before every commit. The bar: **a senior design studio would ship this.**

## THE LOOP (repeat each item until it passes with zero open issues, then move on)

**Phase 0 — Foundation.** Confirm the project is Next.js 15 (App Router) + TypeScript strict +
Tailwind v4 + shadcn/ui. Wire the design tokens from `AGENTS.md` (monochrome + ≤10% gold accent).
Self-host the brand fonts from `./brand-kit/fonts` via `next/font/local`. Build the custom brand icon
set (the five marks). Install the libraries from §13 of the brief. `npm run build` must pass. Commit.
*(If the project is not yet scaffolded, run: `npx create-next-app@latest . --ts --tailwind --eslint
--app --src-dir --import-alias "@/*" --use-npm --turbopack` — non-interactively; never leave a prompt
waiting.)*

**Phase 1…N — Each page** (Home, How-it-works, Product, Pricing, Security, FAQ, About, Privacy,
Waitlist/Pilot, 404):
1. Implement per the brief — sections, real copy, components, motion (§12 map), interactions.
2. `npm run build` + `npm run dev`; if a browser/Playwright MCP is available, open the page and
   screenshot **desktop and mobile (360px)**.
3. **Critique it** against: the brief, the `AGENTS.md` end-of-task checklist, and "is this AI slop?".
   Verify brand fidelity (monochrome, one gold accent per view, mono on every statute reference),
   voice/grammar (banned words absent, claim-then-evidence, correct English, self-explanatory),
   accessibility (AA contrast, visible focus, reduced-motion, colour-independent status), and
   responsiveness. Be harsh.
4. **Fix every issue.** Re-verify. Repeat 1–4 until the page has no open issues.
5. Commit with a clear message.

**Phase QA — run these sweeps repeatedly until each is clean:**
- Whole-site consistency (spacing rhythm, the one-accent rule, mono consistency, dark mode, nav states,
  cross-page tone).
- Accessibility (contrast, keyboard nav, labels, focus, `prefers-reduced-motion`, 44px targets).
- SEO (per-route metadata, Open Graph, JSON-LD incl. `FAQPage`, `sitemap.xml`, `robots.txt`, alt text,
  the target keywords woven naturally).
- Performance (`next/image`, font loading, minimal JS; run Lighthouse if available and fix regressions).
- Content proofread of every page — professional, grammatically correct, on-voice, self-explanatory.
- Integration — a typed API client with a `MockProvider` and an `HttpProvider` matching the real
  contracts (`/v1/compliance-pack`, `/v1/company/{cin}/standing`, `/v1/company/{cin}/events`; output
  classes `verified_fact | deterministic_conclusion | predictive_signal` + `abstained`); a working,
  validated waitlist/pilot form (zod, honeypot, pluggable env sink, recorded consent); `.env.example`;
  error boundaries.
- Fix all findings, re-run the sweep, repeat until clean.

**Phase Harden — use all remaining time:**
Add sensible tests (render/lint/typecheck/build must all pass). Polish micro-interactions and the
empty/loading/error/abstain states. Verify reduced-motion paths. Remove every `any`; keep types strict.
Ensure `npm run build`, `npm run lint`, and typecheck are green.

## DELIVERABLES BY MORNING (create and keep current)
- **A running site:** `npm run dev` works with **zero console errors**; `npm run build` passes.
- **`MORNING_REPORT.md`** at the repo root, written for a human skimming in 5 minutes: what was built
  (page by page), key decisions/assumptions (link `DECISIONS.md`), what's polished vs. rough, a
  **ranked list of remaining TODOs / known issues**, where screenshots are, and exactly how to review
  (which routes to open, what to look at first).
- **`DECISIONS.md`:** every assumption you made because you couldn't ask, one line each.
- **Clean git history:** a commit per passing page/phase with descriptive messages, so the morning
  review reads as a clear story.

## DISCIPLINE
Quality over speed, but never idle. If you hit a blocker you cannot resolve, log it under
"**Blocked — needs human**" in `MORNING_REPORT.md`, implement the best fallback, and continue with
everything else. Keep looping and hardening until morning.

**Begin now.** Read `./codex-website-prompt.md` and `./AGENTS.md` in full, then execute the loop end to
end without stopping.
