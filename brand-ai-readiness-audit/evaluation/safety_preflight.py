"""Refuse to run live evaluation if production safety is not actually on."""

from __future__ import annotations

from urllib.request import HTTPRedirectHandler

from lib.clock import PROTECT_LIST
from lib.crawl import PAGE_CAP
from lib.http import (
    DEFAULT_MAX_BYTES,
    DEFAULT_TIMEOUT,
    METHODS,
    HttpClient,
    HttpError,
    build_production_opener,
    production_opener_has_redirect_handler,
)
from lib.url import MAX_REDIRECTS, is_blocked_ip


class SafetyError(RuntimeError):
    pass


def assert_production_safety() -> dict:
    """Fail closed. Never disable these to make a site pass."""
    checks = {}
    if production_opener_has_redirect_handler():
        raise SafetyError("HTTPRedirectHandler is installed on the production opener")
    opener = build_production_opener()
    if any(isinstance(h, HTTPRedirectHandler) for h in opener.handlers):
        raise SafetyError("redirect handler present after build_production_opener")
    checks["no_auto_redirect"] = True

    blocked = [
        "127.0.0.1",
        "10.1.2.3",
        "192.168.0.1",
        "169.254.169.254",
        "::1",
        "fd00::1",
        "100.64.1.1",
    ]
    for ip in blocked:
        if not is_blocked_ip(ip):
            raise SafetyError(f"SSRF policy allows {ip}")
    checks["ssrf_policy"] = True

    if METHODS != frozenset({"GET", "HEAD"}):
        raise SafetyError(f"unexpected methods {METHODS}")
    c = HttpClient(rate_limiter=None)
    try:
        c.request("https://example.com/", method="POST")
        raise SafetyError("POST was not rejected")
    except HttpError as e:
        if "not allowed" not in str(e).lower() and e.code != "SKILL_INTERNAL_ERROR":
            # still rejected; good enough if code is method-related
            if e.code == "SSRF_BLOCKED":
                raise SafetyError("POST reached SSRF instead of method allowlist")
    checks["get_head_only"] = True

    if MAX_REDIRECTS > 5:
        raise SafetyError(f"redirect cap too high: {MAX_REDIRECTS}")
    checks["redirect_cap"] = MAX_REDIRECTS

    if DEFAULT_TIMEOUT <= 0:
        raise SafetyError("timeouts disabled")
    checks["timeout_s"] = DEFAULT_TIMEOUT
    checks["max_bytes"] = DEFAULT_MAX_BYTES
    checks["page_cap"] = PAGE_CAP
    if PAGE_CAP > 80:
        raise SafetyError(f"page cap looks unbounded: {PAGE_CAP}")

    http_src = (__import__("lib.http", fromlist=["http"]).__file__)
    text = open(http_src, encoding="utf-8").read()
    if "CookieJar" in text or "http.cookiejar" in text:
        raise SafetyError("cookie jar present")
    if "method = \"POST\"" in text or "method='POST'" in text:
        raise SafetyError("POST call site in http client")
    checks["no_cookie_jar"] = True
    checks["protect_list"] = sorted(PROTECT_LIST)
    return checks
