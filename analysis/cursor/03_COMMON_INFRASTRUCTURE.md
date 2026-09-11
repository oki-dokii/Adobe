# Common infrastructure (implementer)

Implement `../08_SHARED_INFRASTRUCTURE.md` as `scripts/lib/*`.

Must-haves: GET-only client, RFC 9309 4xx fail-open / 5xx fail-closed, **SSRF IP checks on every hop**, global rate limit, **one** SimHash/θ template subsystem (not AE and AF separately), dual-fetch, U suppression table, `compare_claim_against_source`, sanitizer/delimiters for hidden text in LLM prompts.

Never skip K high-value pages on content-hash alone without comparing fact values.
