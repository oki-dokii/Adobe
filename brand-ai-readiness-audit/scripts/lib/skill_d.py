"""SK-D render-extract-audit: flags, JS fact lock, D41, U9/U10."""

from __future__ import annotations

import json
import re
import time

from lib.confidence import attach_confidence
from lib.extract import PRICE_RE, parse_html, text_delta_ratio
from lib.findings import make_finding
from lib.models import CrawlSnapshot, ExtractabilityFlags, SkillResult, SuggestedAction
from lib.money import has_offer_price, offer_price_strings
from lib.sanitize import looks_like_injection

# B-F3: schema types whose transactional fields we check for visible-text parity
_SCHEMA_PARITY_TYPES = frozenset({
    "offer", "product", "organization", "localbusiness",
    "restaurant", "service",
})


def _schema_visible_parity(raw: dict, main_text: str, page_type: str, url: str) -> list:
    """B-F3: detect schema-asserted transactional facts absent from visible text.

    Returns a list of (field_name, schema_value) tuples that are missing from
    main_text. Only checks types known to carry transactional/factual fields.
    No LLM — purely deterministic string matching.
    """
    gaps = []
    for ld_raw in raw.get("json_ld") or []:
        try:
            ld = json.loads(ld_raw) if isinstance(ld_raw, str) else ld_raw
            nodes = [ld] if isinstance(ld, dict) else (ld if isinstance(ld, list) else [])
            for node in nodes:
                if not isinstance(node, dict):
                    continue
                node_type = str(node.get("@type") or "").lower()
                if node_type not in _SCHEMA_PARITY_TYPES:
                    continue
                # Check price
                price_val = node.get("price")
                if price_val and str(price_val).replace(".", "").replace(",", "").isdigit():
                    price_str = str(price_val)
                    # Accept any numeric fragment in visible text (e.g. "$299" matches price="299.00")
                    price_digits = re.sub(r"[^0-9]", "", price_str)[:6]
                    if price_digits and price_digits not in re.sub(r"[^0-9]", "", main_text):
                        gaps.append(("price", price_str))
                # Check address locality
                addr = node.get("address")
                if isinstance(addr, dict):
                    locality = addr.get("addressLocality") or ""
                    street = addr.get("streetAddress") or ""
                    if locality and locality.lower() not in main_text.lower():
                        gaps.append(("address.locality", locality))
                    elif street and not any(
                        tok in main_text.lower()
                        for tok in re.split(r"[\s,]+", street.lower())
                        if len(tok) >= 3
                    ):
                        gaps.append(("address.street", street))
        except Exception:
            pass
    return gaps


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
        elif raw["hidden_text"] and raw["has_toggle"]:
            # interaction_insert: facts inside interactive reveal (e.g. tabs/modals) missing in static visible text
            joined_hidden = " ".join(raw["hidden_text"])
            hidden_prices = set(offer_price_strings(joined_hidden, page_type=p.page_type))
            if hidden_prices and not raw_prices and p.page_type in ("pricing", "product", "home"):
                f = make_finding(
                    skill_id="render-extract-audit",
                    finding_type="interaction_insert",
                    title="Decision facts require user interaction (tabs/modals) to reveal",
                    severity="medium",
                    evidence=f"Prices {list(hidden_prices)[:3]} only in interactive toggle/hidden container on {p.url}",
                    action=SuggestedAction(
                        summary="Ensure core pricing and offering facts are statically visible in the initial DOM.",
                        where=p.url,
                        why="Headless AI crawlers without user interaction click models will miss toggled amounts.",
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

        # Gap 7 (Research B-F3): schema-vs-visible-text parity check
        # Only run on pages that have JSON-LD and are fact-bearing
        if fact_bearing and raw.get("json_ld"):
            gaps = _schema_visible_parity(raw, raw["main_text"] or "", p.page_type, p.url)
            for field, value in gaps[:2]:  # cap to 2 per page
                f = make_finding(
                    skill_id="render-extract-audit",
                    finding_type="schema_only_fact",
                    title=f"Schema-asserted {field} not present in visible text",
                    severity="medium",
                    evidence=(
                        f"JSON-LD asserts {field}={value!r} but this value has no matching "
                        f"string in visible main_text on {p.url}. "
                        "Lightweight crawlers that do not execute schema-only annotation may miss this fact."
                    ),
                    action=SuggestedAction(
                        summary=f"Add a visible text mention of {field} ({value!r}) on this page so the fact is readable without schema parsing.",
                        where=p.url,
                        what=f"Visible text statement of {field}",
                        how=f"Add a line like 'Price: {value}' or 'Located in {value}' in the page body, not only in JSON-LD.",
                        why="B-F3: schema is a reinforcement signal, not a substitute for plain-text extraction; "
                            "crawlers that read schema-only facts have lower extractability confidence.",
                        cost_tier="content",
                    ),
                    urls=[p.url],
                    template_id=p.template_id,
                    category="render",
                    evidence_tier="FACT",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                f.confidence = "medium"
                f.confidence_basis = "Deterministic: JSON-LD field value vs. visible text string comparison; no LLM."
                findings.append(f)

    return SkillResult(
        skill_id="render-extract-audit",
        run_id=snapshot.run_id,
        findings=findings,
        metrics={"flags_set": len(snapshot.fetched_pages())},
        timing_ms=(time.time() - t0) * 1000,
    )
