"""Make the engine importable to pytest without moving any of it.

The engine lives in `backend/` and its modules import each other as `checker.x`, so
`backend/` must be on the path. Doing this in a root conftest keeps the engine's own
layout untouched — CI adapts to the code, not the other way round.
"""
import sys
from pathlib import Path

BACKEND = Path(__file__).parent / "backend"
if BACKEND.is_dir():
    sys.path.insert(0, str(BACKEND))
