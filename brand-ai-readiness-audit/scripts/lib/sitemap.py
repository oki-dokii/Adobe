"""Sitemap parsing with fanout cap."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from urllib.parse import urlparse

from lib.http import HttpClient, HttpError

SITEMAP_CAP = 200
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def _local(tag: str) -> str:
    return tag.split("}")[-1]


def parse_sitemap_xml(body: str, cap: int = SITEMAP_CAP) -> tuple[list[dict], list[str]]:
    urls: list[dict] = []
    children: list[str] = []
    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return [], []
    for el in list(root):
        name = _local(el.tag)
        if name == "sitemap":
            loc = "".join(el.findtext(f"{el.tag.replace(name, 'loc')}") or "")
            loc_el = None
            for c in el:
                if _local(c.tag) == "loc" and c.text:
                    loc_el = c.text.strip()
            if loc_el:
                children.append(loc_el)
        elif name == "url":
            loc = ""
            lastmod = None
            for c in el:
                n = _local(c.tag)
                if n == "loc" and c.text:
                    loc = c.text.strip()
                if n == "lastmod" and c.text:
                    lastmod = c.text.strip()
            if loc:
                urls.append({"url": loc, "lastmod": lastmod})
                if len(urls) >= cap:
                    break
    return urls, children


def fetch_sitemaps(client: HttpClient, origin: str, robots_body: str = "", cap: int = SITEMAP_CAP, max_requests: int = 8) -> list[dict]:
    seeds = []
    for line in robots_body.splitlines():
        if line.lower().startswith("sitemap:"):
            seeds.append(line.split(":", 1)[1].strip())
    if not seeds:
        seeds.append(origin.rstrip("/") + "/sitemap.xml")
    seen = set()
    out: list[dict] = []
    queue = list(seeds[:5])
    requests_made = 0
    while queue and len(out) < cap and requests_made < max_requests:
        u = queue.pop(0)
        if u in seen:
            continue
        seen.add(u)
        requests_made += 1
        try:
            resp = client.request(u, method="GET", timeout_s=3.0)
        except HttpError:
            continue
        if resp.status >= 400:
            continue
        body = resp.body.decode("utf-8", errors="replace")
        urls, children = parse_sitemap_xml(body, cap)
        out.extend(urls)
        for c in children[:5]:
            if urlparse(c).scheme in ("http", "https") and c not in seen:
                queue.append(c)
    return out[:cap]
