"""RFC 9309 robots.txt: 4xx fail-open, 5xx fail-closed."""

from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

from lib.http_client import HttpClient, HttpError
from lib.url import origin

# Closed list of AI / crawler tokens to document (LOCKED).
AI_TOKENS = (
    "GPTBot",
    "ChatGPT-User",
    "Google-Extended",
    "anthropic-ai",
    "ClaudeBot",
    "PerplexityBot",
    "Bytespider",
    "CCBot",
    "Applebot-Extended",
)


@dataclass
class RobotsPolicy:
    origin: str
    status: str  # ok|fail_open|fail_closed|missing
    body: str = ""
    fetch_http_status: int = 0
    parser: RobotFileParser | None = None
    error: str = ""
    groups: dict[str, list[str]] = field(default_factory=dict)

    def allows(self, ua: str, url: str) -> bool:
        if self.status == "fail_closed":
            return False
        if self.status in ("fail_open", "missing"):
            return True
        if not self.parser:
            return True
        return bool(self.parser.can_fetch(ua, url))

    def token_disallows(self, path: str = "/") -> list[str]:
        blocked = []
        test_url = self.origin.rstrip("/") + (path if path.startswith("/") else "/" + path)
        for tok in AI_TOKENS:
            if self.status == "ok" and self.parser and not self.parser.can_fetch(tok, test_url):
                blocked.append(tok)
        return blocked


def parse_robots_body(body: str, robots_url: str) -> RobotFileParser:
    rp = RobotFileParser()
    rp.set_url(robots_url)
    rp.parse(body.splitlines())
    return rp


def fetch_robots(client: HttpClient, seed: str) -> RobotsPolicy:
    orig = origin(seed)
    robots_url = orig.rstrip("/") + "/robots.txt"
    try:
        resp = client.request(robots_url, method="GET")
    except HttpError as e:
        if e.code in ("DNS_FAILURE", "TLS_FAILURE", "FETCH_TIMEOUT", "SSRF_BLOCKED"):
            # Cannot fetch robots: fail-open for  network except we still record
            st = "fail_open" if e.code != "SSRF_BLOCKED" else "fail_closed"
            return RobotsPolicy(origin=orig, status=st, error=e.code)
        return RobotsPolicy(origin=orig, status="fail_open", error=e.code)
    code = resp.status
    body = resp.body.decode("utf-8", errors="replace")
    if 500 <= code <= 599:
        return RobotsPolicy(
            origin=orig,
            status="fail_closed",
            body=body,
            fetch_http_status=code,
        )
    if 400 <= code <= 499 or code == 0:
        return RobotsPolicy(
            origin=orig,
            status="fail_open" if code != 404 else "missing",
            body=body,
            fetch_http_status=code,
        )
    if code == 404:
        return RobotsPolicy(origin=orig, status="missing", fetch_http_status=404)
    rp = parse_robots_body(body, robots_url)
    return RobotsPolicy(origin=orig, status="ok", body=body, fetch_http_status=code, parser=rp)
