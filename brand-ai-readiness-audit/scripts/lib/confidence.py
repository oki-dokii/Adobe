"""AA-01: confidence from proxies, never a 0–100 verbalization as primary."""

from __future__ import annotations

from lib.models import Finding


def attach_confidence(finding: Finding, *, deterministic: bool, reproduced: bool, rfc: bool = False, llm_only: bool = False) -> Finding:
    if rfc or (deterministic and reproduced):
        finding.confidence = "high"
        finding.confidence_basis = "deterministic reproduced or RFC-grounded"
    elif llm_only:
        finding.confidence = "low"
        finding.confidence_basis = "LLM-only judgment"
    elif deterministic:
        finding.confidence = "medium"
        finding.confidence_basis = "deterministic single page or hybrid"
    else:
        finding.confidence = "low"
        finding.confidence_basis = "heuristic"
    if "%" in finding.confidence_basis and finding.confidence_basis.strip().endswith("%"):
        finding.confidence_basis = "proxy-based; not a calibrated percent"
    return finding
