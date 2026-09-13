"""Structural and honesty checks for the production causal-chain contract."""

from pathlib import Path

from lib.models import FINDING_TYPES

SOURCE = Path(__file__).resolve().parents[2] / "frontend/lib/audit/causal-chains.ts"


def test_all_finding_types_have_causal_chain_entries():
    source = SOURCE.read_text(encoding="utf-8")
    for finding_type in FINDING_TYPES:
        assert f"  {finding_type}: [" in source, finding_type


def test_causal_chain_entries_have_three_steps():
    source = SOURCE.read_text(encoding="utf-8")
    assert source.count("  robots_fail_closed: [") == 1
    assert source.count("  transport_unreachable: [") == 1
    assert source.count("  robots_disallow: [") == 1


def test_canonical_dup_not_robots_blocked():
    source = SOURCE.read_text(encoding="utf-8").lower()
    start = source.index("  canonical_dup: [")
    end = source.index("  soft_404: [", start)
    chain = source[start:end]
    assert "canonical" in chain
    assert "robots.txt" not in chain


def test_production_causal_chains_do_not_claim_unobserved_ai_behavior():
    source = SOURCE.read_text(encoding="utf-8").lower()
    forbidden = (
        "purge the domain",
        "recommend accessible alternatives",
        "models hallucinate",
        "substitute competitor answers",
        "refuse to synthesize guidance",
        "zero engagement",
    )
    for phrase in forbidden:
        assert phrase not in source, phrase
    assert "may lower the likelihood" in source
