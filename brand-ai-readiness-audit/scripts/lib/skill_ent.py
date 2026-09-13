"""SK-ENT entity-identity-audit — no search API."""

from __future__ import annotations

import json
import re
import time

from lib.confidence import attach_confidence
from lib.extract import parse_html
from lib.findings import make_finding
from lib.http import HttpClient, HttpError
from lib.models import CrawlSnapshot, Entity, SkillResult, SuggestedAction

COMMON = {
    "united", "national", "pacific", "summit", "apex", "unity", "pioneer", "atlas",
    "horizon", "gateway", "metro", "first", "standard", "general", "american",
}


def run(snapshot: CrawlSnapshot, client: HttpClient | None = None, fetch_sameas: bool = False) -> SkillResult:
    t0 = time.time()
    findings = []
    home = next((p for p in snapshot.fetched_pages() if p.page_type in ("home", "about")), None)
    if not home:
        home = snapshot.fetched_pages()[0] if snapshot.fetched_pages() else None
    if not home:
        return SkillResult("entity-identity-audit", snapshot.run_id, status="partial", timing_ms=(time.time() - t0) * 1000)
    parsed = parse_html(home.raw_html, home.url)
    name = parsed["title"].split("|")[0].split("–")[0].strip() or re.sub(r"https?://(www\.)?", "", home.url).split("/")[0]
    token = re.sub(r"[^a-z]", "", name.lower())[:12]
    risk = "low"
    evidence = []
    # Collision risk is a closed class of generic English tokens, not short distinctive names.
    if token in COMMON:
        risk = "medium"
        evidence.append(f"short/common-looking name {name!r}")
    elif name.isupper() and 2 <= len(re.sub(r"[^A-Za-z]", "", name)) <= 6 and len(name.split()) == 1:
        # ALL-CAPS short token is an acronym shape, not a dictionary collision.
        risk = "low"
    dis = bool(re.search(r"\bwe are a\b|\bis an? [a-z][a-z0-9- ]{2,40}\b(?:in|based)\b", parsed["main_text"], re.I))
    disambiguators = {"category": "", "geo": ""}
    # Extract structured disambiguators if available in Organization JSON-LD
    for raw_ld in parsed.get("json_ld", []):
        try:
            ld = json.loads(raw_ld) if isinstance(raw_ld, str) else raw_ld
            nodes = [ld] if isinstance(ld, dict) else ld if isinstance(ld, list) else []
            for n in nodes:
                if isinstance(n, dict) and n.get("@type") in ("Organization", "Corporation", "LocalBusiness", "NGO"):
                    if n.get("address"):
                        addr = n["address"]
                        geo_val = addr.get("addressCountry") or addr.get("addressLocality") if isinstance(addr, dict) else str(addr)
                        if geo_val:
                            disambiguators["geo"] = str(geo_val)
                    if n.get("description") or n.get("disambiguatingDescription"):
                        disambiguators["category"] = str(n.get("disambiguatingDescription") or n.get("description"))[:60]
        except Exception:
            pass
    if disambiguators["geo"] or disambiguators["category"]:
        dis = True
    else:
        # Check meta description / og:description for category marker (substantial summary is a passive disambiguator)
        meta_desc = ""
        for tag in re.findall(r'<meta[^>]+(?:name=["\']description["\']|property=["\']og:description["\'])[^>]+content=["\']([^"\']+)', home.raw_html, re.I):
            meta_desc = tag
            break
        if not meta_desc:
            for tag in re.findall(r'<meta[^>]+content=["\']([^"\']+)[^>]+(?:name=["\']description["\']|property=["\']og:description["\'])', home.raw_html, re.I):
                meta_desc = tag
                break
        if meta_desc and len(meta_desc.strip()) >= 20:
            dis = True
            disambiguators["category"] = meta_desc.strip()[:60]

    same = parsed["same_as"]
    ent = Entity(name=name, same_as=same, collision_risk=risk, collision_evidence=evidence, disambiguators=disambiguators)
    snapshot.entities = [ent]
    if risk != "low" and not dis:
        f = make_finding(
            skill_id="entity-identity-audit",
            finding_type="collision_risk",
            title="Brand name looks collision-prone and pages lack an early category/geo disambiguator",
            severity="high",
            evidence="; ".join(evidence) + f"; no 'we are a {{category}}' sentence on {home.url}. No web search was used.",
            action=SuggestedAction(
                summary='Add an early sentence of the form “{Brand} is a {category} in {geo}.”',
                where=home.url,
                why="Entity-resolution mix-ups; absence of an external knowledge-base entry is not a defect.",
            ),
            urls=[home.url],
            category="entity",
            confidence="low",
        )
        attach_confidence(f, deterministic=False, reproduced=False)
        f.confidence = "low"
        f.confidence_basis = "on-page heuristic only; no search API"
        findings.append(f)
    if fetch_sameas and client:
        for u in same[:5]:
            try:
                r = client.request(u, method="HEAD")
                if r.status == 404:
                    f = make_finding(
                        skill_id="entity-identity-audit",
                        finding_type="sameas_404",
                        title="Organization sameAs URL returns 404",
                        severity="medium",
                        evidence=f"{u} status=404",
                        action=SuggestedAction(summary="Fix or remove dead sameAs URLs."),
                        urls=[home.url, u],
                        category="entity",
                    )
                    findings.append(f)
            except HttpError:
                pass
    return SkillResult("entity-identity-audit", snapshot.run_id, findings=findings, metrics={"entity": name, "collision_risk": risk}, timing_ms=(time.time() - t0) * 1000)
