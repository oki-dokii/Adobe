#!/usr/bin/env python3
"""Annotate canonical findings with existing business-impact presentation data."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts"))
from lib.business_impact import annotate
from lib.models import Finding, SuggestedAction

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--findings-json", required=True)
    p.add_argument("--sampled-pages", type=int, required=True)
    a = p.parse_args()
    raw = json.loads(Path(a.findings_json).read_text())
    findings = [Finding(id=x["id"], title=x["title"], severity=x["severity"], evidence=x["evidence"],
        suggested_action=SuggestedAction(**x["suggested_action"]), skill_id=x.get("skill_id", ""),
        finding_type=x["finding_type"], finding_key=x["finding_key"], confidence=x.get("confidence", "low"),
        affected_pages_count=x.get("affected_pages_count", 1), metrics=x.get("metrics", {})) for x in raw]
    print(json.dumps(annotate(findings, a.sampled_pages)))
    return 0
if __name__ == "__main__": raise SystemExit(main())
