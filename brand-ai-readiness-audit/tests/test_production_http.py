"""Production HTTP client tests: real opener/pin path + local HTTPServer."""

from __future__ import annotations

import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.http import (
    HttpClient,
    HttpError,
    build_production_opener,
    production_opener_has_redirect_handler,
)
from lib.url import is_blocked_ip
from urllib.request import HTTPRedirectHandler


def _serve(table: dict[str, tuple[int, dict[str, str], bytes]]):
    class H(BaseHTTPRequestHandler):
        def _handle(self):
            rec = table.get(self.path)
            if rec is None:
                self.send_response(404)
                self.end_headers()
                return
            status, headers, body = rec
            self.send_response(status)
            for k, v in headers.items():
                self.send_header(k, v)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)

        def do_GET(self):
            self._handle()

        def do_HEAD(self):
            self._handle()

        def log_message(self, *_a):
            return

    srv = ThreadingHTTPServer(("127.0.0.1", 0), H)
    th = threading.Thread(target=srv.serve_forever, daemon=True)
    th.start()
    return srv


def _client(port: int, extra_hosts: set[str] | None = None) -> HttpClient:
    hosts = {"public.test", "public2.test"} | (extra_hosts or set())

    def resolve(host: str) -> list[str]:
        h = host.lower()
        if h in hosts or h in {"public.test", "public2.test"}:
            return ["127.0.0.1"]
        import socket

        infos = socket.getaddrinfo(host, None)
        ips = []
        for info in infos:
            ip = info[4][0]
            if ip not in ips:
                ips.append(ip)
        return ips or ["127.0.0.1"]

    return HttpClient(
        resolve=resolve,
        rate_limiter=None,
        opener=None,
        unsafe_allow_hosts=hosts,
        unsafe_allow_ips={"127.0.0.1"},
        timeout_s=2.0,
    )


def test_production_opener_excludes_redirect_handler():
    assert production_opener_has_redirect_handler() is False
    opener = build_production_opener()
    assert not any(isinstance(h, HTTPRedirectHandler) for h in opener.handlers)


def test_cgnat_blocked_on_policy():
    assert is_blocked_ip("100.64.0.1")
    assert is_blocked_ip("100.127.255.254")
    assert is_blocked_ip("100.64.1.1")


class _DynHandler(BaseHTTPRequestHandler):
    ROUTES: dict = {}

    def do_GET(self):
        port_now = self.server.server_address[1]
        spec = self.ROUTES.get(self.path)
        if spec is None:
            self.send_response(404)
            self.end_headers()
            return
        kind = spec[0]
        if kind == "redirect":
            loc_tmpl = spec[1]
            loc = loc_tmpl.replace("{port}", str(port_now))
            self.send_response(302)
            self.send_header("Location", loc)
            self.end_headers()
            return
        if kind == "redirect_status":
            loc = spec[2].replace("{port}", str(port_now))
            self.send_response(spec[1])
            self.send_header("Location", loc)
            self.end_headers()
            return
        if kind == "body":
            body = spec[1]
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if kind == "empty_loc":
            self.send_response(302)
            self.send_header("Location", "")
            self.end_headers()
            return
        if kind == "slow":
            time.sleep(spec[1])
            self.send_response(200)
            self.end_headers()
            return
        self.send_response(500)
        self.end_headers()

    def do_HEAD(self):
        self.do_GET()

    def log_message(self, *_a):
        return


def _dyn(routes: dict) -> tuple[ThreadingHTTPServer, int, HttpClient]:
    class H(_DynHandler):
        ROUTES = routes

    srv = ThreadingHTTPServer(("127.0.0.1", 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    port = srv.server_address[1]
    return srv, port, _client(port)


def test_public_to_public_redirect():
    srv, port, c = _dyn(
        {
            "/start": ("redirect", "http://public2.test:{port}/ok"),
            "/ok": ("body", b"hello-public"),
        }
    )
    resp = c.request(f"http://public.test:{port}/start")
    assert resp.status == 200
    assert resp.body == b"hello-public"
    assert resp.redirect_hops == 1
    srv.shutdown()


def test_public_to_localhost_blocked():
    srv, port, c = _dyn({"/start": ("redirect", "http://localhost:{port}/secret")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_public_to_127_blocked():
    srv, port, c = _dyn({"/start": ("redirect", "http://127.0.0.1:{port}/secret")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_public_to_private_ipv4_blocked():
    srv, port, c = _dyn({"/start": ("redirect", "http://10.1.2.3/x")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_public_to_private_ipv6_blocked():
    srv, port, c = _dyn({"/start": ("redirect", "http://[fd00::1]/x")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_public_to_link_local_blocked():
    srv, port, c = _dyn({"/start": ("redirect", "http://169.254.1.1/x")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_public_to_cgnat_blocked_production_path():
    srv, port, c = _dyn({"/start": ("redirect", "http://100.64.1.1/meta")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/start")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_multi_hop_public_ok():
    srv, port, c = _dyn(
        {
            "/a": ("redirect", "http://public.test:{port}/b"),
            "/b": ("redirect", "http://public2.test:{port}/c"),
            "/c": ("body", b"end"),
        }
    )
    resp = c.request(f"http://public.test:{port}/a")
    assert resp.status == 200 and resp.body == b"end"
    assert resp.redirect_hops == 2
    srv.shutdown()


def test_unsafe_on_hop_2():
    srv, port, c = _dyn(
        {
            "/a": ("redirect", "http://public.test:{port}/b"),
            "/b": ("redirect", "http://192.168.0.9/pwn"),
        }
    )
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/a")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_unsafe_on_hop_n():
    srv, port, c = _dyn(
        {
            "/1": ("redirect", "http://public.test:{port}/2"),
            "/2": ("redirect", "http://public.test:{port}/3"),
            "/3": ("redirect", "http://169.254.169.254/latest/meta-data"),
        }
    )
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/1")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_redirect_loop_blocked():
    srv, port, c = _dyn({"/loop": ("redirect", "http://public.test:{port}/loop")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/loop")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_malformed_location_blocked():
    srv, port, c = _dyn({"/bad": ("empty_loc",)})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/bad")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_unsupported_scheme_blocked():
    srv, port, c = _dyn({"/file": ("redirect", "file:///etc/passwd")})
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/file")
    assert e.value.code == "SSRF_BLOCKED"
    srv.shutdown()


def test_get_only_and_timeout_preserved():
    c = HttpClient(opener=None, rate_limiter=None, unsafe_allow_hosts={"public.test"}, unsafe_allow_ips={"127.0.0.1"})
    with pytest.raises(HttpError):
        c.request("http://public.test/", method="POST")
    srv, port, c = _dyn({"/slow": ("slow", 1.0)})
    c.timeout_s = 0.15
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/slow")
    assert e.value.code == "FETCH_TIMEOUT"
    srv.shutdown()


def test_pin_happens_before_follow_no_connect_to_cgnat():
    """If hop-2 were followed by urllib, we would hang/connect. We must raise first."""
    srv, port, c = _dyn({"/s": ("redirect", "http://100.64.0.1:9/")})
    t0 = time.time()
    with pytest.raises(HttpError) as e:
        c.request(f"http://public.test:{port}/s")
    assert e.value.code == "SSRF_BLOCKED"
    assert time.time() - t0 < 1.5
    srv.shutdown()
