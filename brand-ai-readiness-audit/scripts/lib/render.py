"""Dual-fetch render: timeout-bounded, no browser required.

Production path expands <noscript> (and optional injected DOM) so raw vs rendered
can differ without a headless engine. Tests may inject rendered_html.
"""

from __future__ import annotations

import re
import time

from lib.extract import parse_html, text_delta_ratio
from lib.models import Page

NOSCRIPT_RE = re.compile(r"<noscript\b[^>]*>(.*?)</noscript>", re.I | re.S)
TEMPLATE_RE = re.compile(r"<template\b[^>]*>(.*?)</template>", re.I | re.S)


def expand_noscript(html: str) -> str:
    """Production dual-fetch without a browser: unwrap noscript/template into the tree."""
    if not html:
        return html
    out = NOSCRIPT_RE.sub(lambda m: f"<!--dual-fetch-noscript-->{m.group(1)}", html)
    out = TEMPLATE_RE.sub(lambda m: f"<!--dual-fetch-template-->{m.group(1)}", out)
    return out


def apply_render(
    page: Page,
    rendered_html: str | None = None,
    timeout_hit: bool = False,
    *,
    do_render: bool = True,
) -> float:
    """Apply dual-fetch. Returns milliseconds spent. Honors caller do_render budget."""
    t0 = time.time()
    if not do_render:
        page.rendered_html = page.raw_html
        page.render_status = "skipped"
        page.text_delta_ratio = 0.0
        return 0.0
    if timeout_hit:
        page.render_status = "timeout"
        page.rendered_html = page.raw_html
        page.extractability_flags.notes = "RENDER_TIMEOUT: analyzed raw HTML only"
        return (time.time() - t0) * 1000
    if rendered_html is None:
        rendered_html = expand_noscript(page.raw_html or "")
        page.rendered_html = rendered_html
        page.render_status = "ok"
        page.text_delta_ratio = text_delta_ratio(page.raw_html, rendered_html)
        return (time.time() - t0) * 1000
    page.rendered_html = rendered_html
    page.render_status = "ok"
    page.text_delta_ratio = text_delta_ratio(page.raw_html, rendered_html)
    return (time.time() - t0) * 1000


def rendered_text(page: Page) -> str:
    html = page.rendered_html or page.raw_html
    return parse_html(html, page.final_url or page.url)["main_text"]
