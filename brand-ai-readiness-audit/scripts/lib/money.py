"""Offer-price materiality: currency occurrence is not a commercial price."""

from __future__ import annotations

import re
from typing import Iterator, Literal

from lib.extract import PRICE_RE

Kind = Literal["offer", "metric", "unknown"]

NUM = re.compile(r"[\d.]+")

_SCALE_AFTER = re.compile(
    r"^\s*(?:million|billion|trillion|millions|billions|mn|bn|mm)\b",
    re.I,
)
_COMPACT_SCALE = re.compile(r"^\s*[MBT]\b")

# Closed class of *roles* (business metrics), not product keywords.
_METRIC_ROLE = re.compile(
    r"\b(?:"
    r"arr|nrr|mrr|"
    r"revenue|revenues|turnover|"
    r"raised|raise|funding|"
    r"series\s+[a-f]|"
    r"valuation|valuations|valued|"
    r"market\s+(?:size|cap|opportunity)|"
    r"gmv|gross\s+merchandise|"
    r"processed|processing\s+volume|payment\s+volume|"
    r"credit|credits|reward|rewards|"
    r"investment|invested|"
    r"salary|compensation|payroll"
    r")\b",
    re.I,
)

_OFFER_RATE = re.compile(
    r"(?:"
    r"/\s*(?:mo|yr|wk|hr|month|year|week|hour|user|seat|license)"
    r"|per\s+(?:month|year|week|hour|user|seat|license|day)"
    r"|a\s+month|an\s+hour"
    r"|billed\s+\w+"
    r")\b",
    re.I,
)

_OFFER_FRAME = re.compile(
    r"\b(?:"
    r"plans?\s+start(?:ing)?(?:\s+at)?"
    r"|starting\s+at"
    r"|priced\s+at"
    r"|pricing\s*:"
    r"|subscription\s+fee"
    r"|monthly\s+fee"
    r"|annual\s+fee"
    r"|list\s+price"
    r"|from\s+only"
    r")\b",
    re.I,
)

# Amount immediately after a commercial label (typed lead-in, not a catalog).
_COMMERCIAL_LEAD = re.compile(
    r"(?:(?:list\s+)?prices?|pricing|fees?|costs?|subscription|plans?)\s*(?:is|are|at|of|:)?\s*$",
    re.I,
)

_FACT_PAGE = frozenset({"pricing", "product"})


def _amount(span: str) -> float:
    m = NUM.search(span.replace(",", ""))
    if not m:
        return 0.0
    try:
        return float(m.group(0))
    except ValueError:
        return 0.0


def classify_money_span(text: str, start: int, end: int, *, page_type: str = "") -> Kind:
    """Materiality: metric vs commercial offer vs abstain (unknown)."""
    span = text[start:end]
    after = text[end : min(len(text), end + 48)]
    before = text[max(0, start - 48) : start]
    window = text[max(0, start - 80) : min(len(text), end + 80)]
    if _SCALE_AFTER.match(after) or _COMPACT_SCALE.match(after):
        return "metric"
    if _METRIC_ROLE.search(window):
        return "metric"
    amt = _amount(span)
    if amt >= 1_000_000:
        return "metric"
    bundled = span + " " + after[:24]
    if _OFFER_RATE.search(window) or _OFFER_RATE.search(bundled) or _OFFER_FRAME.search(window):
        return "offer"
    if _COMMERCIAL_LEAD.search(before):
        return "offer"
    if page_type in _FACT_PAGE and 0 < amt < 10_000:
        return "offer"
    return "unknown"


def iter_offer_prices(text: str, *, page_type: str = "") -> Iterator[re.Match[str]]:
    for m in PRICE_RE.finditer(text or ""):
        if classify_money_span(text, m.start(), m.end(), page_type=page_type) == "offer":
            yield m


def offer_price_strings(text: str, *, page_type: str = "") -> list[str]:
    return [m.group() for m in iter_offer_prices(text or "", page_type=page_type)]


def has_offer_price(text: str, *, page_type: str = "") -> bool:
    return next(iter_offer_prices(text or "", page_type=page_type), None) is not None


def first_offer_window(text: str, *, page_type: str = "", pad: int = 40) -> str | None:
    m = next(iter_offer_prices(text or "", page_type=page_type), None)
    if not m:
        return None
    i = max(0, m.start() - pad)
    return text[i : m.end() + pad]
