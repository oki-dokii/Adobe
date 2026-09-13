"""SK-K closed-book answerability — span required; unanswerable vs wrong_page vs expected_gap."""

from __future__ import annotations

import re
import time

from lib.confidence import attach_confidence
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.money import first_offer_window, has_offer_price

# K9/K10 are expected gaps, not defects.
# Function-word objects after "we make" are not offerings (grammar, not a site list).
_K3_MAKE_NOT_OFFER = (
    r"progress|sure|sense|clear|known|available|use|up|out|it|this|that|them|way|good"
)

K3_OFFERING = re.compile(
    r"\bwe are (?:a|an)\s+(?!service\b)([a-z][a-z0-9-]{2,}(?:\s+[a-z0-9-]{2,}){0,8})"
    r"|\bwe (?:provide|offer|build|sell)\s+(?!service\b)([a-z][a-z0-9-]{2,}(?:\s+[a-z0-9-]{2,}){0,8})"
    r"|\bwe help\s+[a-z][\w\s,-]{8,80}"
    r"|\bwe make\s+(?!" + _K3_MAKE_NOT_OFFER + r"\b)(?!service\b)([a-z][a-z0-9-]{2,}(?:\s+[a-z0-9-]{2,}){0,6})",
    re.I,
)

# Syntactic identity. No product/vertical catalogs — new sites should match the same grammar.
K3_IDENTITY = [
    re.compile(r"\bI(?:'m| am)\s+(?:a|an)\s+(?!service\b)[a-z][a-z0-9-]{2,}", re.I),
    re.compile(
        r"\b(?:is|are)\s+(?:a|an|the)\s+(?!service\b)([a-z][a-z0-9-]{2,}(?:\s+[a-z0-9-]{2,}){0,8})",
        re.I,
    ),
    re.compile(r"\b(?:transform|converts?|turns?)\s+.{6,80}?\s+into\s+", re.I),
    re.compile(r"\bhelps?\s+you\s+(?!need\b|want\b|get\b|have\b)[a-z]{3,}", re.I),
    re.compile(r"\bthe [a-z]{3,} for [a-z]{3,}", re.I),
    re.compile(r"\bwe (?:run|maintain|create|operate)\s+(?!service\b)[a-z]{3,}", re.I),
    re.compile(r"\b(?:platform|infrastructure|framework|solution|cloud)\s+(?:for|to|that)\s+[a-z]{3,}", re.I),
    re.compile(r"\b(?:build|deploy|create|scale|manage|run)\s+[a-z\s,-]{3,30}\s+(?:with|on|for)\b", re.I),
    re.compile(r"\bthe (?:all-in-one|unified|enterprise|developer|modern)\s+[a-z]{3,}", re.I),
    re.compile(r"\b(?:financial|developer|agentic|cloud)\s+infrastructure\b", re.I),
    re.compile(r"\b(?:software|tools?|suite|engine|app|editor|system)\s+(?:for|to|that)\s+[a-z]{3,}", re.I),
    re.compile(r"\b(?:designed|built|crafted|made)\s+for\s+[a-z]{3,}", re.I),
    re.compile(r"\beverything you need to\s+[a-z]{3,}", re.I),
    re.compile(r"\b[a-z]{3,}\s+tools?\s+for\s+[a-z]{3,}", re.I),
]

# Clusters where "what does it cost?" is usually the wrong question.
_K6_GAP_CLUSTERS = frozenset({"A", "C", "D", "E", "unknown"})


def k3_span(text: str, meta_desc: str = "") -> str | None:
    blob = text or ""
    hit = _find_span(blob, [K3_OFFERING.pattern])
    if hit:
        return hit
    for pat in K3_IDENTITY:
        m = pat.search(blob)
        if m:
            i = max(0, m.start() - 40)
            return blob[i : m.end() + 40]
    if meta_desc:
        m_hit = _find_span(meta_desc, [K3_OFFERING.pattern])
        if m_hit:
            return m_hit
        for pat in K3_IDENTITY:
            m = pat.search(meta_desc)
            if m:
                i = max(0, m.start() - 40)
                return meta_desc[i : m.end() + 40]
    return None


