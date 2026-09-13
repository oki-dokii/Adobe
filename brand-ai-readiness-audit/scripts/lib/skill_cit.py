"""SK-CIT citation-extractability-audit (deterministic; LLM skipped under skip-ladder)."""

from __future__ import annotations

import re
import time

from lib.confidence import attach_confidence
from lib.extract import parse_html
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.money import has_offer_price, iter_offer_prices, offer_price_strings

# Local condition = same sentence / rate formula / preposition, not a merchant-specific lexicon.
QUALIFIER = re.compile(
    r"(?:"
    r"\bthen\b|\bafter\b|\bintro\b|first\s+\d+"
    r"|per\s+\w+"
    r"|/\s*(?:mo|yr|wk|hr|user|seat|agent|dev|member|device|domain|gb|tb|unit|txn|request)"
    r"|\bbilled\b|\bunless\b|\bstarting\b|\bstarting\s+at\b|\bstarting\s+from\b"
    r"|\b(?:plus|excluding|including|excl\.?|incl\.?)\s*(?:vat|tax|taxes|gst|duty|duties)?"
    r"|\bfor\s+\w+"
    r")",
    re.I,
)
_WS = re.compile(r"[\s\u00a0\u202f\u2007\u2009]+")
_RATE_PREFIX = re.compile(r"%\s*\+\s*[A-Za-z]{0,3}$")
VAGUE = re.compile(r"\b(world-class|best-in-class|cutting-edge|next-gen|synergy|leverage)\b", re.I)
WIN = re.compile(r"[✔✓]|yes|included", re.I)
LOSE = re.compile(r"[✖✗]|no\b|—")


def _iter_ld_nodes(obj):
    if isinstance(obj, dict):
        yield obj
        for v in obj.values():
            yield from _iter_ld_nodes(v)
    elif isinstance(obj, list):
        for x in obj:
            yield from _iter_ld_nodes(x)


def _ld_price_tokens(obj) -> list[str]:
    out: list[str] = []
    for node in _iter_ld_nodes(obj):
        for key in ("price", "lowPrice", "highPrice"):
            if key in node and node[key] not in (None, ""):
                tok = re.sub(r"[^\d.]", "", str(node[key]))
                if tok:
                    out.append(tok)
    return out


def _fold(s: str) -> str:
    return _WS.sub(" ", s or "")


def _next_price_start(text: str, after: int, page_type: str) -> int:
    nxt = None
    for m in iter_offer_prices(text, page_type=page_type):
        if m.start() >= after:
            nxt = m.start()
            break
    return nxt if nxt is not None else len(text)


def _containing_sentence(text: str, start: int, end: int) -> str:
    left = start
    while left > 0 and text[left - 1] not in ".?!\n":
        left -= 1
    right = end
    while right < len(text) and text[right] not in ".?!\n":
        right += 1
    return text[left:right]


def amount_is_isolated(text: str, start: int, end: int, *, page_type: str = "") -> bool:
    """True when a later sentence holds the condition and this span does not."""
    local = _fold(_containing_sentence(text, start, end))
    if len(local) < 12:
        local = _fold(text[max(0, start - 48) : min(len(text), end + 48)])
    prefix = _fold(text[max(0, start - 16) : start])
    if _RATE_PREFIX.search(prefix) or QUALIFIER.search(local):
        return False
    stop = _next_price_start(text, end + 1, page_type)
    later = _fold(text[end:stop])[:220]
    return bool(QUALIFIER.search(later))


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
        offer_spans = list(iter_offer_prices(text, page_type=p.page_type))
        dense_rate_card = p.page_type == "pricing" and len(offer_spans) >= 4
        # Qualifier split: amount isolated from its own later condition (not a rate table).
        splits_here = 0
        for m in offer_spans:
            window = text[max(0, m.start() - 40) : min(len(text), m.end() + 40)]
            claims.append({"text": m.group(), "url": p.url, "page_id": p.id})
            if dense_rate_card or not amount_is_isolated(text, m.start(), m.end(), page_type=p.page_type):
                continue
            if splits_here >= 2:
                break
            splits_here += 1
            f = make_finding(
                skill_id="citation-extractability-audit",
                finding_type="qualifier_split",
                title="Price amount is separated from its qualifying condition",
                # A split is an extractability risk, not proof of a business-critical
                # defect.  Pricing pages commonly contain legitimate regional,
                # billing, tax, fee, and introductory qualifiers.  Critical is
                # reserved for corroborated decision failures after admission;
                # this detector alone cannot establish that.
                severity="high",
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
            f.metrics["price_semantic_class"] = "purchasable_offer"
            f.metrics["severity_cap_reason"] = "qualifier_split_is_heuristic_extractability_evidence"
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
                    action=SuggestedAction(
                        summary="Add <th> or scope attributes so cells keep units/labels.",
                        what="Semantic <th> elements with scope attributes",
                        where=p.url,
                        how="Replace the first <tr> row with: <thead><tr><th scope='col'>Header1</th><th scope='col'>Header2</th></tr></thead> to preserve column-to-value association for LLM extractors.",
                        why="LLMs parse tables row-by-row; without explicit headers, numerical facts and plan features lose their semantic labels in retrieval chunks.",
                        cost_tier="markup",
                    ),
                    urls=[p.url],
                    template_id=p.template_id,
                    category="citation",
                )
                attach_confidence(f, deterministic=True, reproduced=True)
                findings.append(f)
        # schema vs visible (walk nested Offer/Product; never flag missing schema)
        vis_prices = {re.sub(r"[^\d.]", "", x) for x in offer_price_strings(text, page_type=p.page_type)}
        schema_prices: list[str] = []
        for obj in parsed["json_ld"]:
            schema_prices.extend(_ld_price_tokens(obj))
        schema_prices = [sp for sp in schema_prices if sp]
        if vis_prices and schema_prices:
            if not any(sp in vis_prices or any(sp in v or v in sp for v in vis_prices if v) for sp in schema_prices):
                f = make_finding(
                    skill_id="citation-extractability-audit",
                    finding_type="schema_visible_mismatch",
                    title="JSON-LD price does not match visible text",
                    severity="medium",
                    evidence=f"schema={schema_prices[:4]} visible={list(vis_prices)[:4]} on {p.url}",
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
