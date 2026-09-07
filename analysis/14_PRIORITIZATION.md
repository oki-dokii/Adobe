# Phase 15 — Severity & Prioritization

Dimensions **supported by research only**:

1. **Impact if true** (AI invisibility / misquote harm / engagement abandon)
2. **Evidence/confidence** (independent of 1) — S-01, AA-01
3. **Materiality** — P-03 two-axis gate
4. **Causal leverage** — T (one template fix vs one page)
5. **Blast radius** — affected_pages_count / template
6. **Remediation cost_tier** — Z-G markup < content < architecture
7. **Site-type stakes** — V YMYL ceiling; V-F pricing norms

Do **not** use: domain Authority Score, GEO 40%, verbalized 0–100, CVSS numeric formula.

## Severity (impact)

| Level | When |
|-------|------|
| critical | Total access failure; fail-closed robots; core identity/price/legal **fact-bearing** JS-lock or misquote risk |
| high | Collision+no disambiguation; internal stale contradiction on decision facts; cited claim not visible on landing; missing K3 offering |
| medium | Date-signal inconsistency; weak scent; table without th; AI bots disallowed but Googlebot allowed (explain) |
| low | Missing OG; missing schema with good prose; missing breadcrumbs on hierarchical site |

**Materiality:** if not objectively verifiable or not decision-relevant → cap **low**.

**YMYL:** missing required disclosure can be **high** only if cluster A.

## Confidence (not blended into severity)

| Tier | Basis |
|------|-------|
| high | Deterministic + reproduced on 2+ URLs or RFC-grounded |
| medium | Hybrid; single page; dual-fetch without render confirm |
| low | LLM-only; off-site incomplete; hypothesis-tier mechanism |

## Priority for suggested_action

```
priority_score =
  sev_weight[severity]
  * (1 + 0.15 * extra_contributing_skills)
  * blast_radius_factor
  / cost_penalty[cost_tier]
```

Then **two buckets** (AB): Quick wins (markup/content, high score) vs Strategic (architecture).

Cheap high-severity beats expensive equal-severity (Z-G).

Jointly-necessary cluster: severity = **max** of members (S composite), not average.
