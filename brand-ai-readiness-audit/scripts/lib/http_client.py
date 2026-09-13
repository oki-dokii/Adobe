"""Read-only HTTP client: GET/HEAD, no auto-redirects, per-hop SSRF, pin-to-resolved-IP."""

from __future__ import annotations

import http.client
import socket
import ssl
import sys
import time
from dataclasses import dataclass, field
from typing import Callable, Optional
from urllib.parse import urljoin, urlparse
from urllib.request import (
    HTTPErrorProcessor,
    HTTPHandler,
    HTTPRedirectHandler,
    HTTPSHandler,
    Request,
    build_opener,
)

from lib.url import MAX_REDIRECTS, has_userinfo, is_blocked_ip, scheme_ok, strip_userinfo

USER_AGENT = "BrandAIReadinessAudit/1.0 (+https://adobe-hackathon.local; read-only)"
DEFAULT_TIMEOUT = 8.0
DEFAULT_MAX_BYTES = 2_000_000
METHODS = frozenset({"GET", "HEAD"})
REDIRECT_STATUSES = {301, 302, 303, 307, 308}

Resolver = Callable[[str], list[str]]


class HttpError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass
class HttpResponse:
    url: str
    final_url: str
    status: int
    headers: dict[str, str]
    body: bytes
    redirect_hops: int
    timing_ms: float
    error_code: str = ""
    hops: list[str] = field(default_factory=list)
    pinned_ips: list[str] = field(default_factory=list)


class _NoRedirectProcessor(HTTPErrorProcessor):
    """Return 3xx to the caller; never follow Location."""

    def http_response(self, request, response):
        return response

    https_response = http_response


def build_production_opener(ssl_context: ssl.SSLContext | None = None):
    """Production urllib opener: GET path helper. Explicitly excludes HTTPRedirectHandler."""
    ctx = ssl_context or ssl.create_default_context()
    opener = build_opener(_NoRedirectProcessor(), HTTPHandler(), HTTPSHandler(context=ctx))
    opener.handlers = [h for h in opener.handlers if not isinstance(h, HTTPRedirectHandler)]
    return opener


def production_opener_has_redirect_handler() -> bool:
    return any(isinstance(h, HTTPRedirectHandler) for h in build_production_opener().handlers)


def _default_resolve(host: str) -> list[str]:
    infos = socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)
    ips = []
    for info in infos:
        ip = info[4][0]
        if ip not in ips:
            ips.append(ip)
    return ips


def pin_ip_for_url(
    url: str,
    resolve: Resolver,
    *,
    unsafe_allow_ips: frozenset[str] = frozenset(),
    unsafe_allow_hosts: frozenset[str] = frozenset(),
) -> str:
    """Validate scheme/host/IPs then return the IP we will connect to (TOCTOU pin).

    `unsafe_allow_*` is a test-only seam so a loopback HTTPServer can stand in for a
    public origin. Literal blocked IPs and unlisted hostnames are never allowed.
    """
    if not scheme_ok(url):
        raise HttpError("SSRF_BLOCKED", f"scheme not allowed: {url}")
    if has_userinfo(url):
        raise HttpError("SSRF_BLOCKED", "credentials in URL")
    host = urlparse(url).hostname
    if not host:
        raise HttpError("SSRF_BLOCKED", "missing host")
    host_l = host.lower()

    def _allowed(ip: str) -> bool:
        if not is_blocked_ip(ip):
            return True
        return host_l in unsafe_allow_hosts and ip in unsafe_allow_ips

    try:
        import ipaddress

        ipaddress.ip_address(host)
        if not _allowed(host):
            raise HttpError("SSRF_BLOCKED", f"blocked literal IP {host}")
        return host
    except ValueError:
        pass
    except HttpError:
        raise
    try:
        ips = resolve(host)
    except OSError as e:
        raise HttpError("DNS_FAILURE", str(e)) from e
    if not ips:
        raise HttpError("DNS_FAILURE", f"no A/AAAA for {host}")
    for ip in ips:
        if not _allowed(ip):
            raise HttpError("SSRF_BLOCKED", f"blocked IP {ip} for {host}")
    for ip in ips:
        if _allowed(ip):
            return ip
    raise HttpError("SSRF_BLOCKED", f"no allowed IP for {host}")


