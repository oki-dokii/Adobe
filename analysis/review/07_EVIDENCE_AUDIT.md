# Phase 7 — Evidence Quality Audit

Ban: “SEO is weak,” “AI may not like this,” “content could be better,” “page is hard to understand,” “will not be cited.”

Every user-facing finding must be reproducible from the crawl snapshot.

| finding_type | Proof | Reject if |
|--------------|-------|-----------|
| robots_fail_closed | robots URL, status 5xx, RFC 9309 | “bots blocked” without status |
| ai_token_disallow | exact `User-agent` + `Disallow` lines | guessed bot list |
| orphan | graph: 0 in-edges; **coverage %** | unfetched labeled orphan |
| js_fact_lock | raw excerpt vs rendered excerpt; selector; fact type | SPA chrome-only delta |
| interaction_insert | rendered still missing; no node until click — if we did not click, say so | assumed click-API |
| d41_hidden | node text + CSS + **no** toggle/aria control | accordion with button |
| pdf_only_fact | content-type; no HTML equivalent on sampled pages | exhibit PDF with HTML summary (U9) |
| image_locked_fact | img without specific alt **and** fact not in nearby text | decorative alt="" |
| qualifier_split | isolated span vs window with qualifier | marketing adjective |
| table_no_th | table HTML | CSS grid “table” without claiming th (note FN) |
| schema_visible_mismatch | JSON-LD value vs visible value | missing schema (U1) |
| comparison_self_win | row tally N/N | no table |
| unanswerable | question id, abstention, **no** supporting span in corpus | LLM answer without quote |
| wrong_page | span exists on URL B; intent page A lacks it | facts only off-site |
| collision_risk | homonym evidence **or** low-confidence on-page-only | “add Organization schema” alone |
| date_divergence | visible vs schema vs Last-Modified vs sitemap | old accurate date |
| temporal_conflict | quote 2019 vs quote 2026 same fact type | history page |
| linked_contradiction | brand span vs fetched sameAs span | unlinked wiki not fetched |
| uncorroborated | list of sources **not** fetched or not found | High severity |
| sttf_fail | claim text vs first N px / details closed | long tutorial body |
| ymy_disclosure | cluster A + claim type + missing reviewer string | non-YMYL |

## Collection rules

- Page-level: URL, final_url, method, timestamp.
- Site-level: template_id, pages_verified, affected_pages_count.
- Cross-source: third_party URL + robots outcome.
- Temporal: all date channels listed even if null.
- Rendered/raw: both excerpts or `render_status`.
- Semantic: allowed enum only; evidence_tier HYP if mechanism unproven (H-02).

## Confidence

high = deterministic reproduced 2+ or RFC. medium = hybrid / single page. low = LLM-only or skipped fetch.

Never 0–100. Never “we measured ChatGPT.”
