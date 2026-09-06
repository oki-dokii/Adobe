"""SK-I freshness + on-site typed fact conflicts."""

from __future__ import annotations

import time
from collections import defaultdict

from lib.confidence import attach_confidence
from lib.facts import extract_facts, material
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    findings = []
    facts = extract_facts(snapshot.fetched_pages())
    snapshot.facts = facts
    docs = snapshot.site_type.cluster == "D" or "D" in snapshot.site_type.secondary

    for p in snapshot.fetched_pages():
        vis = p.dates.get("visible") or []
        schema = p.dates.get("schema") or []
        if schema and vis and not docs:
            # crude: schema year vs visible year mismatch
            sy = [x[:4] for x in schema if len(x) >= 4]
            if sy and vis and sy[0] not in vis and p.page_type not in ("article",):
                f = make_finding(
                    skill_id="freshness-audit",
                    finding_type="date_divergence",
                    title="Date signals disagree across visible text and metadata",
                    severity="medium",
                    evidence=f"visible years={vis[:4]} schema={schema[:3]} on {p.url}",
                    action=SuggestedAction(
                        summary="Align dateModified/visible dates or drop fake update stamps.",
                        where=p.url,
                        why="Staleness is about fact change, not age-only (U7).",
                    ),
                    urls=[p.url],
                    category="freshness",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)

    by_type: dict[str, list] = defaultdict(list)
    for fact in facts:
        if material(fact):
            by_type[fact.type].append(fact)
    for typ, group in by_type.items():
        vals = {(g.value, g.url) for g in group}
        uniq = {v for v, _ in vals}
        if len(uniq) >= 2 and typ == "price":
            years = []
            urls = [g.url for g in group]
            pages = [snapshot.page_by_url(u) for u in urls]
            for pg in pages:
                if pg:
                    years.extend(pg.dates.get("visible") or [])
            f = make_finding(
                skill_id="freshness-audit",
                finding_type="on_site_fact_conflict",
                title="On-site typed facts disagree (prices)",
                severity="high",
                evidence=f"values={sorted(uniq)[:6]} urls={urls[:4]}",
                action=SuggestedAction(
                    summary="Reconcile current prices and mark superseded pages (e.g. old press) as historical.",
                    why="Internal knowledge conflict; this is not an off-site corroboration finding.",
                ),
                urls=urls[:5],
                category="freshness",
            )
            attach_confidence(f, deterministic=True, reproduced=len(urls) >= 2)
            findings.append(f)
    return SkillResult("freshness-audit", snapshot.run_id, findings=findings, metrics={"facts": len(facts)}, timing_ms=(time.time() - t0) * 1000)
