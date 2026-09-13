"""SK-V site-type-classifier — deterministic multi-label (LLM only if votes conflict; v1: no LLM)."""

from __future__ import annotations

import re
import time

from lib.confidence import attach_confidence
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SiteType, SkillResult, SuggestedAction

YMYL_ADVICE = re.compile(
    r"\b(?:medical|clinic|diagnosis|diagnosed|physician|prescriptions?|"
    r"legal advice|attorney|malpractice)\b",
    re.I,
)
SAAS_TERMS = ("saas", "subscription", "workspace", "platform", "api", "cloud", "login", "pricing", "sign up", "signup", "developer platform", "infrastructure")
ECOM_TERMS = ("add to cart", "add-to-cart", "sku", "checkout", "free shipping", "add to bag", "add-to-bag", "shopping bag", "express delivery")
DOCS_TERMS = ("documentation", "/docs", "api reference", "changelog", "version")
NEWS_TERMS = ("subscribe to newsletter", "opinion", "byline", "published")
DIR_TERMS = ("nonprofit", "donate", "directory", "listings", "chamber")
GOV = (".gov",)
EDU = (".edu",)


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    votes: dict[str, int] = {c: 0 for c in "ABCDEF"}
    blob = " ".join(
        f"{p.url} {p.title} {p.main_text[:800]}" for p in snapshot.fetched_pages()[:8]
    ).lower()
    host = snapshot.seed_url.lower()
    ymyl_advice = bool(YMYL_ADVICE.search(blob))
    if ymyl_advice:
        votes["A"] += 3
    if any(t in blob for t in DIR_TERMS) or "marketplace" in blob:
        votes["B"] += 2
    if any(h in host for h in GOV + EDU):
        votes["C"] += 3
        if "bookstore" in blob or "shop." in host:
            votes["B"] += 1  # hybrid shop
    if any(t in blob for t in DOCS_TERMS):
        votes["D"] += 2
    if any(t in blob for t in NEWS_TERMS) or "/blog" in blob or "/news" in blob:
        votes["E"] += 2
    saas_matches = sum(1 for t in SAAS_TERMS if t in blob)
    if saas_matches >= 2:
        votes["F"] += 3
    elif saas_matches == 1:
        votes["F"] += 2
    if any(t in blob for t in ECOM_TERMS):
        votes["F"] += 3

    # Structured schema detection from JSON-LD
    schema_types: set[str] = set()
    for p in snapshot.fetched_pages()[:8]:
        for raw_ld in getattr(p, "json_ld", []):
            try:
                import json
                ld = json.loads(raw_ld) if isinstance(raw_ld, str) else raw_ld
                nodes = [ld] if isinstance(ld, dict) else ld if isinstance(ld, list) else []
                for n in nodes:
                    if isinstance(n, dict):
                        t = str(n.get("@type", ""))
                        if t:
                            schema_types.add(t.lower())
            except Exception:
                pass

    if any(t in schema_types for t in ("softwareapplication", "webapplication", "saas")):
        votes["F"] += 3
    if any(t in schema_types for t in ("product", "offer", "store", "itemavailability")):
        votes["F"] += 3
    if any(t in schema_types for t in ("newsarticle", "reportagepost")):
        votes["E"] += 3
    if any(t in schema_types for t in ("techarticle", "apiarticle")):
        votes["D"] += 3
    if any(t in schema_types for t in ("medicalwebpage", "medicalcondition")):
        votes["A"] += 3
        ymyl_advice = True
    if any(t in schema_types for t in ("governmentorganization", "publicinstitution")):
        votes["C"] += 3

    ranked = sorted(votes.items(), key=lambda kv: -kv[1])
    primary = ranked[0][0] if ranked[0][1] > 0 else "unknown"
    secondary = [c for c, n in ranked[1:] if n > 0]
    ymyl = ymyl_advice and not (saas_matches >= 2)
    ecom = any(t in blob for t in ECOM_TERMS) or any(t in schema_types for t in ("product", "offer", "store"))
    saas = (votes["F"] > 0 and any(t in blob for t in SAAS_TERMS) and not ecom) or any(t in schema_types for t in ("softwareapplication", "webapplication"))
    st = SiteType(
        cluster=primary,
        secondary=secondary,
        ymyl=ymyl,
        multilingual="hreflang" in blob or "lang=" in blob,
        product_like=ecom or "/product" in blob or saas,
        ecommerce=ecom,
        saas=saas and not ecom,
        confidence="high" if ranked[0][1] >= 3 else "medium" if ranked[0][1] else "low",
        votes=votes,
    )
    snapshot.site_type = st
    findings = []
    if ymyl and primary == "A":
        disclosed = bool(
            re.search(r"(?<!no )reviewed by|\bmedical reviewer\b|\blicensed\b|\bnpi\b", blob)
        )
        if not disclosed:
            f = make_finding(
                skill_id="site-type-classifier",
                finding_type="ymy_disclosure",
                title="YMYL pages lack a named reviewer or license disclosure",
                severity="high",
                evidence="Advice lexicon matched; sampled pages have no 'reviewed by' / license strings.",
                action=SuggestedAction(
                    summary="Add a named reviewer, license, and jurisdiction in visible text on advice pages.",
                    priority="high",
                    what="Visible reviewer/license/jurisdiction",
                    where="YMYL topic pages",
                    how="Plain text near the advice, not only in footer chrome.",
                    why="YMYL harm and mix-up risk; hedges remain appropriate.",
                ),
                urls=[p.url for p in snapshot.fetched_pages()[:3]],
                category="site_type",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            findings.append(f)
    return SkillResult(
        skill_id="site-type-classifier",
        run_id=snapshot.run_id,
        findings=findings,
        metrics={"site_type": st.__dict__},
        timing_ms=(time.time() - t0) * 1000,
        deadline_honored=True,
    )
