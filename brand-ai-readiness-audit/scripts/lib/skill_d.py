"""SK-D render-extract-audit: flags, JS fact lock, D41, U9/U10."""

from __future__ import annotations

import time

from lib.confidence import attach_confidence
from lib.extract import PRICE_RE, parse_html, text_delta_ratio
from lib.findings import make_finding
from lib.models import CrawlSnapshot, ExtractabilityFlags, SkillResult, SuggestedAction
from lib.money import has_offer_price, offer_price_strings
from lib.sanitize import looks_like_injection


FACT_PAGES = {"home", "about", "pricing", "product", "contact"}


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    findings = []
    for p in snapshot.fetched_pages():
        raw = parse_html(p.raw_html, p.url)
        rend_html = p.rendered_html or p.raw_html
        rend = parse_html(rend_html, p.url)
        p.text_delta_ratio = text_delta_ratio(p.raw_html, rend_html)

        raw_prices = set(offer_price_strings(raw["main_text"], page_type=p.page_type))
        rend_prices = set(offer_price_strings(rend["main_text"], page_type=p.page_type))
        raw_has_identity = bool(raw["title"] or raw["headings"])
        fact_bearing = p.page_type in FACT_PAGES or bool(rend_prices) or "price" in (p.url + p.title).lower()

        in_raw = True
        in_rendered = True
        notes = []
        if fact_bearing and rend_prices and not raw_prices:
            in_raw = False
            notes.append("prices in rendered/not raw")
            if p.render_status == "skipped" and p.raw_html == p.rendered_html:
                # Cannot prove JS lock without a real render delta
                in_raw = True
                notes.append("render skipped; not claiming JS-lock")
            else:
                f = make_finding(
                    skill_id="render-extract-audit",
                    finding_type="js_fact_lock",
                    title="Decision prices appear only after render, not in raw HTML",
                    severity="critical" if p.page_type in ("pricing", "product", "home") else "high",
                    evidence=f"Raw prices={list(raw_prices)[:3]}; rendered prices={list(rend_prices)[:3]} on {p.url}",
                    action=SuggestedAction(
                        summary="SSR or prerender the prices as visible text in initial HTML.",
                        where=p.url,
                        what="Expose current prices in server-rendered HTML.",
                        how="Move price nodes out of client-only fetch; keep qualifiers in the same sentence.",
                        why="Lightweight crawlers never see client-only amounts.",
                        cost_tier="architecture",
                    ),
                    urls=[p.url],
                    template_id=p.template_id,
                    category="render",
                    evidence_tier="FACT",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)

        # U2: SPA chrome JS but facts in raw — no finding
        # D41: hidden text, no toggle
        if raw["hidden_text"] and not raw["has_toggle"]:
            joined = " ".join(raw["hidden_text"])[:400]
            if looks_like_injection(joined) or PRICE_RE.search(joined) or len(joined) > 80:
                f = make_finding(
                    skill_id="render-extract-audit",
                    finding_type="d41_hidden",
                    title="Text is permanently CSS-hidden with no user-facing reveal control",
                    severity="medium",
                    evidence=f"Hidden sample: {joined[:180]}",
                    action=SuggestedAction(
                        summary="Remove crawler-only hidden text or provide a legitimate reveal control.",
                        where=p.url,
                        why="Permanent hide is cloaking-like and is an injection surface.",
                    ),
                    urls=[p.url],
                    category="render",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)

        # PDF-only
        ctype = p.headers.get("content-type", "")
        if "pdf" in ctype and p.page_type in FACT_PAGES:
            f = make_finding(
                skill_id="render-extract-audit",
                finding_type="pdf_only_fact",
                title="Fact-bearing resource is PDF without an HTML equivalent in the sample",
                severity="medium",
                evidence=f"content-type={ctype} url={p.url}",
                action=SuggestedAction(summary="Provide an HTML equivalent for decision-relevant facts (U9)."),
                urls=[p.url],
                category="render",
            )
            findings.append(f)

        # Image-locked: large img no alt and nearby text lacks prices/offering on product
        for img in raw["images"]:
            alt = (img.get("alt") or "").strip()
            if alt == "":
                continue  # decorative empty alt OK
            if alt.lower() in ("image", "img", "photo") and p.page_type in ("pricing", "product", "home"):
                if not has_offer_price(raw["main_text"], page_type=p.page_type) and "we are" not in raw["main_text"].lower():
                    f = make_finding(
                        skill_id="render-extract-audit",
                        finding_type="image_locked_fact",
                        title="Content-bearing image has non-specific alt and nearby text lacks the fact",
                        severity="medium",
                        evidence=f"alt={alt!r} on {p.url}",
                        action=SuggestedAction(
                            summary="Put the fact in visible text (and a specific alt if the image is the carrier).",
                            where=p.url,
                        ),
                        urls=[p.url],
                        category="render",
                    )
                    findings.append(f)
                    break

        p.extractability_flags = ExtractabilityFlags(
            in_raw=in_raw,
            in_rendered=in_rendered,
            in_visible=True,
            notes="; ".join(notes),
        )
        p.landmarks = raw["landmarks"]

    return SkillResult(
        skill_id="render-extract-audit",
        run_id=snapshot.run_id,
        findings=findings,
        metrics={"flags_set": len(snapshot.fetched_pages())},
        timing_ms=(time.time() - t0) * 1000,
    )
