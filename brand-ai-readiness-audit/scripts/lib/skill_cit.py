"""SK-CIT citation-extractability-audit (deterministic; LLM skipped under skip-ladder)."""

from __future__ import annotations

import json
import re
import time

from lib.confidence import attach_confidence
from lib.extract import PRICE_RE, parse_html
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.money import has_offer_price, iter_offer_prices, offer_price_strings

QUALIFIER = re.compile(r"(then|after|intro|first\s+\d+|per month|billed|excluding|unless|starting)", re.I)
VAGUE = re.compile(r"\b(world-class|best-in-class|cutting-edge|next-gen|synergy|leverage)\b", re.I)
WIN = re.compile(r"[✔✓]|yes|included", re.I)
LOSE = re.compile(r"[✖✗]|no\b|—")


def run(snapshot: CrawlSnapshot, allow_llm: bool = False) -> SkillResult:
    t0 = time.time()
    findings = []
    claims = []
    factual = {"pricing", "product", "about", "home", "contact"}
    for p in snapshot.fetched_pages():
        if p.page_type not in factual and "faq" not in p.url.lower():
            # mission-page voice TN: skip other
            continue
        if not p.extractability_flags.in_raw:
            continue  # parent D owns JS-lock
        parsed = parse_html(p.raw_html, p.url)
        text = parsed["main_text"]
        # Qualifier split: price without qualifier nearby
        for m in iter_offer_prices(text, page_type=p.page_type):
            start = max(0, m.start() - 80)
            end = min(len(text), m.end() + 80)
            window = text[max(0, m.start() - 24) : min(len(text), m.end() + 24)]
            rest = text[m.end() : m.end() + 500]
            claims.append({"text": m.group(), "url": p.url, "page_id": p.id})
            if not QUALIFIER.search(window) and QUALIFIER.search(rest):
                f = make_finding(
                    skill_id="citation-extractability-audit",
                    finding_type="qualifier_split",
                    title="Price amount is separated from its qualifying condition",
                    severity="critical" if p.page_type in ("pricing", "product") else "high",
                    evidence=f"Isolated '{m.group()}' vs later qualifier in {window[:120]}… / later span on {p.url}",
                    action=SuggestedAction(
                        summary="Put the amount and its condition in one self-contained sentence.",
                        where=p.url,
                        what="Self-contained price sentence",
                        why="RAG windows can cite the amount without the condition.",
                    ),
                    urls=[p.url],
                    template_id=p.template_id,
                    category="citation",
                )
                f.materiality = "pass"
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)
        for tbl in parsed["tables"]:
            if not tbl.get("has_th"):
                f = make_finding(
                    skill_id="citation-extractability-audit",
                    finding_type="table_no_th",
                    title="Data table lacks header cells",
                    severity="medium",
                    evidence=f"table has_th=false on {p.url}",
                    action=SuggestedAction(summary="Add <th> or scope attributes so cells keep units/labels."),
                    urls=[p.url],
                    template_id=p.template_id,
                    category="citation",
                )
                attach_confidence(f, deterministic=True, reproduced=True)
                findings.append(f)
        # schema vs visible
        vis_prices = {re.sub(r"[^\d.]", "", x) for x in offer_price_strings(text, page_type=p.page_type)}
        for obj in parsed["json_ld"]:
            dumped = json.dumps(obj)
            sm = PRICE_RE.search(dumped) or re.search(r'"price"\s*:\s*"?([\d.]+)"?', dumped)
            if sm:
                sp = re.sub(r"[^\d.]", "", sm.group(1) if sm.lastindex else sm.group())
                if vis_prices and sp and sp not in vis_prices and not any(sp in v or v in sp for v in vis_prices if v):
                    f = make_finding(
                        skill_id="citation-extractability-audit",
                        finding_type="schema_visible_mismatch",
                        title="JSON-LD price does not match visible text",
                        severity="medium",
                        evidence=f"schema={sm.group()} visible={list(vis_prices)[:4]} on {p.url}",
                        action=SuggestedAction(
                            summary="Make structured data match visible prices, or remove the mismatched markup.",
                            where=p.url,
                            why="Google quality guidelines: markup must not contradict visible content. This is not a 'missing schema' finding.",
                        ),
                        urls=[p.url],
                        category="citation",
                        evidence_tier="FACT",
                    )
                    attach_confidence(f, deterministic=True, reproduced=False)
                    findings.append(f)
        # W-03 comparison self-win on first-party vs pages
        if re.search(r"\bvs\.?\b|compar", p.url + p.title, re.I):
            ticks = len(WIN.findall(text))
            crosses = len(LOSE.findall(text))
            if ticks >= 5 and crosses >= 3 and ticks / max(ticks + crosses, 1) > 0.85:
                f = make_finding(
                    skill_id="citation-extractability-audit",
                    finding_type="comparison_self_win",
                    title="First-party comparison table strongly favors the host on nearly every row",
                    severity="low",
                    evidence=f"win-like tokens={ticks} lose-like={crosses} on {p.url}",
                    action=SuggestedAction(
                        summary="Disclose vendor authorship near the comparison table (do not fake balanced rows).",
                        where=p.url,
                        proactive=True,
                    ),
                    urls=[p.url],
                    category="citation",
                )
                findings.append(f)
        # Vague on factual templates only — skip mission-only if no numbers
        if p.page_type == "about" and not has_offer_price(text, page_type=p.page_type) and VAGUE.search(text):
            pass  # TN mission voice
    snapshot.claims.extend(claims)
    return SkillResult("citation-extractability-audit", snapshot.run_id, findings=findings, metrics={"claims": len(claims), "llm": allow_llm}, timing_ms=(time.time() - t0) * 1000)
