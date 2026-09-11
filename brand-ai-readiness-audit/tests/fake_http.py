"""In-memory HTTP for tests. No live network."""

from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from typing import Callable
from urllib.parse import urlparse


@dataclass
class FakeResp:
    status: int
    headers: dict
    body: bytes
    url: str

    def getcode(self):
        return self.status

    def read(self, n=-1):
        if n == -1:
            return self.body
        return self.body[:n]

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def make_opener(routes: dict[str, tuple[int, dict, bytes | str]]):
    def opener(req, timeout=None):
        url = req.full_url
        key = url
        if key not in routes:
            # try without trailing slash variants
            alt = url.rstrip("/") or url
            key = alt if alt in routes else url
        if key not in routes:
            return FakeResp(404, {"content-type": "text/plain"}, b"missing", url)
        status, headers, body = routes[key]
        if isinstance(body, str):
            body = body.encode("utf-8")
        h = {k.lower(): v for k, v in headers.items()}
        return FakeResp(status, h, body, url)

    return opener


def public_resolve(_host: str) -> list[str]:
    return ["8.8.8.8"]
