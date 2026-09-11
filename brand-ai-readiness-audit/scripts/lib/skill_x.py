"""SK-X engagement-handoff — in-DOM visibility, not missing-from-DOM."""

from __future__ import annotations

import re
import time

from lib.confidence import attach_confidence
from lib.extract import parse_html
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    findings = []
    pages = snapshot.fetched_pages()
    home = next((p for p in pages if p.page_type == "home"), pages[0] if pages else None)
    if home:
        parsed = parse_html(home.raw_html, home.url)
        first = parsed["main_text"][:400].lower()
        ident = (home.title or "").split("|")[0].strip()
        if ident and ident.lower() not in first and not any(h["level"] == 1 for h in parsed["headings"]):
            f = make_finding(
                skill_id="engagement-handoff-audit",
                finding_type="viewport_identity",
                title="First viewport text may not identify the brand",
                severity="medium",
                evidence=f"Title {ident!r} not in first 400 chars; no H1. Heuristic 640×700 not device-tested.",
                action=SuggestedAction(
                    summary="Place brand + category in the first viewport as visible text.",
                    where=home.url,
                ),
                urls=[home.url],
                category="engagement",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            findings.append(f)
        # breadcrumbs: skip one-pager
        if len(pages) > 3 and not parsed["breadcrumb"] and not parsed["landmarks"].get("nav"):
            f = make_finding(
                skill_id="engagement-handoff-audit",
                finding_type="scent_break",
                title="Deep-ish site sample lacks breadcrumbs and nav landmark",
                severity="low",
                evidence="No breadcrumb/nav landmark on home; not required on a true one-pager.",
                action=SuggestedAction(summary="Provide persistent wayfinding (nav or breadcrumbs) on hierarchical sites."),
                urls=[home.url],
                category="engagement",
            )
            findings.append(f)
        else:
            nav = " ".join(parsed.get("nav_texts") or []).lower()
            home_blob = first + " " + nav
            types = {p.page_type for p in pages}
            if "pricing" in types and not re.search(r"\b(pric|plan|shop|buy|product|cart)\w*\b", home_blob):
                f = make_finding(
                    skill_id="engagement-handoff-audit",
                    finding_type="scent_break",
                    title="Commercial page exists but home/nav does not point to it",
                    severity="low",
                    evidence="A pricing-classified URL was crawled, but home/nav lacks commercial wayfinding terms.",
                    action=SuggestedAction(
                        summary="Link pricing/plans from the landing page so cited users can recover commercial intent.",
                        where=home.url,
                    ),
                    urls=[home.url],
                    category="engagement",
                )
                findings.append(f)
            elif "contact" in types and not re.search(r"\b(contact|email|support|connect)\b", home_blob):
                f = make_finding(
                    skill_id="engagement-handoff-audit",
                    finding_type="scent_break",
                    title="Contact page exists but home/nav does not point to it",
                    severity="low",
                    evidence="A contact-classified URL was crawled, but home/nav lacks contact wayfinding terms.",
                    action=SuggestedAction(
                        summary="Link contact or support from the landing page so cited users can recover the conversation.",
                        where=home.url,
                    ),
                    urls=[home.url],
                    category="engagement",
                )
                findings.append(f)

    for p in pages:
        parsed = parse_html(p.raw_html, p.url)
        closed = " ".join(parsed["closed_details_text"])
        visible = parsed["main_text"]
        fired = False
        for claim in snapshot.claims[:8]:
            if claim.get("url") not in (p.url, p.final_url):
                continue
            txt = claim.get("text") or ""
            if txt and txt in closed and txt not in visible:
                f = make_finding(
                    skill_id="engagement-handoff-audit",
                    finding_type="sttf_fail",
                    title="Cited-like fact sits in a closed accordion (in DOM, not user-visible)",
                    severity="high",
                    evidence=f"{txt!r} inside closed <details> on {p.url}",
                    action=SuggestedAction(
                        summary="Keep central claims visible without requiring a click (trivia may stay collapsed).",
                        where=p.url,
                    ),
                    urls=[p.url],
                    category="engagement",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)
                fired = True
                break
        if not fired:
            from lib.money import has_offer_price

            if has_offer_price(closed) and not has_offer_price(visible):
                f = make_finding(
                    skill_id="engagement-handoff-audit",
                    finding_type="sttf_fail",
                    title="Cited-like fact sits in a closed accordion (in DOM, not user-visible)",
                    severity="high",
                    evidence=f"Price tokens in closed <details> but not default-visible text on {p.url}",
                    action=SuggestedAction(
                        summary="Keep central claims visible without requiring a click (trivia may stay collapsed).",
                        where=p.url,
                    ),
                    urls=[p.url],
                    category="engagement",
                )
                attach_confidence(f, deterministic=True, reproduced=False)
                findings.append(f)
    return SkillResult("engagement-handoff-audit", snapshot.run_id, findings=findings, timing_ms=(time.time() - t0) * 1000)
