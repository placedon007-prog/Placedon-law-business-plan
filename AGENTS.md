# AGENTS.md

Instructions for any coding agent working in this repository — Codex, Claude Code, or
otherwise. Claude Code additionally reads `CLAUDE.md`; the rules there and here are the
same rules.

## What this repository is

**The business plan and research record for Placedon** — an evidence-backed legal
intelligence platform for Indian corporate law (the Companies Act, 2013).

It is primarily a **documents** repository. Its value is that every claim in it is
traceable to a primary source, so the bar for a change here is the same as the bar for a
claim: say where it came from.

| Path | What it is |
|---|---|
| `docs/` | Business plan, technical plans, competitor analysis, measured results |
| `backend/` | A PARTIAL snapshot of the engine — **not the source of truth** (see below) |
| `landing-page/` | Marketing site |
| `tests/`, `conftest.py` | CI shim that runs the engine's self-tests under pytest |

## The `backend/` directory is a snapshot, not the engine

**Read this before editing anything under `backend/`.**

The real engine lives in a separate, private repository (`placedon-law-backend`). The
copy here is partial and stale: 145 files against the real 980, missing the entire
statute corpus (`corpus/companies_act/`, `corpus/rules/`, `corpus/sources/`).

Consequences you will hit:

- 19 of the 30 engine self-tests **skip** in CI, because the corpus they read is absent.
  That is expected and the skips name the missing path. They are not failures to "fix".
- **Do not edit `backend/` here.** A change made here does not reach the engine and
  creates drift between two copies. Make engine changes in `placedon-law-backend`.
- Do not copy the corpus in to make tests pass. That duplicates a source of truth and
  guarantees divergence.

## Non-negotiable rules

These come from the engine's own `CLAUDE.md` and apply to any claim written here.

- **Never state a legal or market claim without a source.** If evidence is incomplete,
  write `UNVERIFIED` or `OPEN`. Do not guess.
- **Never repair a defective source.** Flag it and preserve it verbatim.
- **Never bypass** the MCA WAF, robots restrictions, access controls, or source terms.
  Permitted sources only: official legislation, the Gazette, public ICSI specimens,
  public listed-company disclosures, Indian Kanoon under its attribution terms.
- **Never publish a number you did not measure.** State the sample size on every metric.
  A row that was never run is reported as *not measured*, never as `0.00`.
- **Preserve uncertainty.** Do not silently drop an unresolved marker.
- **This repository is PUBLIC.** Anything committed here is world-readable and stays in
  history even if later deleted. Do not commit secrets, private engine internals, client
  data, or anything from the private backend repo.

## Before you push

```bash
python3 -m pytest -q        # expect: 12 passed, 19 skipped, 0 failed
```

CI runs the same thing on Python 3.9, 3.10 and 3.11, plus a flake8 syntax gate
(`--select=E9,F63,F7,F82`). Both must be green.

## Pushing

The remote is HTTPS with macOS keychain credentials; `git push` works directly. There is
no branch protection on `main`.

```bash
git switch -c <type>/<short-name>     # feat|fix|docs|chore|test
# ... work ...
python3 -m pytest -q
git add -A && git commit -m "<type>: <what changed and why>"
git push -u origin HEAD
gh pr create --fill                   # or push straight to main for docs-only edits
```

**Commit messages carry the reasoning, not just the diff.** The repository's history is
part of its evidence trail: a future reader must be able to see *why* a claim changed,
not only that it did.

## Build artefacts

`__pycache__/`, `*.pyc`, `.pytest_cache/` and embedding caches (`*.pkl`) are gitignored.
If you find one tracked, delete it rather than merging it — bytecode has caused an
add/add merge conflict here before.
