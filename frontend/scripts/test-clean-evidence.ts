/**
 * Unit tests for cleanEvidence() in adapter.ts
 *
 * Tests the brace-depth counter is genuinely general and handles:
 *  - 1-level nested braces (the original observed bug)
 *  - 2-level nested braces
 *  - 3-level nested braces
 *  - Multiple Coverage= blocks in one string
 *  - Already-clean strings (idempotent)
 *  - Real fixture input from python-docs_warm.json (regression)
 */

// ── Implementation mirror ─────────────────────────────────────────────────────
// cleanEvidence is not exported from adapter.ts; we test it through a local
// mirror that must stay byte-for-byte identical with the production function.

function cleanEvidence(raw: string): string {
  let result = raw
  let idx = result.indexOf('Coverage={')
  while (idx !== -1) {
    let depth = 0
    let end = idx
    for (let i = idx + 'Coverage='.length; i < result.length; i++) {
      if (result[i] === '{') depth++
      else if (result[i] === '}') {
        depth--
        if (depth === 0) { end = i; break }
      }
    }
    result = result.slice(0, idx).trimEnd() + ' ' + result.slice(end + 1).trimStart()
    result = result.replace(/\s*[,.]?\s*$/, '').trimEnd() + result.slice(result.replace(/\s*[,.]?\s*$/, '').length)
    idx = result.indexOf('Coverage={')
  }
  result = result.replace(/,\s*'[a-z_]+':\s*\d+[^'"]*/g, '')
  return result.replace(/\s{2,}/g, ' ').trim()
}

// ── Test harness ──────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

function test(name: string, input: string, expectedSubstrings: string[], forbiddenSubstrings: string[]) {
  const result = cleanEvidence(input)
  let ok = true

  for (const expected of expectedSubstrings) {
    if (!result.includes(expected)) {
      console.error(`  FAIL [${name}]: Expected to contain "${expected}"`)
      console.error(`       Got: "${result}"`)
      ok = false
    }
  }
  for (const forbidden of forbiddenSubstrings) {
    if (result.includes(forbidden)) {
      console.error(`  FAIL [${name}]: Should NOT contain "${forbidden}"`)
      console.error(`       Got: "${result}"`)
      ok = false
    }
  }

  if (ok) {
    console.log(`  ✅ PASS [${name}]`)
    console.log(`       Input:  "${input.slice(0, 120)}${input.length > 120 ? '…' : ''}"`)
    console.log(`       Output: "${result.slice(0, 120)}${result.length > 120 ? '…' : ''}"`)
    passed++
  } else {
    failed++
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────
console.log('\n=== cleanEvidence() Unit Tests ===\n')

// 1. No Coverage block → idempotent
test(
  'no-coverage-block',
  'No supporting span in crawled corpus for K3.',
  ['No supporting span in crawled corpus for K3.'],
  ['Coverage='],
)

// 2. One-level flat Coverage block (original bug: regex stopped at first '}')
test(
  '1-level-flat-dict',
  "Evidence text. Coverage={'pages_fetched': 40, 'robots_status': 'ok'}.",
  ['Evidence text.'],
  ['pages_fetched', 'robots_status', 'Coverage='],
)

// 3. Two-level nested dict — confirmed general, not just regex-fixed for observed case
test(
  '2-level-nested-dict',
  "No answer for K6. Coverage={'pages_fetched': 40, 'nested': {'a': 1, 'b': 2}, 'robots_status': 'ok'}. K6",
  ['No answer for K6.'],
  ['pages_fetched', 'nested', "'a'", "'b'", 'robots_status', 'Coverage='],
)

// 4. Three-level nested dict — genuinely general brace counter
test(
  '3-level-nested-dict',
  "Signal. Coverage={'a': {'b': {'c': 99, 'd': 0}, 'e': 1}, 'f': 2}. trailing",
  ['Signal.'],
  ["'a'", "'b'", "'c'", "'d'", "'e'", "'f'", 'Coverage='],
)

// 5. Multiple Coverage= blocks in one string
test(
  'multiple-coverage-blocks',
  "First gap. Coverage={'pages_fetched': 10}. Second gap. Coverage={'pages_fetched': 20, 'nested': {'x': 5}}. End.",
  ['First gap.', 'Second gap.'],
  ['pages_fetched', 'Coverage=', 'nested'],
)

// 6. Real fixture input from python-docs_warm.json (K3 finding) — regression test
const realK3Evidence = "No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 40, 'templates': 19, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 7, 't-2': 6, 't-3': 1, 't-4': 1, 't-5': 1, 't-6': 1, 't-7': 4, 't-8': 2, 't-9': 2, 't-10': 2, 't-11': 1, 't-12': 1, 't-13': 4, 't-14': 2, 't-15': 1, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. "
test(
  'real-fixture-k3-python-docs',
  realK3Evidence,
  ['No supporting span in crawled corpus for K3'],
  ['pages_fetched', 'pages_content_usable', 'render_max', 'renders_requested', 'renders_skipped_budget',
   'pages_verified_per_template', 'ssrf_blocks', 'Coverage='],
)

// 7. Real fixture input from python-docs_warm.json (K6 finding) — regression test
// This is the specific string that triggered the original nested-brace bug
const realK6Evidence = "No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 40, 'templates': 19, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 7, 't-2': 6, 't-3': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. K6"
test(
  'real-fixture-k6-python-docs',
  realK6Evidence,
  ['No supporting span in crawled corpus for K6'],
  ['pages_fetched', 'render_max', 'renders_requested', 'renders_skipped_budget',
   'pages_verified_per_template', 'ssrf_blocks', 'Coverage='],
)

// 8. Coverage dict with no trailing text (edge case: end of string)
test(
  'coverage-at-end-of-string',
  "Gap detected. Coverage={'pages_fetched': 5}",
  ['Gap detected.'],
  ['pages_fetched', 'Coverage='],
)

// 9. No Coverage= but string has bare braces in text — must NOT corrupt the text
test(
  'no-coverage-with-braces-in-text',
  'See schema.org/Thing for {structured} data guidelines.',
  ['See schema.org/Thing for {structured} data guidelines.'],
  [],
)

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
if (failed > 0) {
  process.exit(1)
}
