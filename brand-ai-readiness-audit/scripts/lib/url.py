"""URL normalization, trap flags, SSRF address policy."""

from __future__ import annotations

import ipaddress
import re
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

TRACKING = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "mc_cid",
    "mc_eid",
    "sessionid",
    "sid",
}

FACET_KEYS = {
    "color",
    "colour",
    "size",
    "sort",
    "order",
    "page",
    "p",
    "filter",
    "filters",
    "min_price",
    "max_price",
}

MAX_REDIRECTS = 5
CGNAT = ipaddress.ip_network("100.64.0.0/10")
METADATA_V4 = ipaddress.ip_network("169.254.169.254/32")


def scheme_ok(url: str) -> bool:
    p = urlparse(url)
    return p.scheme in ("http", "https")


def has_userinfo(url: str) -> bool:
    p = urlparse(url)
    return bool(p.username or p.password)


def origin(url: str) -> str:
    p = urlparse(url)
    netloc = p.netloc.lower()
    return f"{p.scheme.lower()}://{netloc}"


def strip_userinfo(url: str) -> str:
    p = urlparse(url)
    host = p.hostname or ""
    try:
        addr = ipaddress.ip_address(host)
        if addr.version == 6:
            host = f"[{host}]"
    except ValueError:
        pass
    if p.port:
        host = f"{host}:{p.port}"
    return urlunparse((p.scheme, host, p.path, p.params, p.query, ""))


def normalize(url: str, base: str | None = None) -> str:
    if base:
        url = urljoin(base, url)
    url = strip_userinfo(url)
    p = urlparse(url)
    q = [
        (k, v)
        for k, v in parse_qsl(p.query, keep_blank_values=True)
        if k.lower() not in TRACKING
    ]
    q.sort()
    path = p.path or "/"
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return urlunparse((p.scheme.lower(), (p.netloc or "").lower(), path, "", urlencode(q), ""))


def canonical_key(url: str) -> str:
    return normalize(url)


def trap_flags(url: str) -> list[str]:
    flags = []
    p = urlparse(url)
    keys = {k.lower() for k, _ in parse_qsl(p.query)}
    if keys & FACET_KEYS:
        flags.append("facet")
    if p.path.count("/") > 12:
        flags.append("deep")
    if re.search(r"/calendar/|/20\d{2}/\d{2}/\d{2}/", p.path):
        flags.append("calendar")
    return flags


def is_blocked_ip(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return True
    if addr.version == 6 and addr.ipv4_mapped:
        return is_blocked_ip(str(addr.ipv4_mapped))
    if addr.is_private or addr.is_loopback or addr.is_link_local or addr.is_multicast:
        return True
    if addr.is_unspecified or addr.is_reserved:
        return True
    if addr.version == 4:
        if addr in CGNAT or addr in METADATA_V4:
            return True
    if addr.version == 6:
        if addr.is_site_local:
            return True
        if addr.packed[0] & 0xFE == 0xFC:  # ULA fc00::/7
            return True
    return False


def same_registrable(a: str, b: str) -> bool:
    ha = (urlparse(a).hostname or "").lower()
    hb = (urlparse(b).hostname or "").lower()
    return ha == hb or ha.endswith("." + hb) or hb.endswith("." + ha)
