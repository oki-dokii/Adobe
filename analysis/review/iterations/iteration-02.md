# Iteration 02 — v1 → v2

**Architecture version:** v2  
**Baseline:** v1 / 19_REVISED + 20_SECOND_RED_TEAM

## Issues found
v1 parked same-time on-site conflicts in H, overlapping I. W-03 FP on honest sweep. Skip-ladder could drop differentiators.

## Changes
- **SK-I:** all **on-site** typed fact conflicts (time-indexed **and** same-time) + date-signal credibility
- **SK-H:** **off-site linked** only; contradiction vs uncorroborated
- W-03 only if first-party comparison page exists (W-04)
- Skip-ladder **protect-list:** never drop V, dual-fetch on fact URLs, CIT deterministic qualifier/table, K3

## Reasons
I-01 is internal knowledge conflict; P/H is third-party. W-04 live correction.

## New risks
SK-I name “freshness” slightly wider than dates — document as temporal **and** internal consistency. Do not rename folder (marketplace churn) but SKILL.md purpose must say both.

## Tests
Redundancy I×H now MEDIUM not CRITICAL. FP W-03. Novelty protect-list.

## vs previous
Better SoC; now 11 marketplace skills with a separate post-processing layer. **This is the first material boundary fix after v1.**
