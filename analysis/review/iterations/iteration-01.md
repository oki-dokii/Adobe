# Iteration 01 — v0 → v1

**Architecture version:** v1  
**Baseline:** analysis/ 10-skill v0

## Issues found
Parallel D/CIT/K without flags; U-flow not executable; W/G/D41 over-merged; H search vs spec; no parent_id; runtime overrun; ENT search fantasy.

## Changes
- D before CIT/K/X; extractability_flags
- U13–U18 `admit()`
- Named finding types (G, W classes, D41)
- H linked-only; skip-ladder; parent_id
- ENT no search API
- Skip-ladder clock

## Reasons
Research W/G/D/U/T/AE; runtime attack.

## New risks
Less parallelism; H FN on unlinked sources.

## Tests conceptually re-run
Coverage, redundancy, FP zoo, runtime cost model.

## vs previous
Same 11 marketplace skills; stronger contracts.
