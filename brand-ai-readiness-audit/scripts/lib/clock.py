"""Wall-clock budget and skip-ladder (LOCKED §10)."""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from urllib.parse import urlparse


PROTECT_LIST = frozenset(
    {
        "site-type-classifier",
        "dual-fetch-facts",
        "citation-extractability-audit-det",
        "K3",
        "admit",
        "coverage",
        "report",
    }
)

PROTECTED_PATH_SEGMENTS = frozenset(
    {"pricing", "price", "prices", "about", "about-us", "aboutus", "contact"}
)


@dataclass
class SkipPlan:
    run_h: bool
    k_ids: list[str]
    cit_llm: bool
    render_max: int
    skipped: list[str]
    protected: frozenset[str] = PROTECT_LIST


def plan_skip_ladder(clock: "Clock", *, render_max_default: int = 10) -> SkipPlan:
    """Drop first → last per LOCKED §10. Never drop PROTECT_LIST items."""
    skipped: list[str] = []
    run_h = clock.can_run_h()
    if not run_h:
        skipped.append("corroboration-consistency-audit")
    if clock.remaining() < 80:
        k_ids = ["K3"]
        skipped.append("k_subset")
    else:
        k_ids = ["K3", "K6", "K13"]
    if "K3" not in k_ids:
        k_ids = ["K3"] + k_ids
    cit_llm = clock.remaining() > 90
    if not cit_llm:
        skipped.append("citation-llm")
    render_max = render_max_default
    if clock.remaining() < 40:
        render_max = min(4, render_max_default)
        skipped.append("reduce_renders")
    assert "K3" in k_ids
    assert "site-type-classifier" in PROTECT_LIST
    return SkipPlan(
        run_h=run_h,
        k_ids=k_ids,
        cit_llm=cit_llm,
        render_max=render_max,
        skipped=skipped,
        protected=PROTECT_LIST,
    )


def is_protected_fact_url(url: str, seed: str) -> bool:
    """Priority only: seed + path segments. Must not substring-match hosts."""
    if (url or "").rstrip("/") == (seed or "").rstrip("/"):
        return True
    path = (urlparse(url).path or "/").lower()
    segs = [s for s in path.split("/") if s]
    return any(s in PROTECTED_PATH_SEGMENTS for s in segs)


@dataclass
class Clock:
    start: float
    deadline_ts: float
    skipped: list[str] = field(default_factory=list)
    T_h: float = 45.0

    @classmethod
    def start_run(cls, max_seconds: float = 280.0, t_h: float = 45.0) -> "Clock":
        now = time.time()
        return cls(start=now, deadline_ts=now + max_seconds, T_h=t_h)

    def remaining(self) -> float:
        return self.deadline_ts - time.time()

    def elapsed_ms(self) -> float:
        return (time.time() - self.start) * 1000

    def honor(self, min_needed: float = 1.0) -> bool:
        return self.remaining() >= min_needed

    def can_run_h(self) -> bool:
        return self.remaining() >= self.T_h

    def plan(self, render_max_default: int = 10) -> SkipPlan:
        return plan_skip_ladder(self, render_max_default=render_max_default)
