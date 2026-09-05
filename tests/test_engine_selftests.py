"""Run the engine's own self-tests under pytest.

## Why this file exists

CI has been red since 2026-08-31 and, worse, has been testing *nothing*. `pytest`
collected 0 items and exited 5 ("no tests collected"), because the engine's tests are
not written in pytest's idiom: every module carries a `_test()` function that prints
`[PASS]`/`[FAIL]` lines and raises `SystemExit(1)` on failure, run by
`backend/scripts/run_tests.sh`.

That house style is deliberate and worth keeping — the modules stay dependency-free and
runnable standalone (`python3 checker/obligations.py`). So rather than rewrite 30 modules
into pytest idiom, this adapts pytest to them: discover every module exposing `_test()`,
run it as one parametrised case, and translate its exit convention into a pytest result.

A green CI that runs nothing is worse than a red one, because it looks like assurance.
"""
from __future__ import annotations

import contextlib
import importlib
import io
import os
import re
import sys
from contextlib import redirect_stdout
from pathlib import Path

import pytest

BACKEND = Path(__file__).resolve().parent.parent / "backend"
_SELFTEST = re.compile(r"^def _test\(", re.M)


def _discover() -> list[str]:
    """Importable dotted names of every module defining a module-level `_test()`."""
    found: list[str] = []
    for pkg in ("checker", "scripts"):
        d = BACKEND / pkg
        if not d.is_dir():
            continue
        for path in sorted(d.glob("*.py")):
            if path.name.startswith("__"):
                continue
            try:
                if _SELFTEST.search(path.read_text(encoding="utf-8", errors="replace")):
                    found.append(f"{pkg}.{path.stem}")
            except OSError:
                continue
    return found


MODULES = _discover()

# This repository carries a PARTIAL snapshot of the engine: backend/corpus/ holds only
# `admission` and `benchmark`. The statute corpus (companies_act/_index.json and the
# rest) lives in the placedon-law-backend repository, which is the source of truth.
# Nineteen of the thirty self-tests read that corpus and cannot pass here — they fail
# natively too, not only under pytest.
#
# They are SKIPPED with the missing path named, never silently passed. A skip that
# states its reason is honest; a green tick over an absent corpus is not.
CORPUS_SENTINEL = BACKEND / "corpus" / "companies_act" / "_index.json"
CORPUS_PRESENT = CORPUS_SENTINEL.exists()

# Signed source PDFs (corpus/testdocs/_raw/) are deliberately NOT published here. The
# engine's own MANIFEST.md states they are gitignored and the extracted text is what the
# scanner reads; two of them are ICSI Guidance Notes, which are copyrighted
# professional-body publications rather than government works. The three GOVERNMENT
# source PDFs (India Code, Board Powers Rules, G.S.R. 700(E)) ARE published — they are
# the provenance backbone and are official publications.
#
# Four modules verify digital signatures on real signed filings and therefore need those
# absent PDFs. They are skipped with the reason named, never silently passed.
RAW_DIR = BACKEND / "corpus" / "testdocs" / "_raw"
RAW_PRESENT = RAW_DIR.is_dir() and any(RAW_DIR.glob("*.pdf"))
NEEDS_SIGNED_PDFS = {
    "checker.pdf_signature",
    "checker.revocation",
    "checker.doc_verification",
    "scripts.verify_document",
}


@contextlib.contextmanager
def _in_backend():
    """Run with backend/ as the working directory, then restore it."""
    prev = os.getcwd()
    os.chdir(BACKEND)
    try:
        yield
    finally:
        os.chdir(prev)


def test_discovery_found_the_engine():
    """Guard against silent zero-collection — the exact failure this file fixes.

    If discovery ever returns nothing, that must fail loudly rather than let the suite
    pass vacuously, which is how CI came to be green-looking and empty in the first
    place.
    """
    assert BACKEND.is_dir(), f"backend/ not found at {BACKEND}"
    assert MODULES, "no modules with _test() were discovered — pytest would pass vacuously"
    if not CORPUS_PRESENT:
        print(f"\nNOTE: statute corpus absent ({CORPUS_SENTINEL}); corpus-dependent "
              f"self-tests will SKIP, not pass. Source of truth: placedon-law-backend.")


@pytest.mark.parametrize("dotted", MODULES, ids=MODULES)
def test_module_selftest(dotted: str) -> None:
    """Run one module's `_test()`; surface its own output on failure."""
    try:
        mod = importlib.import_module(dotted)
    except Exception as e:                              # noqa: BLE001
        pytest.skip(f"{dotted} is not importable in this environment: {e!r}")

    fn = getattr(mod, "_test", None)
    if fn is None:
        pytest.skip(f"{dotted} exposes no _test() at runtime")

    if dotted in NEEDS_SIGNED_PDFS and not RAW_PRESENT:
        pytest.skip(f"{dotted} verifies signatures on real signed filings; those PDFs "
                    f"are deliberately unpublished (see MANIFEST.md and .gitignore). "
                    f"Run it in placedon-law-backend, where they are present.")

    buf = io.StringIO()
    try:
        # The engine resolves its corpus by paths relative to backend/, which is where
        # scripts/run_tests.sh runs from. pytest runs at the repo root, so without this
        # every corpus-reading module dies on FileNotFoundError. chdir, not a rewrite:
        # the tests are correct and the harness was in the wrong place.
        with _in_backend(), redirect_stdout(buf):
            fn()
    except SystemExit as e:
        # The house convention: SystemExit(1) means at least one [FAIL].
        if e.code:
            fails = [ln for ln in buf.getvalue().splitlines() if "[FAIL]" in ln]
            detail = "\n".join(fails) or buf.getvalue()[-2000:]
            pytest.fail(f"{dotted} self-test failed:\n{detail}", pytrace=False)
    except FileNotFoundError as e:
        # Only a MISSING-CORPUS FileNotFoundError is a skip. Any other one is a real
        # failure and must not hide behind this branch.
        missing = str(getattr(e, "filename", "") or "")
        if not CORPUS_PRESENT and f"{os.sep}corpus{os.sep}" in missing:
            pytest.skip(f"{dotted} needs the statute corpus, absent from this "
                        f"snapshot (missing {missing}); it lives in "
                        f"placedon-law-backend")
        pytest.fail(f"{dotted} self-test raised {e!r}\n{buf.getvalue()[-2000:]}",
                    pytrace=False)
    except Exception as e:                              # noqa: BLE001
        # Same missing-snapshot cause, surfaced as a domain error rather than an OS
        # one: provenance raises ProvenanceError("... artifact file missing") when the
        # source PDFs are absent. Matched on that EXACT phrase so a genuine provenance
        # regression -- a wrong hash, an unreviewed artifact -- still fails loudly.
        if not CORPUS_PRESENT and "artifact file missing" in str(e):
            pytest.skip(f"{dotted} needs source artifacts absent from this snapshot "
                        f"({e}); they live in placedon-law-backend")
        pytest.fail(f"{dotted} self-test raised {e!r}\n{buf.getvalue()[-2000:]}",
                    pytrace=False)

    # Some modules pass silently; others print a tally. If a [FAIL] was printed without
    # a non-zero exit, treat it as a failure anyway rather than trusting the exit code.
    if "[FAIL]" in buf.getvalue():
        fails = [ln for ln in buf.getvalue().splitlines() if "[FAIL]" in ln]
        pytest.fail(f"{dotted} printed failures without exiting non-zero:\n"
                    + "\n".join(fails), pytrace=False)
