# Phase 18 — Marketplace Structure

Follow the handout. Do not invent unused trees.

```
brand-ai-readiness-audit/
  marketplace.json          # required manifest
  README.md                 # required: what each skill does + composition
  skills/
    audit-orchestrator/     # entrypoint
      SKILL.md
      scripts/              # run_audit.py (or similar)
      references/           # DAG, schemas, suppression table
    site-type-classifier/
      SKILL.md
      scripts/
      references/           # V clusters, never-fire
    crawl-access-audit/
      SKILL.md
      scripts/
      references/           # RFC 9309 notes, AI tokens
    render-extract-audit/
      SKILL.md
      scripts/
      references/
    citation-extractability-audit/
      SKILL.md
      scripts/
      references/           # qualifier taxonomy
    entity-identity-audit/
      SKILL.md
      scripts/
      references/
    ai-answerability-audit/
      SKILL.md
      scripts/
      references/           # K question bank
    freshness-audit/
      SKILL.md
      scripts/
      references/
    corroboration-consistency-audit/
      SKILL.md
      scripts/
      references/           # materiality
    engagement-handoff-audit/
      SKILL.md
      scripts/
      references/
  scripts/lib/              # OPTIONAL but recommended: shared crawl/http
  references/               # OPTIONAL shared contracts
```

| Path | Why | Who | Required |
|------|-----|-----|----------|
| marketplace.json | Contest manifest | Harness | yes |
| README.md | Human composition | Judges | yes |
| skills/*/SKILL.md | agentskills.io | Agent | yes |
| skills/*/scripts | Deterministic checks | Agent | yes for this design |
| skills/*/references | Progressive disclosure | Agent | yes for taxonomies |
| assets/ | Spec allows | unused | no |
| pretrained weights | Forbidden | — | must not exist |

Shared `scripts/lib` is allowed if README explains it; skills still remain valid folders. Prefer **each skill calling shared modules** over copying HTTP code.

Exactly one `"entrypoint": true`.
