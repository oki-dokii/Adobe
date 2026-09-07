# Phase 14 — Remediation Audit

Forbidden summaries: “Improve SEO,” “Add schema for ChatGPT,” “Get cited more,” “Claim you’re the best,” “Add llms.txt,” “Make a listicle homepage.”

| finding_type | Mechanism-aligned action | Can make worse? |
|--------------|--------------------------|-----------------|
| robots_fail_closed | Fix robots 5xx / hosting | n/a |
| disallow_public_facts | Allow specific citable paths, keep admin disallowed | Opening /search traps |
| orphan | Link from high-centrality hub **named** | Nav soup |
| js_fact_lock | SSR/prerender **those facts** as visible text | SSR entire app unnecessarily |
| interaction_insert | Put fact in initial HTML | Forcing all FAQs open (UX) — only central facts |
| d41_hidden | Remove crawler-only text or provide human reveal | — |
| image_locked | Text equivalent / specific alt if content-bearing | Alt spam decorative |
| qualifier_split | One sentence: amount + condition | 200-word chunking (CX-2) |
| table_no_th | `<th>` / scope | — |
| schema_visible_mismatch | Make markup match **visible** or remove markup | Fabricating properties (G) |
| missing schema + good prose | Optional reinforcement Low | U1 Critical |
| comparison_self_win | Disclose vendor authorship near table | Fake “balanced” rows |
| unanswerable K3 | Add category/offering sentence on intent page | Padding |
| wrong_page | Link/IA: put fact on the page queries land on **or** make that page the canonical answer | Duplicating everywhere |
| K9/K10 missing | No action / informational | Inventing competitor slam |
| collision | “We are a {category} in {geo}” early + accurate sameAs | Fake Wikidata |
| date_divergence | Align signals or drop fake dateModified | Always-today stamp |
| temporal_conflict | Supersede banner on old press; strengthen current | Deleting history |
| linked_contradiction | Update the **stale side** after directionality; don’t assume brand is truth | |
| uncorroborated | Optional claim profiles; not “get PR” | |
| sttf_fail | Keep cited sentence visible (not only accordion) | Destroying progressive disclosure for trivia |
| ymy_disclosure | Name reviewer/jurisdiction | Fake credentials |
| flagship_gap | Strengthen product URL extractability, not brand listicle | AH-list |

Priority: cheap markup/content High-severity before architecture. Joint cluster: one action that fixes parent.
