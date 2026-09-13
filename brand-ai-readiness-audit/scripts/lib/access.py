"""Classify fetch outcomes: usable content vs challenge/WAF vs empty vs HTTP errors."""

from __future__ import annotations

import re
from typing import Literal

AccessKind = Literal[
    "ok",
    "challenge",
    "captcha",
    "unauthorized",
    "rate_limited",
    "unavailable",
    "empty",
    "forbidden_content",
    "error_document",
]

_CHALLENGE = re.compile(
    r"(?:"
    r"cf-browser-verification|cf-challenge|cf-mitigated|"
    r"checking your browser|just a moment(?:\.\.\.)?|"
    r"enable javascript and cookies|"
    r"why have i been blocked|attention required|"
    r"bot detection|ddos protection by|"
    r"please wait(?: while )?(?:we )?verif|"
    r"unblocked\.to|"
    r"</noscript>\s*<div class=\"cf-"
    r")",
    re.I,
)
_CAPTCHA = re.compile(
    r"(?:captcha|hcaptcha|recaptcha|g-recaptcha|h-captcha|funcaptcha|arkose)",
    re.I,
)
_CF_RAY = re.compile(r"\bcf-ray\b", re.I)


def classify_http_access(
    *,
    status: int,
    headers: dict[str, str] | None,
    body: str,
    content_type: str = "",
) -> AccessKind:
    """Conservative: need strong signals. Real 403 HTML is not automatically WAF."""
    headers = {k.lower(): v for k, v in (headers or {}).items()}
    body = body or ""
    hdr = " ".join(f"{k}:{v}" for k, v in headers.items())
    blob = f"{hdr}\n{body[:8000]}"
    ctype = (content_type or headers.get("content-type") or "").lower()

    if status == 401:
        return "unauthorized"
    if status == 429:
        return "rate_limited"
    if status >= 500:
        return "unavailable"

    captcha = bool(_CAPTCHA.search(blob))
    challenge = bool(_CHALLENGE.search(blob))
    cf = bool(_CF_RAY.search(blob))
    cf_mitigated = "cf-mitigated" in headers or "challenge" in headers.get("cf-mitigated", "").lower()

    if captcha and (status in (401, 403, 429, 503) or challenge or cf):
        return "captcha"
    if challenge or cf_mitigated:
        return "challenge"
    if status == 403 and cf and len(body) < 4000 and captcha:
        return "captcha"
    if status == 403 and cf and len(body) < 2500:
        return "challenge"

    textish = re.sub(r"<[^>]+>", " ", body)
    textish = re.sub(r"\s+", " ", textish).strip()

    if status == 403:
        if len(body.strip()) < 80:
            return "empty"
        # Substantial HTML without challenge chrome → likely a real forbidden resource
        if len(textish) > 400 and not challenge and not captcha:
            return "forbidden_content"
        if len(textish) < 200:
            return "error_document"
        return "forbidden_content"

    if status >= 400:
        if len(body.strip()) < 80:
            return "empty"
        return "error_document"

    if 200 <= status < 400:
        if not body.strip() and "html" in ctype:
            return "empty"
        return "ok"

    return "ok"


def content_usable(kind: AccessKind, status: int) -> bool:
    if kind in ("challenge", "captcha", "unauthorized", "rate_limited", "unavailable", "empty"):
        return False
    if status >= 400:
        return False  # even genuine 403 is not a stand-in for the public homepage
    return True