class RateLimiter:
    def __init__(self, min_interval_s: float = 0.2):
        self.min_interval_s = min_interval_s
        self._last: dict[str, float] = {}

    def wait(self, host: str) -> None:
        now = time.time()
        last = self._last.get(host, 0.0)
        delay = self.min_interval_s - (now - last)
        if delay > 0:
            time.sleep(delay)
        self._last[host] = time.time()


_UNSET = object()


class HttpClient:
    def __init__(
        self,
        timeout_s: float = DEFAULT_TIMEOUT,
        max_bytes: int = DEFAULT_MAX_BYTES,
        resolve: Optional[Resolver] = None,
        opener=None,
        rate_limiter=_UNSET,
        allowed_methods: frozenset[str] = METHODS,
        unsafe_allow_ips: Optional[set[str]] = None,
        unsafe_allow_hosts: Optional[set[str]] = None,
    ):
        self.timeout_s = timeout_s
        self.max_bytes = max_bytes
        self.resolve = resolve or _default_resolve
        self.opener = opener
        self.rate = RateLimiter() if rate_limiter is _UNSET else rate_limiter
        self.allowed_methods = allowed_methods
        self.unsafe_allow_ips = frozenset(unsafe_allow_ips or ())
        self.unsafe_allow_hosts = frozenset(h.lower() for h in (unsafe_allow_hosts or ()))
        self.request_count = 0
        self.production_opener = build_production_opener()

    def request(
        self,
        url: str,
        method: str = "GET",
        timeout_s: Optional[float] = None,
        max_bytes: Optional[int] = None,
    ) -> HttpResponse:
        method = method.upper()
        if method not in self.allowed_methods:
            raise HttpError("SKILL_INTERNAL_ERROR", f"method {method} not allowed")
        t0 = time.time()
        timeout = timeout_s if timeout_s is not None else self.timeout_s
        max_b = max_bytes if max_bytes is not None else self.max_bytes
        current = strip_userinfo(url)
        print(
            f"[HTTP_DEBUG] about_to_request url={current} ts={time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} epoch={time.time()}",
            flush=True,
            file=sys.stderr,
        )
        hops: list[str] = []
        pinned: list[str] = []
        redirects = 0
        seen: set[str] = set()
        try:
            while True:
                if current in seen:
                    raise HttpError("SSRF_BLOCKED", "redirect loop")
                seen.add(current)
                connect_ip = pin_ip_for_url(
                    current,
                    self.resolve,
                    unsafe_allow_ips=self.unsafe_allow_ips,
                    unsafe_allow_hosts=self.unsafe_allow_hosts,
                )
                hops.append(current)
                pinned.append(connect_ip)
                host = urlparse(current).hostname or ""
                if self.rate:
                    self.rate.wait(host)
                self.request_count += 1
                status, headers, body = self._fetch_once(current, method, timeout, max_b, connect_ip)
                loc = (headers.get("location") or "").strip()
                if status in REDIRECT_STATUSES:
                    redirects += 1
                    if redirects > MAX_REDIRECTS:
                        raise HttpError("SSRF_BLOCKED", "too many redirects")
                    if not loc:
                        raise HttpError("SSRF_BLOCKED", "malformed Location header")
                    nxt = urljoin(current, loc)
                    nxt = strip_userinfo(nxt)
                    pin_ip_for_url(
                        nxt,
                        self.resolve,
                        unsafe_allow_ips=self.unsafe_allow_ips,
                        unsafe_allow_hosts=self.unsafe_allow_hosts,
                    )
                    current = nxt
                    continue
                timing = (time.time() - t0) * 1000
                return HttpResponse(
                    url=url,
                    final_url=current,
                    status=int(status),
                    headers=headers,
                    body=body,
                    redirect_hops=redirects,
                    timing_ms=timing,
                    hops=hops,
                    pinned_ips=pinned,
                )
        except HttpError:
            raise
        except (TimeoutError, socket.timeout) as e:
            raise HttpError("FETCH_TIMEOUT", str(e)) from e
        except ssl.SSLError as e:
            raise HttpError("TLS_FAILURE", str(e)) from e
        except OSError as e:
            msg = str(e).lower()
            if "timed out" in msg:
                raise HttpError("FETCH_TIMEOUT", str(e)) from e
            raise HttpError("DNS_FAILURE", str(e)) from e
        except Exception as e:
            raise HttpError("FETCH_TIMEOUT" if "time" in str(e).lower() else "PARSE_FAILURE", str(e)) from e

    def _fetch_once(self, url: str, method: str, timeout: float, max_b: int, connect_ip: str) -> tuple[int, dict[str, str], bytes]:
        if self.opener is not None:
            req = Request(url, method=method, headers={"User-Agent": USER_AGENT, "Accept-Encoding": "gzip, deflate"})
            resp = self.opener(req, timeout=timeout)
            with resp:
                status = getattr(resp, "status", None) or resp.getcode()
                headers = {k.lower(): v for k, v in resp.headers.items()}
                body = b""
                if method != "HEAD":
                    body = resp.read(max_b + 1)
                    body = self._decompress_if_needed(body, headers)
                    if len(body) > max_b:
                        body = body[:max_b]
                return int(status), headers, body
        return self._fetch_pinned(url, method, timeout, max_b, connect_ip)

    @staticmethod
    def _decompress_if_needed(body: bytes, headers: dict[str, str]) -> bytes:
        if not body:
            return body
        ce = headers.get("content-encoding", "").lower()
        if "gzip" in ce or "deflate" in ce:
            try:
                import gzip, zlib

                if "gzip" in ce or (len(body) > 2 and body[:2] == b"\x1f\x8b"):
                    return gzip.decompress(body)
                if "deflate" in ce:
                    try:
                        return zlib.decompress(body)
                    except zlib.error:
                        return zlib.decompress(body, -zlib.MAX_WBITS)
            except Exception:
                pass
        # Auto-detect gzip magic bytes even if header is missing/mangled
        if len(body) > 2 and body[:2] == b"\x1f\x8b":
            try:
                import gzip
                return gzip.decompress(body)
            except Exception:
                pass
        return body

    def _fetch_pinned(self, url: str, method: str, timeout: float, max_b: int, connect_ip: str) -> tuple[int, dict[str, str], bytes]:
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        path = parsed.path or "/"
        if parsed.query:
            path = f"{path}?{parsed.query}"
        sock = socket.create_connection((connect_ip, port), timeout=timeout)
        try:
            sock.settimeout(timeout)
            if parsed.scheme == "https":
                ctx = ssl.create_default_context()
                sock = ctx.wrap_socket(sock, server_hostname=hostname)
                sock.settimeout(timeout)
            conn = http.client.HTTPConnection(hostname, port, timeout=timeout)
            conn.sock = sock
            conn.request(
                method,
                path,
                headers={
                    "Host": hostname,
                    "User-Agent": USER_AGENT,
                    "Accept-Encoding": "gzip, deflate",
                    "Connection": "close",
                },
            )
            resp = conn.getresponse()
            headers = {k.lower(): v for k, v in resp.getheaders()}
            body = b""
            if method != "HEAD":
                body = resp.read(max_b + 1)
                body = self._decompress_if_needed(body, headers)
                if len(body) > max_b:
                    body = body[:max_b]
            status = resp.status
            conn.close()
            return status, headers, body
        finally:
            try:
                sock.close()
            except OSError:
                pass
