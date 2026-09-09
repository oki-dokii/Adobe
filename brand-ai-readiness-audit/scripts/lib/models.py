"""Canonical data contracts (LOCKED §7–8)."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Optional


FINDING_TYPES = frozenset(
    {
        "robots_fail_closed",
        "ai_token_disallow",
        "orphan",
        "trap_facet",
        "canonical_dup",
        "soft_404",
        "noindex_robots_conflict",
        "js_fact_lock",
        "interaction_insert",
        "d41_hidden",
        "pdf_only_fact",
        "image_locked_fact",
        "qualifier_split",
        "table_no_th",
        "schema_visible_mismatch",
        "comparison_self_win",
        "unanswerable",
        "wrong_page",
        "expected_gap",
        "flagship_gap",
        "collision_risk",
        "sameas_404",
        "date_divergence",
        "on_site_fact_conflict",
        "linked_contradiction",
        "uncorroborated",
        "viewport_identity",
        "sttf_fail",
        "scent_break",
        "ymy_disclosure",
        "coverage_statement",
    }
)

SEVERITIES = ("critical", "high", "medium", "low")
CONFIDENCES = ("high", "medium", "low")


@dataclass
class ExtractabilityFlags:
    in_raw: bool = True
    in_rendered: bool = True
    in_visible: bool = True
    notes: str = ""


@dataclass
class SuggestedAction:
    summary: str
    priority: str = "medium"
    what: str = ""
    where: str = ""
    how: str = ""
    why: str = ""
    cost_tier: str = "content"
    proactive: bool = False

    def to_public(self) -> dict[str, Any]:
        return {
            "summary": self.summary,
            "priority": self.priority,
            "what": self.what,
            "where": self.where,
            "how": self.how,
            "why": self.why,
        }


@dataclass
class EvidenceItem:
    url: str
    selector_or_offset: str = ""
    extracted_text: str = ""
    extraction_method: str = "static_html"


@dataclass
class Finding:
    id: str
    title: str
    severity: str
    evidence: str
    suggested_action: SuggestedAction
    skill_id: str = ""
    finding_type: str = ""
    finding_key: str = ""
    category: str = ""
    confidence: str = "medium"
    confidence_basis: str = ""
    evidence_tier: str = "OBS"
    root_cause: str = ""
    description: str = ""
    evidence_items: list[EvidenceItem] = field(default_factory=list)
    affected_urls: list[str] = field(default_factory=list)
    affected_pages_count: int = 1
    template_id: Optional[str] = None
    parent_id: Optional[str] = None
    causal_role: str = "root"
    admission: dict[str, str] = field(default_factory=lambda: {"emitted": "emitted", "rule": ""})
    suppressed: bool = False
    suppress_reason: str = ""
    materiality: str = "pass"
    contributing_skills: list[str] = field(default_factory=list)
    metrics: dict[str, Any] = field(default_factory=dict)
    status: str = "found"

    def to_handout(self) -> dict[str, Any]:
        sa = self.suggested_action
        action: Any
        if isinstance(sa, SuggestedAction):
            action = {
                "summary": sa.summary,
                "priority": sa.priority,
            }
        elif isinstance(sa, dict):
            action = {
                "summary": sa.get("summary", str(sa)),
                "priority": sa.get("priority", "medium"),
            }
        else:
            action = {
                "summary": str(sa),
                "priority": "medium",
            }
        return {
            "id": self.id,
            "title": self.title,
            "severity": self.severity,
            "evidence": self.evidence,
            "suggested_action": action,
        }

    def to_internal(self) -> dict[str, Any]:
        d = asdict(self)
        return d


@dataclass
class SkillError:
    code: str
    message: str
    recoverable: bool = True
    error_type: str = ""
    dependencies_affected: list[str] = field(default_factory=list)


@dataclass
class SkillFailure:
    skill_id: str
    status: str
    error_type: str
    message: str
    recoverable: bool = True
    dependencies_affected: list[str] = field(default_factory=list)


@dataclass
class SkillResult:
    skill_id: str
    run_id: str
    status: str = "ok"
    findings: list[Finding] = field(default_factory=list)
    metrics: dict[str, Any] = field(default_factory=dict)
    errors: list[SkillError] = field(default_factory=list)
    timing_ms: float = 0.0
    deadline_honored: bool = True

    def to_dict(self) -> dict[str, Any]:
        return {
            "skill_id": self.skill_id,
            "run_id": self.run_id,
            "status": self.status,
            "findings": [f.to_internal() for f in self.findings],
            "metrics": self.metrics,
            "errors": [asdict(e) for e in self.errors],
            "timing_ms": self.timing_ms,
            "deadline_honored": self.deadline_honored,
        }


@dataclass
class Page:
    id: str
    url: str
    final_url: str
    status: int = 0
    redirect_hops: int = 0
    template_id: str = ""
    page_type: str = "other"
    raw_html: str = ""
    rendered_html: str = ""
    headers: dict[str, str] = field(default_factory=dict)
    language: str = "en"
    robots_meta: str = ""
    canonical: str = ""
    content_simhash: int = 0
    unfetched: bool = False
    extractability_flags: ExtractabilityFlags = field(default_factory=ExtractabilityFlags)
    render_status: str = "skipped"
    text_delta_ratio: float = 0.0
    title: str = ""
    main_text: str = ""
    headings: list[dict[str, Any]] = field(default_factory=list)
    landmarks: dict[str, bool] = field(default_factory=dict)
    dates: dict[str, Any] = field(default_factory=dict)
    json_ld: list[Any] = field(default_factory=list)
    tables: list[dict[str, Any]] = field(default_factory=list)
    out_links: list[str] = field(default_factory=list)
    in_degree: int = 0
    depth: int = 0
    fetch_error: str = ""
    timing_ms: float = 0.0
    access_kind: str = "ok"
    content_usable: bool = True


@dataclass
class Fact:
    id: str
    type: str
    value: str
    url: str
    span: str = ""
    qualifiers: list[str] = field(default_factory=list)
    freshness_sensitive: bool = False
    as_of: Optional[str] = None
    page_ids: list[str] = field(default_factory=list)


@dataclass
class Entity:
    name: str
    aliases: list[str] = field(default_factory=list)
    type: str = "Organization"
    same_as: list[str] = field(default_factory=list)
    disambiguators: dict[str, str] = field(default_factory=dict)
    collision_risk: str = "low"
    collision_evidence: list[str] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)


@dataclass
class SiteType:
    cluster: str = "unknown"
    secondary: list[str] = field(default_factory=list)
    ymyl: bool = False
    multilingual: bool = False
    product_like: bool = False
    ecommerce: bool = False
    saas: bool = False
    confidence: str = "medium"
    votes: dict[str, int] = field(default_factory=dict)


@dataclass
class TimingLog:
    crawl_ms: float = 0.0
    render_ms: float = 0.0
    extraction_ms: float = 0.0
    skill_ms: dict[str, float] = field(default_factory=dict)
    llm_ms: float = 0.0
    llm_calls: int = 0
    external_fetch_ms: float = 0.0
    merge_ms: float = 0.0
    report_ms: float = 0.0
    total_ms: float = 0.0
    skipped: list[str] = field(default_factory=list)
    http_requests: int = 0
    pages_fetched: int = 0
    pages_rendered: int = 0
    render_count: int = 0
    external_requests: int = 0


@dataclass
class CrawlSnapshot:
    run_id: str
    seed_url: str
    origins: list[str]
    robots_status: str = "missing"
    robots_body: str = ""
    coverage: dict[str, Any] = field(default_factory=dict)
    pages: list[Page] = field(default_factory=list)
    graph: dict[str, Any] = field(default_factory=dict)
    site_type: SiteType = field(default_factory=SiteType)
    facts: list[Fact] = field(default_factory=list)
    entities: list[Entity] = field(default_factory=list)
    claims: list[dict[str, Any]] = field(default_factory=list)
    timing: TimingLog = field(default_factory=TimingLog)
    limitations: list[str] = field(default_factory=list)
    skipped_skills: list[str] = field(default_factory=list)
    deadline_ts: float = 0.0
    errors: list[dict[str, str]] = field(default_factory=list)
    skill_failures: list[SkillFailure] = field(default_factory=list)

    def page_by_url(self, url: str) -> Optional[Page]:
        for p in self.pages:
            if p.url == url or p.final_url == url:
                return p
        return None

    def fetched_pages(self) -> list[Page]:
        return [
            p
            for p in self.pages
            if not p.unfetched and p.content_usable and p.status and p.status < 400
        ]

    def corpus_text(self) -> str:
        return "\n".join(p.main_text or p.title for p in self.fetched_pages())
