# FINAL — Research → Architecture Matrix

Every important research item → decision → location. Unexplained = none remaining except AH8 unspecified.

| Item | Decision | Location |
|------|----------|----------|
| HO dual mandate, 1 entrypoint, 5 min, robots, schema floor | IN | orch, LOCKED |
| HO example crawl+render merge | SPLIT C≠D | CX-13 |
| A pipeline | IN gates | C D CIT K |
| A11 dual-fetch | IN | SK-D |
| A12 synonyms | Low only | SK-K |
| A16 chunks | IN | SK-CIT |
| A22 templates | INFRA | simhash |
| B-F1 F2 F3 | IN | SK-CIT |
| C HTTP/robots/tokens/facets | IN | SK-C |
| D interaction vs DOM | IN | SK-D / SK-X split |
| D41 cloaking | IN | SK-D |
| D-MYTH llms.txt | REJECT required | — |
| E taxonomy/tables/negation | IN config | CIT refs |
| F WhoQA | IN degraded | SK-ENT |
| F-00 GEO 40% | REJECT | — |
| F-02 KG score | REJECT | — |
| G markup≠visible | NAMED type | CIT `schema_visible_mismatch` |
| G @id completeness | Low opportunity | AC |
| H corroboration | IN linked | SK-H |
| H-02 causality | HYP language | S/AA |
| I dates + knowledge conflict | IN on-site | SK-I |
| J specificity/thin | IN + U3 | CIT |
| K QA protocol | IN | SK-K |
| K9/10/21/22 | not defects | SK-K |
| L canonicals | gated on dups | SK-C |
| L titles | identity sentence | CIT |
| M viewport/scent | IN | SK-X |
| N alt materiality | IN | SK-D |
| N WCAG rest | REJECT | — |
| O LCP/INP | MERGE symptom D | — |
| O CLS proxy | IN Low | SK-X |
| O TTFB | METRIC | coverage / rare Low |
| P materiality/compare | INFRA | compare_claim |
| Q field method | REJECT skill | eval later |
| R live query invalid | DEFER probe | U12 |
| S axes, max not avg | IN | orch |
| T RCA parent | IN parent_id | orch |
| U1–U12 table | IN | admit() |
| U13–U18 flow | IN | admit() |
| U9 U10 U11 | IN | D / AC |
| V classifier | IN | SK-V |
| W intent + wrong_page | IN types | SK-K |
| W-03 win-rate | IN gated | CIT |
| W-04 no first-party | branch H/K | not universal W-03 |
| X forage STTF trust | IN | SK-X |
| Y-01 | LIMITATIONS | report |
| Y-02 crumbs | IN conditional | SK-X |
| Y9 | DEFER | — |
| Z packaging DAG 50MB | IN | orch |
| AA det vs LLM, no % | IN | boundary |
| AA-02 ReAct 1 hop | IN cap | hybrid skills |
| AB dual report | IN | orch |
| AC opportunities | IN | orch |
| AC12 cross-page | TYPED on-site | SK-I |
| AD injection SSRF | INFRA + D41 | http, sanitizer, D |
| AE crawl time SimHash coverage | INFRA | crawl |
| AF θ two-tier | INFRA | simhash report |
| AG graph WCC | INFRA | C orphans + AE22 |
| AG15 NLP conflict | DEFER hard findings | fact_store only |
| AH composite | METRIC HYP | SK-K metrics |
| AH flagship | SUBCHECK gated | SK-K |
| AH9 aggregator bake-off | DEFER | opportunistic |
| AH8 question | UNSPECIFIED | do not invent |
| JOIN AE/AF one cluster | IN | simhash |
| JOIN 5 min query-independent | IN | K subset, AH metric |

No important item without disposition.
