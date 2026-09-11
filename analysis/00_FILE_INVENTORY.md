# Phase 0 — File Inventory

Workspace root: `/Users/pulkitpandey/Desktop/Adobe`

Expected research Markdown count (from brief): **34**  
Actual research Markdown count found: **34**  
Discrepancy: **none**

No existing marketplace, `SKILL.md`, source code, spreadsheets, or prior architecture documents were present in the workspace at inventory time. The only non-research artifacts were macOS `.DS_Store` files and the Adobe Round 3 handout PDF.

---

## Non-research artifacts

| Path | Type | Apparent purpose | Owner | Research area | Contains |
|------|------|------------------|-------|---------------|----------|
| `6a8ffdf33590a_round3-handout-updated (2).pdf` | PDF | Adobe University Hackathon 2026 Round 3 official handout (authoritative submission requirements, rubric, sample `marketplace.json`, sample report schema, Round 2 appendix) | Adobe | Contest spec | requirements, constraints, illustrative skills, evaluation rubric |
| `.DS_Store` | binary | Finder metadata | n/a | n/a | none |
| `data/.DS_Store` | binary | Finder metadata | n/a | n/a | none |

---

## Research Markdown files (34)

Legend for content flags: R=research, Ev=evidence, H=hypothesis, CS=candidate skill, I=implementation idea, Ex=experiment, Rec=recommendation.

