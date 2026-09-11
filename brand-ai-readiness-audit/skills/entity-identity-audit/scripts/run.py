#!/usr/bin/env python3
"""Thin skill wrapper; implementation lives in scripts/lib."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts"))


def _main(skill: str) -> int:
    print(json.dumps({"skill": skill, "note": "Invoke via audit-orchestrator; skills consume a crawl snapshot."}))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(Path(__file__).resolve().parents[1].name))
