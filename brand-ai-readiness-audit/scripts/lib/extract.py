"""HTML extraction, dual-fetch delta, JSON-LD, tables, dates."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from typing import Any
from urllib.parse import urljoin

from lib.models import ExtractabilityFlags, Page
from lib.simhash import simhash64


PRICE_RE = re.compile(
    r"(?:USD|EUR|GBP|\$|€|£)\s?\d[\d,]*(?:\.\d{2})?|\d[\d,]*(?:\.\d{2})?\s?(?:USD|EUR|GBP)",
    re.I,
)


class _Parser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.in_title = False
        self.in_script = False
        self.in_style = False
        self.in_main = False
        self.skip_hidden = False
        self.text_parts: list[str] = []
        self.hidden_text: list[str] = []
        self.headings: list[dict[str, Any]] = []
        self.landmarks = {"main": False, "nav": False, "header": False, "footer": False}
        self.links: list[str] = []
        self.canonical = ""
        self.robots_meta = ""
        self.json_ld_raw: list[str] = []
        self.in_ld = False
        self.ld_buf: list[str] = []
        self.images: list[dict[str, str]] = []
        self.has_toggle = False
        self.hidden_nodes = 0
        self.tables: list[dict[str, Any]] = []
        self._table_has_th = False
        self._in_table = False
        self.lang = ""
        self.same_as: list[str] = []
        self.date_meta: list[str] = []
        self._hlevel = 0
        self._hbuf: list[str] = []
        self.in_h = False
        self.breadcrumb = False
        self.details_open_text: list[str] = []
        self.details_stack: list[bool] = []
        self.in_closed_details = False
        self.closed_details_text: list[str] = []
        self.nav_texts: list[str] = []
        self.in_nav = False
        self.in_noscript = False
        self.noscript_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        ad = {k.lower(): (v or "") for k, v in attrs}
        style = ad.get("style", "").lower()
        hidden = "hidden" in ad or ad.get("aria-hidden") == "true"
        display_none = "display:none" in style.replace(" ", "") or "display: none" in style
        if tag in ("button", "summary") or ad.get("aria-expanded") or ad.get("onclick"):
            self.has_toggle = True
        if tag == "html" and ad.get("lang"):
            self.lang = ad["lang"][:8]
        if tag in self.landmarks:
            self.landmarks[tag] = True
        if tag == "nav" or "breadcrumb" in (ad.get("class", "") + ad.get("aria-label", "")).lower():
            self.landmarks["nav"] = True
            if "breadcrumb" in (ad.get("class", "") + ad.get("aria-label", "")).lower():
                self.breadcrumb = True
        if tag == "nav":
            self.in_nav = True
        if tag == "main":
            self.in_main = True
            self.landmarks["main"] = True
        if tag in ("script", "style", "noscript"):
            self.in_script = tag == "script"
            self.in_style = tag in ("style",)
            self.in_noscript = tag == "noscript"
            t = ad.get("type", "")
            if tag == "script" and "ld+json" in t:
                self.in_ld = True
                self.ld_buf = []
                self.in_script = False
        if tag == "title":
            self.in_title = True
        if tag in ("h1", "h2", "h3"):
            self.in_h = True
            self._hlevel = int(tag[1])
            self._hbuf = []
        if tag == "a":
            href = ad.get("href", "")
            if href:
                self.links.append(href)
        if tag == "link" and ad.get("rel", "").lower() == "canonical":
            self.canonical = ad.get("href", "")
        if tag == "meta":
            name = (ad.get("name") or ad.get("property") or "").lower()
            if name == "robots":
                self.robots_meta = ad.get("content", "")
            if "date" in name or name in ("article:modified_time", "og:updated_time"):
                self.date_meta.append(ad.get("content", ""))
        if tag == "img":
            self.images.append({"alt": ad.get("alt", ""), "src": ad.get("src", "")})
        if tag == "table":
            self._in_table = True
            self._table_has_th = False
        if tag == "th" and self._in_table:
            self._table_has_th = True
        if tag == "details":
            closed = "open" not in ad
            self.details_stack.append(closed)
            self.in_closed_details = any(self.details_stack)
        if display_none or hidden:
            self.skip_hidden = True
            self.hidden_nodes += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        if tag in ("script", "style", "noscript"):
            self.in_script = False
            self.in_style = False
            self.in_noscript = False
        if tag == "script" and self.in_ld:
            self.json_ld_raw.append("".join(self.ld_buf))
            self.in_ld = False
        if tag in ("h1", "h2", "h3") and self.in_h:
            self.headings.append({"level": self._hlevel, "text": "".join(self._hbuf).strip()})
            self.in_h = False
        if tag == "table" and self._in_table:
            self.tables.append({"has_th": self._table_has_th})
            self._in_table = False
        if tag == "details" and self.details_stack:
            self.details_stack.pop()
            self.in_closed_details = any(self.details_stack)
        if tag == "nav":
            self.in_nav = False
        if tag == "main":
            self.in_main = False
        if tag in ("div", "span", "p", "section") and self.skip_hidden:
            self.skip_hidden = False

    def handle_data(self, data: str) -> None:
        if self.in_ld:
            self.ld_buf.append(data)
            return
        if self.in_script or self.in_style:
            return
        if self.in_noscript:
            text_ns = data.strip()
            if text_ns:
                self.noscript_text.append(text_ns)
            return
        if self.in_title:
            self.title_parts.append(data)
        if self.in_h:
            self._hbuf.append(data)
        if self.in_nav:
            self.nav_texts.append(data)
        text = data.strip()
        if not text:
            return
        if self.skip_hidden:
            self.hidden_text.append(text)
            return
        if self.in_closed_details:
            self.closed_details_text.append(text)
            return
        self.text_parts.append(text)


def parse_html(html: str, base_url: str = "") -> dict[str, Any]:
    p = _Parser()
    try:
        p.feed(html or "")
    except Exception:
        pass
    title = "".join(p.title_parts).strip()
    main = " ".join(p.text_parts)
    json_ld = []
    for raw in p.json_ld_raw:
        try:
            json_ld.append(json.loads(raw))
        except json.JSONDecodeError:
            json_ld.append({"_parse_error": True, "_raw": raw[:200]})
    same_as = []
    for obj in json_ld:
        same_as.extend(_walk_same_as(obj))
    links = [urljoin(base_url, href) for href in p.links if href and not href.startswith(("mailto:", "javascript:", "tel:"))]
    return {
        "title": title,
        "main_text": main,
        "headings": p.headings,
        "landmarks": p.landmarks,
        "links": links,
        "canonical": urljoin(base_url, p.canonical) if p.canonical else "",
        "robots_meta": p.robots_meta,
        "json_ld": json_ld,
        "images": p.images,
        "tables": p.tables,
        "hidden_text": p.hidden_text,
        "hidden_nodes": p.hidden_nodes,
        "has_toggle": p.has_toggle,
        "lang": p.lang or "en",
        "same_as": same_as,
        "date_meta": p.date_meta,
        "breadcrumb": p.breadcrumb,
        "closed_details_text": p.closed_details_text,
        "noscript_text": p.noscript_text,
        "nav_texts": p.nav_texts,
        "simhash": simhash64((html or "")[:8000]),
    }


def _walk_same_as(obj: Any) -> list[str]:
    out: list[str] = []
    if isinstance(obj, dict):
        if "sameAs" in obj:
            v = obj["sameAs"]
            if isinstance(v, str):
                out.append(v)
            elif isinstance(v, list):
                out.extend(str(x) for x in v)
        for v in obj.values():
            out.extend(_walk_same_as(v))
    elif isinstance(obj, list):
        for x in obj:
            out.extend(_walk_same_as(x))
    return out


def classify_page_type(url: str, title: str, text: str) -> str:
    """Path-segment classification. Do not substring-match the hostname."""
    from urllib.parse import urlparse

    path = (urlparse(url).path or "/").lower()
    segs = [s for s in path.split("/") if s]
    title_l = (title or "").lower()
    if any(s in ("pricing", "price", "prices") for s in segs) or "pricing" in title_l:
        return "pricing"
    if any(s in ("about", "about-us", "aboutus") for s in segs):
        return "about"
    if any(s == "contact" for s in segs):
        return "contact"
    if any(s in ("docs", "documentation") for s in segs) or path.startswith("/docs"):
        return "docs"
    if any(s in ("blog", "news") for s in segs):
        return "article"
    if any(s in ("product", "products") for s in segs):
        return "product"
    if any(s in ("legal", "privacy") for s in segs):
        return "legal"
    if urlparse_path_is_home(url):
        return "home"
    # Locale-only homepages: /in, /en-au, /en-US
    if len(segs) == 1 and re.fullmatch(r"[a-z]{2}(?:-[a-z]{2})?", segs[0], re.I):
        return "home"
    return "other"


def urlparse_path_is_home(url: str) -> bool:
    from urllib.parse import urlparse

    path = urlparse(url).path or "/"
    return path in ("", "/")


def fill_page_from_html(page: Page) -> None:
    parsed = parse_html(page.raw_html, page.final_url or page.url)
    page.title = parsed["title"]
    page.main_text = parsed["main_text"]
    page.headings = parsed["headings"]
    page.landmarks = parsed["landmarks"]
    page.out_links = parsed["links"]
    page.robots_meta = parsed["robots_meta"]
    xr = (page.headers or {}).get("x-robots-tag") or ""
    if xr:
        page.robots_meta = (page.robots_meta + " " + xr).strip()
    page.canonical = parsed["canonical"]
    page.json_ld = parsed["json_ld"]
    page.tables = parsed["tables"]
    page.language = parsed["lang"]
    page.content_simhash = parsed["simhash"]
    page.page_type = classify_page_type(page.url, page.title, page.main_text)
    page.dates = {
        "visible": re.findall(r"\b(?:19|20)\d{2}\b", page.main_text)[:8],
        "schema": parsed["date_meta"],
        "http_last_modified": page.headers.get("last-modified"),
        "sitemap_lastmod": None,
    }


def text_delta_ratio(raw: str, rendered: str) -> float:
    a = set(PRICE_RE.findall(raw or ""))
    b = set(PRICE_RE.findall(rendered or ""))
    if not a and not b:
        ra, rb = set((raw or "").split()), set((rendered or "").split())
        if not rb:
            return 0.0
        return 1.0 - (len(ra & rb) / max(len(rb), 1))
    if not b:
        return 0.0
    new = b - a
    return len(new) / max(len(b), 1)


def default_flags() -> ExtractabilityFlags:
    return ExtractabilityFlags(in_raw=True, in_rendered=True, in_visible=True)
