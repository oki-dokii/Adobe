"""Typed facts + compare_claim_against_source (P order)."""

from __future__ import annotations

import re
from typing import Any, Optional

from lib.extract import PRICE_RE
from lib.models import Fact, Page
from lib.money import iter_offer_prices

NUM = re.compile(r"[\d,.]+")


def extract_facts(pages: list[Page]) -> list[Fact]:
    facts: list[Fact] = []
    n = 0
    for p in pages:
        if p.unfetched:
            continue
        text = p.main_text or ""
        for m in iter_offer_prices(text, page_type=p.page_type):
            n += 1
            facts.append(
                Fact(
                    id=f"fact-{n}",
                    type="price",
                    value=_norm_num(m.group()),
                    url=p.final_url or p.url,
                    span=m.group(),
                    freshness_sensitive=True,
                    page_ids=[p.id],
                )
            )
        for pat, typ in (
            (r"\bCEO\b[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)", "leader"),
            (r"\bheadquarter(?:s|ed)?\s+in\s+([A-Z][A-Za-z\s]+)", "geo"),
        ):
            m = re.search(pat, text)
            if m:
                n += 1
                facts.append(
                    Fact(
                        id=f"fact-{n}",
                        type=typ,
                        value=m.group(1).strip(),
                        url=p.final_url or p.url,
                        span=m.group(0),
                        page_ids=[p.id],
                    )
                )
    return facts


def _norm_num(s: str) -> str:
    d = NUM.search(s.replace(",", ""))
    return d.group(0) if d else s.strip()


def material(fact: Fact) -> bool:
    return fact.type in ("price", "leader", "geo", "offering")


YEAR_RE = re.compile(r"\b((?:19|20)\d{2})\b")


def _directionality(source_kind: str) -> str:
    if source_kind in ("linkedin", "twitter", "facebook", "company_profile"):
        return "low"
    if source_kind == "linked_public_profile":
        return "medium"
    if source_kind == "press":
        return "snapshot"
    return "unknown"


def extract_source_prices(text: str) -> set[str]:
    return {_norm_num(m.group()) for m in iter_offer_prices(text or "") if _norm_num(m.group())}


def compare_claim_against_source(
    site_value: str,
    source_value: str,
    *,
    source_kind: str = "other",
    site_as_of: Optional[str] = None,
    source_as_of: Optional[str] = None,
    claim_type: str = "price",
) -> dict[str, Any]:
    """P-016 order. status: agree | contradict | insufficient | empty | stale."""
    sv = (site_value or "").strip()
    ov = (source_value or "").strip()
    dir_conf = _directionality(source_kind)
    base = {
        "material": material(Fact(id="", type=claim_type, value=sv, url="")),
        "directionality": dir_conf,
        "site_value": sv,
        "source_excerpt": ov[:240],
        "site_as_of": site_as_of,
        "source_as_of": source_as_of,
        "source_kind": source_kind,
        "comparison_basis": "typed_value",
    }
    if not sv or not ov:
        return {**base, "match": True, "status": "empty", "note": "empty"}

    if claim_type == "price" or PRICE_RE.search(sv):
        site_nums = extract_source_prices(sv) or ({_norm_num(sv)} if _norm_num(sv) else set())
        src_nums = extract_source_prices(ov)
        if not src_nums:
            return {**base, "match": True, "status": "insufficient", "note": "no comparable numeric value on linked source"}
        if site_nums & src_nums:
            return {**base, "match": True, "status": "agree", "note": "", "extracted_source": sorted(src_nums)}
        years_src = [int(y) for y in YEAR_RE.findall(ov)]
        years_site = [int(y) for y in YEAR_RE.findall(sv)]
        if years_src and (not years_site or max(years_src) + 2 <= (max(years_site) if years_site else 9999)):
            # linked page dated materially older than the live claim
            if years_src and max(years_src) < 2024:
                return {
                    **base,
                    "match": False,
                    "status": "stale",
                    "note": "linked source looks stale relative to site claim",
                    "extracted_source": sorted(src_nums),
                    "extracted_site": sorted(site_nums),
                }
        return {
            **base,
            "match": False,
            "status": "contradict",
            "note": "values differ",
            "extracted_source": sorted(src_nums),
            "extracted_site": sorted(site_nums),
            "comparison_basis": "normalized_price",
        }

    svl, ovl = sv.lower(), ov.lower()
    if svl == ovl or svl in ovl or ovl in svl:
        return {**base, "match": True, "status": "agree", "note": ""}
    # source has text but not the site value — insufficient unless source states a different proper noun
    tokens = [t for t in re.findall(r"[A-Z][a-z]+(?:\s[A-Z][a-z]+)+", ov)]
    if claim_type in ("leader", "geo") and tokens:
        if all(svl not in t.lower() for t in tokens):
            return {
                **base,
                "match": False,
                "status": "contradict",
                "note": "values differ",
                "extracted_source": tokens[:5],
                "comparison_basis": f"{claim_type}_span",
            }
    return {**base, "match": True, "status": "insufficient", "note": "linked source unusable for this claim"}
