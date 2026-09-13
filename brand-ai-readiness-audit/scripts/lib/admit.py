"""Executable U13–U18 admission + U1–U12 table (LOCKED)."""

from __future__ import annotations

from lib.models import Finding, SiteType


TEMPLATE_LEVEL_FINDINGS = {"canonical_dup", "date_divergence", "scent_break", "orphan"}


def admit(
    finding: Finding,
    site_type: SiteType,
    pages_verified: int = 1,
    coverage_pct: float | None = None,
    *,
    sampled_pages: int | None = None,
    template_ids: set[str] | None = None,
) -> Finding:
    """Return finding with admission emitted|suppressed. Never silent drop."""
    if finding.status == "insufficient_evidence" or not (finding.evidence or "").strip():
        finding.status = "insufficient_evidence"
        finding.suppressed = True
        finding.suppress_reason = "U14_minimum_evidence"
        finding.admission = {"emitted": "suppressed", "rule": "U14"}
        return finding

    ft = finding.finding_type
    cluster = site_type.cluster
    secondary = set(site_type.secondary)

    if finding.materiality == "fail" and finding.severity in ("critical", "high"):
        finding.severity = "low"

    # A template-level claim is allowed above MEDIUM only when the sample is
    # broad enough to support generalization: three distinct templates or at
    # least 30% of sampled pages affected. Smaller samples remain actionable,
    # but are explicitly capped to avoid presenting local evidence as a
    # site-wide conclusion.
    if ft in TEMPLATE_LEVEL_FINDINGS and finding.severity in ("critical", "high"):
        distinct_templates = len(template_ids or set())
        affected_ratio = (
            finding.affected_pages_count / sampled_pages
            if sampled_pages and finding.affected_pages_count
            else 0.0
        )
        if distinct_templates < 3 and affected_ratio < 0.30:
            raw = finding.severity
            finding.severity = "medium"
            finding.evidence = (
                f"{finding.evidence} Coverage gate capped raw {raw.upper()} to MEDIUM: "
                f"{distinct_templates} distinct template(s), "
                f"{finding.affected_pages_count}/{sampled_pages or 0} sampled pages affected; "
                "threshold is 3 templates or >=30% of the sample."
            )
            finding.confidence = "medium"
            finding.confidence_basis = "coverage-gated template-level claim"

    # U1 missing schema is never this finding_type; schema_visible_mismatch is OK
    if ft == "schema_visible_mismatch" and "good prose" in (finding.evidence or "").lower() and "mismatch" not in finding.evidence.lower():
        finding.suppressed = True
        finding.suppress_reason = "U1"
        finding.admission = {"emitted": "suppressed", "rule": "U1"}
        return finding

    # U3 thin-by-design directories: stable question_id, not title substring
    qid = (finding.metrics or {}).get("question_id")
    if cluster in ("B",) and ft == "unanswerable" and qid in ("K3", "K4"):
        finding.suppressed = True
        finding.suppress_reason = "U3"
        finding.admission = {"emitted": "suppressed", "rule": "U3"}
        return finding

    # U6 evergreen / docs
    if (cluster == "D" or "D" in secondary) and ft == "date_divergence" and finding.severity in ("high", "critical"):
        finding.severity = "low"
        finding.suppress_reason = "U6_docs_evergreen_cap"
        # still emit at low

    # U8 robots disallow of junk — only suppress orphan/trap on cart/search
    if ft in ("ai_token_disallow", "orphan", "trap_facet") and _only_junk_paths(finding):
        finding.suppressed = True
        finding.suppress_reason = "U8"
        finding.admission = {"emitted": "suppressed", "rule": "U8"}
        return finding

    # Sparse crawl: orphans are coverage artifacts, not proven isolation.
    if ft == "orphan" and coverage_pct is not None and coverage_pct < 0.35:
        finding.suppressed = True
        finding.suppress_reason = "U16_coverage_artifact"
        finding.admission = {"emitted": "suppressed", "rule": "U16"}
        return finding

    # U5 news syndication not a defect for duplicate-like claims
    if cluster == "E" and ft == "on_site_fact_conflict" and "syndication" in (finding.evidence or "").lower():
        finding.suppressed = True
        finding.suppress_reason = "U5"
        finding.admission = {"emitted": "suppressed", "rule": "U5"}
        return finding

    # U12 non-citation claims
    if "not cited" in finding.title.lower() or "zero citation" in finding.title.lower():
        finding.suppressed = True
        finding.suppress_reason = "U12"
        finding.admission = {"emitted": "suppressed", "rule": "U12"}
        return finding

    # V-F SaaS public price
    if ft == "unanswerable" and ("pric" in finding.title.lower() or "K6" in finding.evidence):
        if site_type.saas and not site_type.ecommerce:
            if "quote" in (finding.evidence or "").lower() or "contact" in (finding.evidence or "").lower():
                finding.suppressed = True
                finding.suppress_reason = "V-F"
                finding.admission = {"emitted": "suppressed", "rule": "V-F"}
                return finding

    # U16 site-wide language without 2–3 confirms
    if finding.affected_pages_count > 5 and pages_verified < 2 and "site-wide" in (finding.evidence or "").lower():
        finding.evidence = finding.evidence + " (sampled; not confirmed site-wide; U16)"
        finding.confidence = "low"
        finding.confidence_basis = "U16 sampling"

    # U9 PDF: skill should already gate; if exhibit mentioned, suppress pdf_only
    if ft == "pdf_only_fact" and "exhibit" in (finding.evidence or "").lower():
        finding.suppressed = True
        finding.suppress_reason = "U9"
        finding.admission = {"emitted": "suppressed", "rule": "U9"}
        return finding

    # U10 decorative images
    if ft == "image_locked_fact" and finding.materiality == "fail":
        finding.suppressed = True
        finding.suppress_reason = "U10"
        finding.admission = {"emitted": "suppressed", "rule": "U10"}
        return finding

    # Unknown cluster: do not suppress pricing
    if cluster == "unknown" and finding.suppress_reason.startswith("V-F"):
        finding.suppressed = False
        finding.suppress_reason = ""

    finding.admission = {"emitted": "emitted", "rule": ""}
    return finding


def _only_junk_paths(finding: Finding) -> bool:
    junk = ("/cart", "/search", "/admin", "/login", "/checkout", "/wishlist", "/account")
    urls = finding.affected_urls or []
    return bool(urls) and all(any(j in u.lower() for j in junk) for u in urls)