| Path | Type | Apparent purpose | Researcher | Research area | R | Ev | H | CS | I | Ex | Rec |
|------|------|------------------|------------|---------------|---|----|---|----|---|----|-----|
| `data/A_ai_discovery_mechanics.md` | MD | Retrieve→rank→select→generate→cite pipeline; vendor-documented assistant behavior; passage quality; citation competitiveness | Pulkit | A — AI Discovery Mechanics | Y | Y | Y | Y | Y | N | Y |
| `data/B_ai_citation_mechanics (1).md` | MD | Citation-worthiness vs citation-accuracy; schema/live-query dispute; source substitution | Pulkit | B — AI Citation Mechanics | Y | Y | Y | Y | Y | N | Y |
| `data/C_website_crawlability.md` | MD | HTTP/TLS/DNS, robots.txt RFC 9309, sitemaps, canonicals, orphans, faceted nav, crawl budget | Pulkit | C — Website Crawlability | Y | Y | Y | Y | Y | N | Y |
| `data/D_machine_readability_rendering.md` | MD | JS render vs raw HTML; media/PDF; landmarks; Google AI-optimization mythbusting | Pulkit | D — Machine Readability / Rendering | Y | Y | Y | Y | Y | N | Y |
| `data/E_content_extraction_information_architecture.md` | MD | Fact/qualifier extraction taxonomy; tables; negation scope | Pulkit | E — Content Extraction & IA | Y | Y | Y | Y | Y | N | Y |
| `data/I_freshness_staleness_temporal_consistency.md` | MD | Date-signal credibility; QDF; knowledge-conflict / stale syndication | Pulkit | I — Freshness | Y | Y | Y | Y | Y | N | Y |
| `data/K_ai_answerability.md` | MD | Closed-book QA protocol; question taxonomy; HotpotQA/SQuAD 2.0 methodology | Pulkit | K — AI Answerability | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_F_Entity_Recognition_Resolution.md` | MD | Name collision (WhoQA); aliases; `sameAs`; GEO commercial-content unreliability | Harsh | F — Entity Recognition & Resolution | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_G_Structured_Data_Semantic_Web.md` | MD | Schema validity, schema↔visible-text agreement (not “more schema = better AI”) | Harsh | G — Structured Data | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_H_Trust_Authority_Corroboration.md` | MD | Independent corroboration; mechanism vs proven citation impact | Harsh | H — Trust / Authority | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_J_Content_Quality_Knowledge_Density.md` | MD | Specificity vs genericness; thin/duplicate content | Harsh | J — Content Quality | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_L_Technical_Discovery_Signals.md` | MD | Titles/canonicals/internal links scoped only where AI-mechanism exists | Harsh | L — Technical Discovery Signals | Y | Y | Y | N | Y | N | Y |
| `data/Topic_M_Onsite_Engagement.md` | MD | First viewport orientation; information scent; AI-referral landing | Harsh | M — On-site Engagement | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_N_Accessibility_AI_Human_Readability.md` | MD | Alt text / landmarks as shared AT + machine-readability infrastructure | Harsh | N — Accessibility | Y | Y | Y | N | Y | N | Y |
| `data/Topic_O_Performance_Technical_Experience.md` | MD | Core Web Vitals only where non-redundant with render/engagement | Harsh | O — Performance | Y | Y | Y | N | Y | N | Y |
| `data/Topic_P_Cross_Web_Consistency.md` | MD | On-site vs third-party fact consistency; materiality taxonomy | Harsh | P — Cross-Web Consistency | Y | Y | Y | Y | Y | N | Y |
| `data/Topic_S_Scoring_Severity.md` | MD | Severity/confidence/materiality/causal-structure schema (orchestrator) | Harsh | S — Scoring & Severity | Y | Y | Y | N | Y | N | Y |
| `data/Topic_T_Root_Cause_Analysis.md` | MD | Symptom vs cause; jointly-necessary clusters; finding merge | Harsh | T — Root-Cause Analysis | Y | Y | Y | N | Y | N | Y |
| `data/Q_competitive_intelligence_learn_from_wild.md` | MD | Field-research methodology; not a runtime skill | Pulkit | Q — Competitive Intelligence | Y | Y | Y | N | Y | Y | Y |
| `data/R_experiment_design_measurement.md` | MD | How to measure AI citation without invalid live-query designs | Pulkit | R — Experiment Design | Y | Y | Y | N | Y | Y | Y |
| `data/topic_v_site_type_differentiation (1).md` | MD | Six site-type clusters + multilingual axis; live-site empirical correction | Soham | V — Site-Type Differentiation | Y | Y | Y | Y | Y | Y | Y |
| `data/topic_w_query_page_matching.md` | MD | Intent/query → page alignment; comparison-page win-rate | Soham | W — Query→Page Matching | Y | Y | Y | Y | Y | N | Y |
| `data/topic_x_ai_human_handoff.md` | MD | Citation landing; scroll-to-text; scent; fast trust | Soham | X — AI-to-Human Handoff | Y | Y | Y | Y | Y | N | Y |
| `data/topic_y_context_retention.md` | MD | What a stateless crawl can/cannot test; breadcrumbs | Soham | Y — Context Retention | Y | Y | Y | Y | Y | N | Y |
| `data/topic_z_agent_skill_design.md` | MD | agentskills.io packaging; DAG; contracts; reliability; 5 min / 50 MB | Soham | Z — Agent Skill Design | Y | Y | Y | Y | Y | N | Y |
| `data/topic_aa_agent_reasoning_quality.md` | MD | Deterministic vs LLM test; evidence-first; verbalized-confidence ban | Soham | AA — Agent Reasoning Quality | Y | Y | Y | N | Y | N | Y |
| `data/topic_ab_report_design.md` | MD | Dual JSON + human report; BLUF; field rendering | Soham | AB — Report Design | Y | Y | Y | N | Y | N | Y |
| `data/topic_ac_proactive_recommendations.md` | MD | Beyond-defect recommendations; ranking vs generation split | Soham | AC — Proactive Recommendations | Y | Y | Y | Y | Y | N | Y |
| `data/topic_ad_security_robustness.md` | MD | Read-only; prompt injection in page text; hidden text | Soham | AD — Security / Robustness | Y | Y | Y | N | Y | N | Y |
| `data/topic_af_template_pattern_detection.md` | MD | Template clustering as crawl/report infrastructure | Soham | AF — Template / Pattern Detection | Y | Y | Y | N | Y | N | Y |
| `data/topic_u_false_positives_negatives.md` | MD | Consolidated never-fire table; U13–U18 decision procedure | Soham | U — False Positives & Negatives | Y | Y | Y | N | Y | N | Y |
| `data/topic_ah_out_of_the_box_questions.md` | MD | Flagship-product citability; composite citability predictor | Soham | AH — Out-of-the-Box Questions | Y | Y | Y | Y | Y | N | Y |
| `data/AE_crawling_strategy.md` | MD | 5-minute crawl: priority BFS, SimHash, budgets, traps, coverage | Pulkit | AE — Crawling Strategy | Y | Y | Y | N | Y | N | Y |
| `data/AG_information_graph_site_graph.md` | MD | Site graph as shared analysis layer, not a detection skill | Pulkit | AG — Information / Site Graph | Y | Y | Y | N | Y | N | Y |

---

## Count verification

| Class | Count |
|-------|-------|
| Research Markdown files in `data/` | **34** |
| Official PDF handouts | **1** |
| Spreadsheets | **0** |
| Existing `SKILL.md` | **0** |
| Existing source / scripts / marketplace | **0** |
| Prior architecture docs | **0** |
| Researchers identifiable | Pulkit, Harsh, Soham |

**Expected 34 vs found 34: MATCH.**

Filenames with `(1)` suffixes (`B_ai_citation_mechanics (1).md`, `topic_v_site_type_differentiation (1).md`) are unique files, not duplicates of another copy in the workspace.
