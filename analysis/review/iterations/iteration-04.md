# Iteration 04 — v3 → v3-locked (stabilization pass)

**Architecture version:** v3-locked  
**Baseline:** v3

## Issues found
Re-ran the major tests against v3:

- Coverage: AH8 still unspecified (documented). G folder still not created (documented disagreement).
- Missing skills: none new that pass independence.
- Redundancy: I×H off-site vs on-site split holds.
- Root cause: D-before-K holds.
- Evidence: enum sufficient.
- FP/FN: accepted FNs listed; no new class requiring a skill.
- Site-type: tables hold.
- Runtime: skip-ladder + protect-list; 40/60 still unvalidated **but no better control invented**.
- LLM/code: holds.
- Novelty: protect-list holds.
- Remediation: holds.
- Orchestration: H parallel with X OK.
- Contracts: enum in LOCKED.
- Safety: hop SSRF holds.
- Implementability: lexicons still to be written at code time — not an architecture defect.

## Changes
**None material.** Copied v3 into LOCKED_ARCHITECTURE.md.

## Reasons
Stabilization criterion 20: another serious pass produced no significant architectural improvement.

## New risks
None added.

## Comparison
Identical skill set to v0 **names**; different **boundaries, admission, budget, contracts**. That delta is already captured in iterations 01–03.

## Stabilization
Declared for v3-locked.
