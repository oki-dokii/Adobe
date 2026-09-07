from __future__ import annotations

import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
import sys

sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from fake_http import make_opener, public_resolve
from lib.admit import admit
from lib.clock import Clock
from lib.crawl import crawl
from lib.findings import make_finding, reset_ids
from lib.http import HttpClient, HttpError
from lib.merge import merge_findings
from lib.models import SiteType, SuggestedAction
from lib.orchestrator import run_audit, validate_seed
from lib.robots import fetch_robots
from lib.skill_cit import run as run_cit
from lib.skill_d import run as run_d
from lib.skill_i import run as run_i
from lib.skill_k import run as run_k
from lib.skill_v import run as run_v
from lib.skill_x import run as run_x
from lib.url import is_blocked_ip


def client(routes):
    return HttpClient(opener=make_opener(routes), resolve=public_resolve, rate_limiter=None)


def test_ssrf_blocks_loopback():
    c = HttpClient(resolve=lambda h: ["127.0.0.1"], opener=make_opener({}))
    with pytest.raises(HttpError) as e:
        c.request("https://evil.example/")
    assert e.value.code == "SSRF_BLOCKED"


def test_ssrf_blocks_literal_private_ip():
    c = HttpClient(resolve=public_resolve, opener=make_opener({}))
    with pytest.raises(HttpError) as e:
        c.request("http://192.168.1.5/")
    assert e.value.code == "SSRF_BLOCKED"


def test_ssrf_redirect_hop():
    routes = {
        "https://pub.example/": (302, {"Location": "http://127.0.0.1/secret"}, b""),
    }
    c = HttpClient(opener=make_opener(routes), resolve=lambda h: ["8.8.8.8"] if h != "127.0.0.1" else ["127.0.0.1"])
    with pytest.raises(HttpError) as e:
        c.request("https://pub.example/")
    assert e.value.code == "SSRF_BLOCKED"


def test_robots_5xx_fail_closed():
    routes = {"https://a.example/robots.txt": (503, {"content-type": "text/plain"}, b"nope")}
    pol = fetch_robots(client(routes), "https://a.example/")
    assert pol.status == "fail_closed"


def test_robots_4xx_fail_open():
    routes = {"https://a.example/robots.txt": (403, {"content-type": "text/plain"}, b"no")}
    pol = fetch_robots(client(routes), "https://a.example/")
    assert pol.status == "fail_open"


def test_robots_404_missing():
    routes = {"https://a.example/robots.txt": (404, {"content-type": "text/plain"}, b"")}
    pol = fetch_robots(client(routes), "https://a.example/")
    assert pol.status in ("missing", "fail_open")


def test_reject_file_scheme():
    with pytest.raises(ValueError):
        validate_seed("file:///etc/passwd")


def test_no_post_method():
    c = client({})
    with pytest.raises(HttpError):
        c.request("https://a.example/", method="POST")