def k6_is_expected_gap(site_type) -> bool:
    cluster = getattr(site_type, "cluster", "") or "unknown"
    secondary = set(getattr(site_type, "secondary", None) or [])
    # News / docs / gov / YMYL advice: cost is the wrong closed-book question.
    if cluster in ("A", "C", "D", "E"):
        return True
    if getattr(site_type, "saas", False) or getattr(site_type, "ecommerce", False):
        return False
    if cluster == "F" or "F" in secondary:
        return False
    return cluster in _K6_GAP_CLUSTERS or bool(secondary & {"A", "C", "D", "E"})


QUESTIONS = [
    {"id": "K3", "q": "What does this organization offer or do?", "pats": [K3_OFFERING.pattern], "home_pref": True},
    {"id": "K6", "q": "What does it cost / how is it priced?", "pats": [r"contact .+ quote", r"request a quote", r"talk to sales"], "home_pref": False},
    {"id": "K13", "q": "How can a human contact the organization?", "pats": [r"@\w+\.\w+", r"\bcontact\b", r"\bemail\b", r"\bphone\b"], "home_pref": False},
    {
        "id": "K4",
        "q": "Who is the intended audience?",
        "pats": [
            r"\bfor (teams|developers|enterprises|small businesses|clinicians|customers|users|organizations|businesses|students)\b",
            r"\bbuilt for\b",
            r"\bdesigned for\b",
        ],
        "home_pref": False,
        "gap_clusters": ("B",),
    },
    {
        "id": "K5",
        "q": "Where is this organization based or serving?",
        "pats": [
            r"\bheadquarter",
            r"\bbased in\b",
            r"\boffices? in\b",
            r"\blocated in\b",
            r"\bwe are a .{3,50} in [A-Z][a-z]{2,}",
        ],
        "home_pref": False,
        "gap_clusters": ("B", "D", "E"),
    },
    {"id": "K10", "q": "Who are the competitors?", "pats": [r"\bvs\.?\b", r"alternative"], "expected_gap": True},
    {"id": "K9", "q": "Awards and rankings", "pats": [r"\baward\b", r"\b#1\b"], "expected_gap": True},
]


def question_is_expected_gap(spec: dict, site_type) -> bool:
    if spec.get("expected_gap"):
        return True
    if spec["id"] == "K6" and k6_is_expected_gap(site_type):
        return True
    clusters = set(spec.get("gap_clusters") or ())
    if not clusters:
        return False
    cluster = getattr(site_type, "cluster", "") or "unknown"
    secondary = set(getattr(site_type, "secondary", None) or [])
    return cluster in clusters or bool(secondary & clusters)


def _find_span(text: str, pats: list[str]) -> str | None:
    for pat in pats:
        m = re.search(pat, text, re.I)
        if m:
            i = max(0, m.start() - 40)
            return text[i : m.end() + 40]
    return None


