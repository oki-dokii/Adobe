#!/usr/bin/env python3
"""Thin skill wrapper; implementation lives in scripts/lib."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts"))


def _main(skill: str) -> int:
    from lib.skill_cli import main
    return main(skill)


if __name__ == "__main__":
    raise SystemExit(_main(Path(__file__).resolve().parents[1].name))
