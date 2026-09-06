# Phase 21 — Implementation Plan (Cursor)

Do not start marketplace coding until this pack is approved. Tasks for the implementation agent:

## TASK 001 — Marketplace skeleton
- **Goal:** Folders, marketplace.json, README stubs, empty SKILL.md frontmatter
- **Files:** structure in 17/18
- **Deps:** none
- **Accept:** `skills-ref validate` or equivalent on each folder; exactly one entrypoint
- **Tests:** JSON schema of manifest

## TASK 002 — Shared HTTP/robots/URL
- **Files:** `scripts/lib/http.py`, `robots.py`, `url.py`
- **Deps:** 001
- **Accept:** GET-only; RFC 9309 4xx/5xx cases
- **Tests:** fixtures for robots 4xx vs 5xx

## TASK 003 — Crawl planner
- **Files:** `crawl.py`, `simhash.py`, `sitemap.py`
- **Deps:** 002
- **Accept:** priority queue, depth cap, coverage object, time budget hook
- **Tests:** trap URL skipped; duplicate collapse

## TASK 004 — Extract/render
- **Files:** `extract.py`, `render.py` (timeout)
- **Deps:** 003
- **Accept:** ExtractedContent schema; dual-fetch delta metric
- **Tests:** static vs JS fixture HTML

## TASK 005 — Finding/suppression/confidence libs
- **Files:** `findings.py`, `suppress.py`, `confidence.py`
- **Deps:** 001
- **Accept:** U table loads; no verbalized confidence
- **Tests:** U1–U8 synthetic

## TASK 006 — SK-V
- **Deps:** 004
- **Accept:** cluster + YMYL flag; V never-fire applied
- **Tests:** fixtures per cluster

## TASK 007 — SK-C
- **Deps:** 002–003
- **Tests:** redirect loop, token disallow, orphan

## TASK 008 — SK-D
- **Deps:** 004
- **Tests:** U2 true negative; price-in-JS true positive

## TASK 009 — SK-CIT
- **Deps:** 004–005
- **Tests:** qualifier split; mission-page TN

## TASK 010 — SK-ENT
- **Deps:** 004
- **Tests:** distinctive name TN; collision without disambiguation TP; no Wikidata-only FP

## TASK 011 — SK-K
- **Deps:** 006
- **Tests:** abstention on missing price; K10 not defect; hallucination guard (uncited answer invalid)

## TASK 012 — SK-I
- **Deps:** 004
- **Tests:** evergreen TN; conflicting press vs current TP

## TASK 013 — SK-H
- **Deps:** 002, 010
- **Tests:** materiality cap; robots on third-party

## TASK 014 — SK-X
- **Deps:** 011 (claims)
- **Tests:** accordion TP; flat site breadcrumb TN

## TASK 015 — Orchestrator
- **Deps:** 006–014
- **Accept:** DAG order; parallel C/D/CIT/ENT/I; report schema floor
- **Tests:** unreachable early stop; merge templates

## TASK 016 — Merge + severity
- **Deps:** 015
- **Tests:** 250 clone pages → 1 finding; V vs pricing conflict

## TASK 017 — Dual report render
- **Deps:** 016
- **Accept:** JSON + MD counts match; BLUF first sentence
- **Tests:** finding_id present in both

## TASK 018 — Safety CI
- **Accept:** no POST; zip size; no model weights; timed run log
- **Tests:** grep write verbs

## TASK 019 — Optimization
- **Goal:** typical site <5 min
- **Tune:** 40/60 split, render N, K question subset

## TASK 020 — Unseen-site validation
- **Goal:** 5+ diverse types not used in design anecdotes
- **Accept:** no hard-coded hostnames in code

Each skill task includes unit tests: positive, negative, FP, FN from `15_FALSE_POSITIVE_DEFENSE.md`.
