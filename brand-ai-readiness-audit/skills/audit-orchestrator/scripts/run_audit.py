#!/usr/bin/env python3
"""audit-orchestrator CLI."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.orchestrator import main  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main())