def run(snapshot: CrawlSnapshot, question_ids: list[str] | None = None) -> SkillResult:
    t0 = time.time()
    findings = []
    per_q = {}
    pages = snapshot.fetched_pages()
    if not pages:
        t_ms = (time.time() - t0) * 1000
        blocked = [p for p in snapshot.pages if not p.unfetched and not p.content_usable]
        kinds = sorted({p.access_kind for p in blocked})
        findings = []
        if blocked or not snapshot.fetched_pages():
            f = make_finding(
                skill_id="ai-answerability-audit",
                finding_type="coverage_statement",
                title="Insufficient evidence: no usable public HTML for closed-book questions",
                severity="low",
                evidence=(
                    f"fetched_pages=0; access_kinds={kinds or ['empty_or_unfetched']}; "
                    f"pages={len(snapshot.pages)}. Challenge/WAF/HTTP-error bodies are audit limitations, "
                    "not missing-brand-content."
                ),
                action=SuggestedAction(
                    summary="Treat this origin as inaccessible for this audit; do not infer content gaps from block pages.",
                    priority="low",
                    why="A blocked response is not evidence that the site lacks answers.",
                ),
                urls=[snapshot.seed_url],
                category="answerability",
            )
            f.confidence = "high"
            findings.append(f)
        qset = question_ids or ["K3", "K6", "K13"]
        per_q = {qid: "insufficient" for qid in qset}
        return SkillResult(
            "ai-answerability-audit",
            snapshot.run_id,
            findings=findings,
            metrics={
                "per_question": per_q,
                "CoreAnswerabilityRate": None,
                "AnswerConcentration": 0.0,
                "note": "Abstain: insufficient usable corpus.",
            },
            timing_ms=t_ms,
        )
    home = next((p for p in pages if p.page_type == "home"), pages[0] if pages else None)
    qset = question_ids or ["K3", "K6", "K13"]
    # protect K3
    if "K3" not in qset:
        qset = ["K3"] + list(qset)

    answered_scores = []
    pages_cited = []

    for spec in QUESTIONS:
        if spec["id"] not in qset and spec["id"] not in ("K9", "K10"):
            continue
        if spec["id"] in ("K9", "K10") and spec["id"] not in (question_ids or []):
            # still evaluate expected_gap class if present in full set; default subset skips except we always classify K10 if asked
            if spec["id"] not in qset:
                continue
        hits = []
        for p in pages:
            if not p.extractability_flags.in_raw and spec["id"] == "K6":
                continue
            blob = (p.main_text or "") + " " + p.title
            if spec["id"] == "K6":
                span = first_offer_window(blob, page_type=p.page_type)
                if not span:
                    span = _find_span(blob, spec["pats"])
            elif spec["id"] == "K3":
                if p.page_type == "legal":
                    continue
                meta_desc = ""
                if p.raw_html:
                    for tag in re.findall(r'<meta[^>]+(?:name=["\']description["\']|property=["\']og:description["\'])[^>]+content=["\']([^"\']+)', p.raw_html, re.I):
                        meta_desc = tag.strip()
                        break
                span = k3_span(blob, meta_desc=meta_desc)
            else:
                span = _find_span(blob, spec["pats"])
            if span:
                hits.append((p, span))
        if question_is_expected_gap(spec, snapshot.site_type):
            per_q[spec["id"]] = "expected_gap"
            f = make_finding(
                skill_id="ai-answerability-audit",
                finding_type="expected_gap",
                title=f"{spec['id']} is an expected structural gap, not scored as a defect",
                severity="low",
                evidence=f"Question {spec['q']} — taxonomy excludes this from CoreAnswerabilityRate.",
                action=SuggestedAction(summary="No defect. Do not invent superlatives or competitor attacks.", priority="low"),
                urls=[home.url] if home else [],
                category="answerability",
            )
            f.suppressed = True
            f.suppress_reason = "K_expected_gap"
            f.admission = {"emitted": "suppressed", "rule": "K9/K10/K6_site_type"}
            findings.append(f)
            continue

        if not hits:
            # SaaS quote CTA: still "answered" partial if contact-for-quote
            blob = snapshot.corpus_text().lower()
            if spec["id"] == "K6" and snapshot.site_type.saas and re.search(r"quote|talk to sales|contact .* pric", blob):
                per_q[spec["id"]] = "partial"
                answered_scores.append(0.5)
                continue
            per_q[spec["id"]] = "unanswerable"
            answered_scores.append(0.0)
            sev = "high" if spec["id"] == "K3" else "medium"
            cov_summary = (
                f"pages_fetched={snapshot.coverage.get('pages_fetched', len(snapshot.pages))}, pages_rendered={snapshot.coverage.get('pages_rendered', 0)}"
                if isinstance(snapshot.coverage, dict)
                else str(snapshot.coverage)[:60]
            )
            f = make_finding(
                skill_id="ai-answerability-audit",
                finding_type="unanswerable",
                title=f"Closed-book: site does not answer {spec['id']} ({spec['q']})",
                severity=sev,
                evidence=f"No supporting span in crawled corpus for {spec['id']}. Coverage: {cov_summary}. "
                + ("K6" if spec["id"] == "K6" else ""),
                action=SuggestedAction(
                    summary=f"Add a clear, visible statement answering '{spec['q']}' on the primary landing page.",
                    what=f"Explicit answer to: {spec['q']}",
                    where=home.url if home else (snapshot.seed_url if snapshot else ""),
                    how=f"Add an extractable paragraph or FAQ entry directly addressing {spec['q'].lower()}.",
                    why="Completeness gap: AI assistants cannot synthesize an answer without a direct factual span.",
                ),
                urls=[home.url] if home else [snapshot.seed_url],
                category="answerability",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            f.metrics["question_id"] = spec["id"]
            findings.append(f)
            continue

        # hallucination guard: we only accept regex spans (no LLM answers without span)
        pages_cited.append(len({p.url for p, _ in hits}))
        home_hit = any(p.page_type == "home" for p, _ in hits)
        if spec.get("home_pref") and not home_hit and home:
            per_q[spec["id"]] = "wrong_page"
            answered_scores.append(0.5)
            f = make_finding(
                skill_id="ai-answerability-audit",
                finding_type="wrong_page",
                title=f"{spec['id']} is answered on an inner page, not the likely landing page",
                severity="medium",
                evidence=f"Span on {hits[0][0].url}: {hits[0][1][:160]!r}; homepage lacks it.",
                action=SuggestedAction(
                    summary="Put the answer on the query-landing page or make that inner URL the obvious canonical answer.",
                    where=hits[0][0].url,
                    why="W: right fact, wrong page.",
                ),
                urls=[home.url, hits[0][0].url],
                category="answerability",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            f.metrics["question_id"] = spec["id"]
            findings.append(f)
        else:
            per_q[spec["id"]] = "answered"
            answered_scores.append(1.0)

    # Flagship: V-F product-like with >=2 product URLs
    products = [p for p in pages if p.page_type == "product"]
    if snapshot.site_type.product_like and len(products) >= 2:
        def score(p):
            return (1 if has_offer_price(p.main_text, page_type=p.page_type) else 0) + (1 if p.headings else 0) + min(len(p.main_text) / 500, 3)
        home_s = score(home) if home else 0
        best = max(products, key=score)
        if home and score(best) + 1.5 < home_s and score(best) < 2:
            f = make_finding(
                skill_id="ai-answerability-audit",
                finding_type="flagship_gap",
                title="Product URLs are weaker extractability than the brand home",
                severity="medium",
                evidence=f"home_score={home_s:.1f} product={best.url} score={score(best):.1f}",
                action=SuggestedAction(
                    summary="Strengthen flagship product page facts in HTML; do not listicle-ize the homepage.",
                    where=best.url,
                ),
                urls=[best.url],
                category="answerability",
            )
            findings.append(f)

    applicable = [s for s in answered_scores]
    rate = sum(applicable) / len(applicable) if applicable else None
    conc = sum(pages_cited) / len(pages_cited) if pages_cited else 0.0
    metrics = {
        "per_question": per_q,
        "CoreAnswerabilityRate": rate,
        "AnswerConcentration": conc,
        "note": "Weights uncalibrated; per-question outcomes are primary. Composite citability is not a finding.",
    }
    return SkillResult("ai-answerability-audit", snapshot.run_id, findings=findings, metrics=metrics, timing_ms=(time.time() - t0) * 1000)
