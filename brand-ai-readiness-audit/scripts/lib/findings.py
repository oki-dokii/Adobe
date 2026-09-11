"""Finding constructors, keys, confidence helpers."""

from __future__ import annotations

import hashlib
import itertools
from typing import Optional

from lib.models import Finding, SuggestedAction

_id_counter = itertools.count(1)


def reset_ids() -> None:
    global _id_counter
    _id_counter = itertools.count(1)


def next_id() -> str:
    return f"F-{next(_id_counter):03d}"


def finding_key(finding_type: str, template_or_url: str, claim: str) -> str:
    norm = " ".join((claim or "").lower().split())
    raw = f"{finding_type}|{template_or_url}|{norm}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def make_finding(
    *,
    skill_id: str,
    finding_type: str,
    title: str,
    severity: str,
    evidence: str,
    action: SuggestedAction,
    urls: list[str],
    confidence: str = "medium",
    confidence_basis: str = "",
    description: str = "",
    root_cause: str = "",
    category: str = "",
    template_id: Optional[str] = None,
    evidence_tier: str = "OBS",
    parent_id: Optional[str] = None,
    causal_role: str = "root",
) -> Finding:
    url0 = urls[0] if urls else ""
    key_src = template_id or url0
    return Finding(
        id=next_id(),
        title=title,
        severity=severity,
        evidence=evidence,
        suggested_action=action,
        skill_id=skill_id,
        finding_type=finding_type,
        finding_key=finding_key(finding_type, key_src, title + evidence[:80]),
        category=category or skill_id,
        confidence=confidence,
        confidence_basis=confidence_basis,
        evidence_tier=evidence_tier,
        root_cause=root_cause or title,
        description=description or title,
        affected_urls=urls,
        affected_pages_count=max(len(urls), 1),
        template_id=template_id,
        parent_id=parent_id,
        causal_role=causal_role,
        contributing_skills=[skill_id],
    )
