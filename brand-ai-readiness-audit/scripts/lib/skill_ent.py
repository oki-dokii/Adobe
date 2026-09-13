"""SK-ENT entity-identity-audit — no search API."""

from __future__ import annotations

import json
import re
import time

from lib.confidence import attach_confidence
from lib.extract import parse_html
from lib.findings import make_finding
from lib.http_client import HttpClient, HttpError
from lib.models import CrawlSnapshot, Entity, SkillResult, SuggestedAction

COMMON = {
    "united", "national", "pacific", "summit", "apex", "unity", "pioneer", "atlas",
    "horizon", "gateway", "metro", "first", "standard", "general", "american",
}

# Research F17/F18: relationship-declaring language that connects a product page to its brand
_BRAND_REL_PAT = re.compile(
    r"\b(?:a product (?:by|of|from)|made by|manufactured by|created by|developed by|by |from )\b",
    re.I,
)


def _check_product_brand_relationship(
    brand_name: str,
    snapshot: CrawlSnapshot,
) -> list:
    """F17/F18: flag product pages whose title differs from brand and lack relationship language."""
    hits = []
    brand_token = re.sub(r"[^a-z0-9]", "", brand_name.lower())[:20]
    if not brand_token or len(brand_token) < 3:
        return hits
    for p in snapshot.fetched_pages():
        if p.page_type in ("home", "about", "legal", "contact"):
            continue
        page_title = (p.title or "").split("|")[0].split("\u2013")[0].strip()
        page_token = re.sub(r"[^a-z0-9]", "", page_title.lower())[:20]
        # Only flag if page title is clearly distinct from brand
        if not page_token or page_token == brand_token or brand_token in page_token:
            continue
        text = p.main_text or ""
        # Check if brand name appears in the page text (implicit relationship)
        brand_in_text = brand_name.lower() in text.lower()
        # Check if explicit relationship language is present
        has_rel_language = bool(_BRAND_REL_PAT.search(text))
        if not brand_in_text and not has_rel_language:
            hits.append(p)
    return hits


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
                summary=f'Add an early sentence of the form “{name} is a {{category}} in {{geo}}.”',
                what=f'Explicit category and geographic disambiguator for {name}',
                where=home.url,
                how=f'Add an opening tagline or JSON-LD: <script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"{name}","disambiguatingDescription":"[Category] based in [City, Region]"}}</script>',
                why="Entity-resolution mix-ups; absence of an external knowledge-base entry is not a defect.",
                cost_tier="content",
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

    # Gap 4 (Research F17/F18): product/brand relationship check
    product_pages_missing_rel = _check_product_brand_relationship(name, snapshot)
    for pp in product_pages_missing_rel[:3]:  # cap to 3 findings
        f = make_finding(
            skill_id="entity-identity-audit",
            finding_type="product_brand_gap",
            title="Product page does not declare its brand/manufacturer in visible text",
            severity="medium",
            evidence=(
                f"Page title '{pp.title}' differs from brand '{name}' and page text contains "
                f"neither the brand name nor relationship language ('made by', 'a product of', 'by [Brand]'). "
                f"URL: {pp.url}"
            ),
            action=SuggestedAction(
                summary=f"Add a visible statement such as '{pp.title} is a product by {name}.' near the top of the page.",
                what=f"Brand-product relationship declaration for {pp.title}",
                where=pp.url,
                how=f"Add prose or JSON-LD 'brand' field: '{{\"@type\":\"Product\",\"name\":\"{pp.title}\",\"brand\":\"{{\"@type\":\"Brand\",\"name\":\"{name}\"}}\"}}' "
                    f"or add a plain-text line '{pp.title} is made by {name}.' near the page heading.",
                why="F17/F18: AI systems resolving product queries may not connect the product to its brand without explicit relationship language; "
                    "entity-collision risk is higher for product names than for branded domains.",
                cost_tier="content",
            ),
            urls=[pp.url, home.url],
            category="entity",
            confidence="low",
        )
        attach_confidence(f, deterministic=True, reproduced=False)
        f.confidence = "low"
        f.confidence_basis = "on-page heuristic only; title vs brand-name mismatch with no relationship language detected"
        findings.append(f)

    return SkillResult("entity-identity-audit", snapshot.run_id, findings=findings, metrics={"entity": name, "collision_risk": risk}, timing_ms=(time.time() - t0) * 1000)
