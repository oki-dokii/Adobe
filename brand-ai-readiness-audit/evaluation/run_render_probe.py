"""Compare raw HTML vs production noscript/template dual-fetch on live origins."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "evaluation"))

from lib.extract import PRICE_RE, parse_html  # noqa: E402
from lib.http import HttpClient  # noqa: E402
from lib.render import expand_noscript  # noqa: E402
from lib.robots import fetch_robots  # noqa: E402
from safety_preflight import assert_production_safety  # noqa: E402


def probe(url: str) -> dict:
    client = HttpClient()
    pol = fetch_robots(client, url)
    if pol.status == "fail_closed" or not pol.allows("BrandAIReadinessAudit/1.0", url):
        return {"url": url, "skipped": True, "reason": f"robots {pol.status}"}
    resp = client.request(url, method="GET")
    raw = resp.body.decode("utf-8", errors="replace")
    expanded = expand_noscript(raw)
    pr = parse_html(raw, resp.final_url)
    pe = parse_html(expanded, resp.final_url)
    raw_prices = PRICE_RE.findall(pr["main_text"] or "")
    exp_prices = PRICE_RE.findall(pe["main_text"] or "")
    return {
        "url": url,
        "final_url": resp.final_url,
        "status": resp.status,
        "redirect_hops": resp.redirect_hops,
        "skipped": False,
        "raw_bytes": len(resp.body),
        "raw_text_chars": len(pr["main_text"] or ""),
        "expanded_text_chars": len(pe["main_text"] or ""),
        "delta_chars": len(pe["main_text"] or "") - len(pr["main_text"] or ""),
        "raw_prices": raw_prices[:12],
        "expanded_prices": exp_prices[:12],
        "noscript_text": (pr.get("noscript_text") or [])[:8],
        "closed_details_sample": " ".join(pr.get("closed_details_text") or [])[:400],
        "title": pr.get("title"),
        "robots_status": pol.status,
    }


def main() -> int:
    assert_production_safety()
    cfg_path = ROOT / "evaluation" / "sites.yaml"
    text = cfg_path.read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore

        cfg = yaml.safe_load(text)
        sites = cfg["sites"]
    except ImportError:
        from run_evaluation import _simple_sites_yaml

        sites = _simple_sites_yaml(text)["sites"]
    targets = [s for s in sites if s.get("enabled") and s.get("url")]
    out = []
    for s in targets:
        print("probe", s["id"], s["url"], flush=True)
        try:
            row = probe(s["url"])
            row["id"] = s["id"]
            row["site_type"] = s.get("site_type")
            out.append(row)
        except Exception as e:
            out.append({"id": s["id"], "url": s["url"], "error": f"{type(e).__name__}: {e}"})
    payload = {"generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "probes": out}
    dest = ROOT / "evaluation" / "results" / "render_probe.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")
    print("Wrote", dest)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
