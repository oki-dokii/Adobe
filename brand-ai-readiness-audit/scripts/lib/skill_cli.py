"""CLI adapter for marketplace skills.

Orchestrated use supplies the shared CrawlSnapshot.  Standalone use accepts one
public URL and creates a deliberately bounded, robots-respecting snapshot so a
skill folder remains independently runnable without pretending it shares work.
"""
from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path

from lib.clock import Clock
from lib.crawl import crawl
from lib.http_client import HttpClient
from lib.skill_c import run as run_c
from lib.skill_cit import run as run_cit
from lib.skill_d import run as run_d
from lib.skill_ent import run as run_ent
from lib.skill_h import run as run_h
from lib.skill_i import run as run_i
from lib.skill_k import run as run_k
from lib.skill_v import run as run_v
from lib.skill_x import run as run_x

RUNNERS = {
    "crawl-access-audit": run_c, "render-extract-audit": run_d,
    "citation-extractability-audit": run_cit, "entity-identity-audit": run_ent,
    "freshness-audit": run_i, "ai-answerability-audit": run_k,
    "corroboration-consistency-audit": run_h, "engagement-handoff-audit": run_x,
    "site-type-classifier": run_v,
}

def main(skill_id: str) -> int:
    p = argparse.ArgumentParser(description=f"Run {skill_id} from a shared snapshot or one public URL")
    source = p.add_mutually_exclusive_group(required=True)
    source.add_argument("--snapshot", help="Trusted local CrawlSnapshot pickle created by audit-orchestrator")
    source.add_argument("--url", help="Public http(s) URL for an independent bounded crawl")
    p.add_argument("--max-seconds", type=float, default=90.0)
    p.add_argument("--page-cap", type=int, default=10)
    p.add_argument("--render-max", type=int, default=10)
    args = p.parse_args()
    http = None
    if args.snapshot:
        with Path(args.snapshot).open("rb") as fh:
            snapshot = pickle.load(fh)
    else:
        http = HttpClient()
        snapshot = crawl(args.url, http, Clock.start_run(args.max_seconds), page_cap=args.page_cap, render_max=args.render_max)
    if skill_id not in RUNNERS:
        print(json.dumps({"skill_id": skill_id, "status": "unsupported", "findings": []}))
        return 2
    # Standalone linked checks use the same bounded client as their independent
    # crawl; snapshot mode remains read-only and never silently makes extra GETs.
    if skill_id == "entity-identity-audit":
        result = run_ent(snapshot, client=http, fetch_sameas=bool(http))
    elif skill_id == "corroboration-consistency-audit":
        result = run_h(snapshot, client=http)
    else:
        # Standalone dependent skills prepare their required upstream state from
        # this one bounded snapshot; they never start a second crawl.
        if skill_id in {"ai-answerability-audit"}:
            run_v(snapshot)
            run_d(snapshot)
        elif skill_id in {"citation-extractability-audit"}:
            run_d(snapshot)
        result = RUNNERS[skill_id](snapshot)
    print(json.dumps(result.to_dict(), default=str))
    return 0
