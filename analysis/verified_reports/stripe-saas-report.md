# 🧠 Brand AI Readiness Diagnostic — stripe.com

```
  Site         : https://stripe.com/
  Audit ID     : stripe-saas-audit-run
  Generated    : 2026-09-13T04:59:58.757Z
  Engine       : Brand AI Readiness Engine v1 (llm_calls=0, deterministic)
  Methodology  : Dual-Fetch Static + Hydrated DOM Analysis
  Standards    : RFC 9309 · Schema.org · robots.txt
```

> **Read-Only Non-Invasive Audit.** All evaluations performed via standard HTTP GET/HEAD with zero mutation.


---


## 1. 📊 Executive Summary

| Metric | Value |
|---|---|
| **AI Readiness Index** | **71 / 100** (Grade **B**) |
| **Overall Verdict** | **Mostly ready** |
| **Defect Register** | 2 Critical · 13 High · 0 Medium · 0 Low |
| **Total Findings** | 15 actionable findings |
| **Inspection Boundaries** | 0 audit-scope limitations |
| **Pages Crawled** | 40 |
| **Pages Rendered (JS)** | 10 |
| **HTTP Requests** | 54 |
| **Templates Identified** | 7 |
| **Robots.txt Status** | ok |
| **Total Wall-Clock** | 75.98s |

**Strategic Assessment:**

> "Price amount is separated from its qualifying condition" represents the primary citation barrier in Trust (15/100). Resolving this is the highest leverage action to ensure automated AI engines cite and surface this domain accurately.

**AI Readiness Score:**
```
██████████████░░░░░░ 71/100 (B)
```


---


## 2. 🎯 Top 3 Priority Actions (Ranked by Business Exposure)

> Ranked by business-exposure risk (funnel stage criticality and crawl reach) — not discovery order.


### 1. 🔴 [CRITICAL] Price amount is separated from its qualifying condition

- **Recommended Fix:** Put the amount and its condition in one self-contained sentence. — RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
- **Exposure Drivers:** High Funnel (decision) · Cluster Reach (12/40 pages, 30%)
- **Business Consequence:** AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.
- **Estimated Effort:** `LOW`


### 2. 🔴 [CRITICAL] Price amount is separated from its qualifying condition

- **Recommended Fix:** Put the amount and its condition in one self-contained sentence. — RAG windows can cite the amount without the condition. https://stripe.com/en-at/pricing
- **Exposure Drivers:** High Funnel (decision) · Cluster Reach (3/40 pages, 8%)
- **Business Consequence:** AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.
- **Estimated Effort:** `LOW`


### 3. 🟠 [HIGH] Price amount is separated from its qualifying condition

- **Recommended Fix:** Put the amount and its condition in one self-contained sentence. — RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
- **Exposure Drivers:** High Funnel (decision) · Isolated Reach (1/40 pages, 3%)
- **Business Consequence:** AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.
- **Estimated Effort:** `LOW`


---


## 3. 📈 Corpus Benchmark (38-Site Empirical Distribution)

| Position | Score | Status |
|---|---|---|
| **This Brand** | 71 / 100 | Grade B |
| Corpus Median | 67 / 100 | ✅ Above median (+4 pts) |
| Top Quartile (75th percentile) | 82 / 100 | 11 pts gap to top quartile |
| Corpus Best | 91 / 100 | Reference Benchmark |


---


## 4. 🔬 Causal Dimension Breakdown

| Dimension | Score | Visual | Status | Description |
|---|---|---|---|---|
| **Discoverability** | 90/100 | `███████████░` | ✅ STRONG | Can automated systems reach and read the site at all? |
| **Understanding** | 90/100 | `███████████░` | ✅ STRONG | Can machines parse what the brand is and what it offers? |
| **Trust** | 15/100 | `██░░░░░░░░░░` | 🔴 WEAK | Is the information consistent, corroborated and current? |
| **Engagement** | 90/100 | `███████████░` | ✅ STRONG | Can an AI hand a user off to the right next action? |


---


## 5. 💔 Lost-Point Inventory (Score Decomposition)

Total Deductions: **−29 points**

| Severity | Deduction | Finding | Dimension |
|---|---|---|---|
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🔴 CRITICAL | −12 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🟠 HIGH | −8 pts | Price amount is separated from its qualifying condition | Trust |
| 🔴 CRITICAL | −12 pts | Price amount is separated from its qualifying condition | Trust |


---


## 6. 🔗 Systemic Root Causes & Downstream AI Impact


### 🟠 Citation Extractability [HIGH]

- **Structural Origin:** Price amount is separated from its qualifying condition
- **Propagated Finding Count:** 15
- **Finding IDs:** `F-001, F-002, F-003, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013, F-014, F-015, F-016`



---


## 7. 🔍 Actionable Findings — Full Detail

> Each finding below mirrors exactly what is shown in the audit dialog. Every field is derived from the live crawl — no fabrication.

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-001` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.30' vs later qualifier in es include GST. 1.7% + A$0.30 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.30' vs later qualifier in es include GST. 1.7% + A$0.30 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.30' vs later qualifier in es include GST. 1.7% + A$0.30 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-001
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-002` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.30' vs later qualifier in domestic cards* 3.5% + A$0.30 for international cards… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.30' vs later qualifier in domestic cards* 3.5% + A$0.30 for international cards… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.30' vs later qualifier in domestic cards* 3.5% + A$0.30 for international cards… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-002
```

</details>

---

### 🔴 [CRITICAL] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-003` |
| **Severity** | 🔴 CRITICAL |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 12 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$10.00' vs later qualifier in mer portal on Stripe. US$10.00 per month Learn more Po… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~42 pages affected (based on 12 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🤖 What an AI Would Say Instead:**

> This fact currently only has third-party corroboration from third-party profile (`https://stripe.com/en-at/pricing`), not the brand's own site.

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$10.00' vs later qualifier in mer portal on Stripe. US$10.00 per month Learn more Po… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 3 | `Affected URL` | stripe.com/en-at/pricing | [link](https://stripe.com/en-at/pricing) |
| 4 | `Affected URL` | stripe.com/en-be/pricing | [link](https://stripe.com/en-be/pricing) |
| 5 | `Affected URL` | stripe.com/en-cz/pricing | [link](https://stripe.com/en-cz/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][CRITICAL] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, critical
Priority: High

Problem: Isolated '$10.00' vs later qualifier in mer portal on Stripe. US$10.00 per month Learn more Po… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-003
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-005` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.10' vs later qualifier in erson payments. 1.7% + A$0.10 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.10' vs later qualifier in erson payments. 1.7% + A$0.10 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.10' vs later qualifier in erson payments. 1.7% + A$0.10 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-005
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-006` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.10' vs later qualifier in domestic cards* 3.5% + A$0.10 for international cards… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.10' vs later qualifier in domestic cards* 3.5% + A$0.10 for international cards… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.10' vs later qualifier in domestic cards* 3.5% + A$0.10 for international cards… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-006
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-007` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.15' vs later qualifier in cards* + A$0.15 per authorisation for T… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.15' vs later qualifier in cards* + A$0.15 per authorisation for T… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.15' vs later qualifier in cards* + A$0.15 per authorisation for T… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-007
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-008` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$0.07' vs later qualifier in to Pay + A$0.07 per authorisation for o… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$0.07' vs later qualifier in to Pay + A$0.07 per authorisation for o… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$0.07' vs later qualifier in to Pay + A$0.07 per authorisation for o… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-008
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-009` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$89.00' vs later qualifier in d management at scale. A$89.00 BBPOS WisePad 3 Excl. G… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$89.00' vs later qualifier in d management at scale. A$89.00 BBPOS WisePad 3 Excl. G… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$89.00' vs later qualifier in d management at scale. A$89.00 BBPOS WisePad 3 Excl. G… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-009
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-010` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$449.00' vs later qualifier in OS WisePad 3 Excl. GST A$449.00 Stripe Reader S710 Excl… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$449.00' vs later qualifier in OS WisePad 3 Excl. GST A$449.00 Stripe Reader S710 Excl… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$449.00' vs later qualifier in OS WisePad 3 Excl. GST A$449.00 Stripe Reader S710 Excl… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-010
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-011` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$449.00' vs later qualifier in Reader S710 Excl. GST A$449.00 Stripe Reader S700 Excl… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$449.00' vs later qualifier in Reader S710 Excl. GST A$449.00 Stripe Reader S700 Excl… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$449.00' vs later qualifier in Reader S710 Excl. GST A$449.00 Stripe Reader S700 Excl… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-011
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-012` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$469.00' vs later qualifier in Reader S700 Excl. GST A$469.00 Stripe Reader T600 Excl… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$469.00' vs later qualifier in Reader S700 Excl. GST A$469.00 Stripe Reader T600 Excl… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$469.00' vs later qualifier in Reader S700 Excl. GST A$469.00 Stripe Reader T600 Excl… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-012
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-013` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$23.00' vs later qualifier in y for free for 30 days A$23.00 per month Annual subscr… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$23.00' vs later qualifier in y for free for 30 days A$23.00 per month Annual subscr… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$23.00' vs later qualifier in y for free for 30 days A$23.00 per month Annual subscr… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-013
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-014` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$101.00' vs later qualifier in y for free for 30 days A$101.00 per month Annual subscr… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$101.00' vs later qualifier in y for free for 30 days A$101.00 per month Annual subscr… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$101.00' vs later qualifier in y for free for 30 days A$101.00 per month Annual subscr… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-014
```

</details>

---

### 🟠 [HIGH] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-015` |
| **Severity** | 🟠 HIGH |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 1 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '$500.00' vs later qualifier in r 83(b) tax election. US$500.00 one-off setup fee (incl… / later span on https://stripe.com/au/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~3 pages affected (based on 1 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '$500.00' vs later qualifier in r 83(b) tax election. US$500.00 one-off setup fee (incl… / later span on https://stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |
| 2 | `Affected URL` | stripe.com/au/pricing | [link](https://stripe.com/au/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/au/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, high
Priority: High

Problem: Isolated '$500.00' vs later qualifier in r 83(b) tax election. US$500.00 one-off setup fee (incl… / later span on https://stripe.com/au/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/au/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-015
```

</details>

---

### 🔴 [CRITICAL] Price amount is separated from its qualifying condition

| Field | Value |
|---|---|
| **Finding ID** | `F-016` |
| **Severity** | 🔴 CRITICAL |
| **Confidence** | MEDIUM |
| **Skill** | Citation Extractability (`citation-extractability-audit`) |
| **Dimension** | Trust |
| **Pages Affected** | 3 |
| **Pages Sampled** | 40 |


**📋 Technical Observation:**

> Isolated '€0.25' vs later qualifier in internationally. 2.5% + €0.25 for UK cards + … / later span on https://stripe.com/en-at/pricing

**❓ Why This Matters for AI Systems:**

> RAG windows can cite the amount without the condition.

**💼 Business Impact:**

> AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.

**💥 Blast Radius:**

> Extrapolated site-wide: estimated ~10 pages affected (based on 3 of 40 sampled pages sharing template `t-2`; sitemap size: 139).

**🤖 What an AI Would Say Instead:**

> This fact currently only has third-party corroboration from third-party profile (`https://stripe.com/en-ee/pricing`), not the brand's own site.

**🔬 Evidence Chain:**

| # | Label | Detail | URL |
|---|---|---|---|
| 1 | `Extracted evidence` | Isolated '€0.25' vs later qualifier in internationally. 2.5% + €0.25 for UK cards + … / later span on https://stripe.com/en-at/pricing | [link](https://stripe.com/en-at/pricing) |
| 2 | `Affected URL` | stripe.com/en-at/pricing | [link](https://stripe.com/en-at/pricing) |
| 3 | `Affected URL` | stripe.com/en-ee/pricing | [link](https://stripe.com/en-ee/pricing) |
| 4 | `Affected URL` | stripe.com/en-gr/pricing | [link](https://stripe.com/en-gr/pricing) |

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Put the amount and its condition in one self-contained sentence. |
| **Detail** | RAG windows can cite the amount without the condition. https://stripe.com/en-at/pricing |
| **Priority** | MEDIUM |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM
2. AI chunking and embedding algorithms split conditions from values across separate context windows
3. AI models state base prices or capabilities without essential constraints, creating compliance risk

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][CRITICAL] Price amount is separated from its qualifying condition
Labels: ai-readiness, citation-extractability-audit, critical
Priority: High

Problem: Isolated '€0.25' vs later qualifier in internationally. 2.5% + €0.25 for UK cards + … / later span on https://stripe.com/en-at/pricing
Why It Matters: RAG windows can cite the amount without the condition.
Acceptance Criteria: RAG windows can cite the amount without the condition. https://stripe.com/en-at/pricing
Skill: Citation Extractability | Dimension: Trust | Finding ID: F-016
```

</details>

---

> ℹ️ **How Severity is Calculated:** Business-Exposure Severity is derived from an ordinal matrix combining **Funnel Priority** (High: Decision-stage e.g. pricing, purchasing, contact; Medium: Consideration-stage e.g. audience, geography, specifications; Low: Awareness-stage e.g. discovery, crawl access, identity) and **Reach Tier** (Broad: ≥50% pages affected or global directive; Cluster: 10–49% pages affected; Isolated: <10% pages affected). Broad Decision issues evaluate to CRITICAL; Isolated Decision / Broad Consideration evaluate to HIGH; Isolated Consideration / Broad Awareness evaluate to MEDIUM; Isolated Awareness evaluates to LOW.


## 8. 🧠 AI Perception Console — Simulated Assistant Grounding

> **DISCLAIMER:** Simulated extract-grounded perception. NOT a live citation scrape. Deterministic analysis of first-party HTML extractability.


### Interrogation Question: "What do they offer?"

| Field | Value |
|---|---|
| **Simulated Status** | `REFUSED` |
| **Grounding Confidence** | `LOW` |
| **Fallback Used** | Yes — local deterministic extraction fallback |
| **Stale** | No |
| **Skipped Skills** | None |

**🗣 Assistant Synthesized Answer:**

> "I cannot state pricing or a concrete offer from extractable first-party HTML. Key facts appear only after client render."

**📍 Sentence Attribution & Evidence Receipts (Trace Spans):**

> Each row shows which sentence is grounded in evidence, which skills produced it, and which findings it implicates.

| Clause | Grounding | Skills | Finding IDs |
|---|---|---|---|
| "I cannot state pricing or a concrete offer from extractable first-party HTML." | ✅ `supported` | `render-extract-audit, citation-extractability-audit, ai-answerability-audit` | `F-001, F-002, F-003, F-005` |
| "Key facts appear only after client render." | ❌ `unsupported` | `render-extract-audit, citation-extractability-audit, ai-answerability-audit` | `F-001, F-002, F-003, F-005` |


---


### 🧩 Brand Working Memory (6-Cell Extraction Register)

> These 6 cells represent the factual profile a language model builds about your brand. Empty cells = real extraction failures.

| Cell | State | Extracted Value | Source | Skills |
|---|---|---|---|---|
| **IDENTITY** | ✅ FILLED | stripe.com | `🟢 EVIDENCE` | `entity-identity-audit` |
| **CATEGORY** | ✅ FILLED | Enterprise Software & Digital Platform | `🟡 INFERRED` | `site-type-classifier` |
| **OFFER** | ❌ EMPTY | — *(Unextractable)* | `⚪ EMPTY` | `citation-extractability-audit, render-extract-audit` |
| **PROOF** | ✅ FILLED | On-site claims are internally consistent | `🟢 EVIDENCE` | `corroboration-consistency-audit` |
| **ACTION** | ✅ FILLED | Machine-legible handoff action present | `🟢 EVIDENCE` | `engagement-handoff-audit` |
| **RECENCY** | ✅ FILLED | Temporal recency signals verified | `🟢 EVIDENCE` | `freshness-audit` |

**Missing Facts (unresolvable gaps from audit):**
- Price amount is separated from its qualifying condition (×15 pages affected)


---


### ⚔️ Substitution Counterfactual Analysis

> When your first-party content is weak, AI systems substitute competitor mentions. This shows who benefits and why.

| Signal | Value |
|---|---|
| **First-Party Signal Strength** | `WEAK` |
| **Likely AI Citation (instead of you)** | **Third-party sources with extractable specs (aggregators, encyclopedic pages, competitors).** |
| **Your Brand AI Share** | 32% |
| **Rival Brand AI Share** | 68% |
| **Primary Rival** | Third-Party Aggregators & Structured Competitors |
| **Estimated Lift Delta** | +40% potential with full remediation |

**Break-Point Reason:**
> AI systems prioritize secondary sources because first-party content exhibits extraction failures: "Price amount is separated from its qualifying condition". Third-party directories and competitors supply structured alternatives.

**Rival Winning Attributes:**
- Structured semantic HTML with unambiguous section hierarchies
- Fast sub-second raw HTML delivery without heavy client hydration barriers
- Unambiguous factual question-and-answer pairs formatted for direct RAG ingestion
- Comprehensive entity disambiguation identifiers (Wikidata / sameAs mapping)

**Causal Walk to Substitution:**

1. **Citation Extractability** (`rc-citation-extractability-audit`)

**Remediation Patch:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Stripe",
  "url": "https://stripe.com",
  "description": "Authoritative entity specifications and verified organizational profile for stripe.com.",
  "sameAs": [
    "https://en.wikipedia.org/wiki/Stripe",
    "https://www.wikidata.org/wiki/Stripe"
  ]
}
</script>
```


---


### 🌐 Recommendation Gravity Analysis

| Field | Value |
|---|---|
| **Gravity Class** | `GENERIC` |
| **Classification** | **GENERIC** |
| **Assessment** | The assistant can speak in category terms about this brand but may not name a specific offer or call-to-action. |
| **Contributing Skills** | `engagement-handoff-audit, ai-answerability-audit, citation-extractability-audit` |
| **Gravity Score** | 62/100 |

| Anchor | Weight | Detail |
|---|---|---|
| Handoff Signal Present | 0 | At least one extractable next-action path was found. |
| Answerability Adequate | 0 | Core K-category questions can be answered from crawled content. |
| Offer Not Extractable | -8 | The offer/product description could not be resolved from first-party markup. |


---


### 🩺 AI Perception MRI Vitals

> Composite health indicators derived from all skill outputs.

| Vital | Value | Visual |
|---|---|---|
| **Retrieval Fidelity** | 82/100 | `████████████░░░` |
| **Grounding Integrity** | 62/100 | `█████████░░░░░░` |
| **Hallucination Risk** | 19/100 | `████████████░░░` |


---


## 9. ⚙️ Skill Marketplace Composition

| # | Skill | ID | Dimension | Status | Skipped | Pages Inspected | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | **Site Type Classifier** | `Site Type` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 2 | **Crawl Access** | `Crawl Access` | `DISCOVERABILITY` | ⏳ `DORMANT` | — | 0 | — |
| 3 | **Render & Extract** | `Render & Extract` | `DISCOVERABILITY` | ⏳ `DORMANT` | — | 0 | — |
| 4 | **Entity Identity** | `Entity Identity` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 5 | **Citation Extractability** | `Citation Extractability` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 6 | **AI Answerability** | `AI Answerability` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 7 | **Freshness** | `Freshness` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 8 | **Corroboration** | `Corroboration` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 9 | **Engagement Handoff** | `Engagement Handoff` | `ENGAGEMENT` | ⏳ `DORMANT` | — | 0 | — |
| 10 | **Audit Orchestrator** | `orch` | `COORDINATION` | ✅ `COMPLETED` | — | — | — |


### Skill Internal Check Results


**Site Type Classifier:**
- ⏳ Template detection
- ⏳ Content taxonomy
- ⏳ Commerce signals
- ⏳ Locale detection

**Crawl Access:**
- ⏳ robots.txt
- ⏳ Status codes
- ⏳ Challenge responses
- ⏳ Sitemap coverage

**Render & Extract:**
- ⏳ Server-rendered content
- ⏳ Client-only content
- ⏳ DOM stability
- ⏳ Main content ratio

**Entity Identity:**
- ⏳ Organization identity
- ⏳ Brand aliases
- ⏳ Entity ambiguity
- ⏳ Cross-source consistency

**Citation Extractability:**
- ⏳ Self-contained facts
- ⏳ Structured data
- ⏳ Attributable claims
- ⏳ Stable anchors

**AI Answerability:**
- ⏳ Question coverage
- ⏳ Answer grounding
- ⏳ Confidence margin
- ⏳ Source substitution risk

**Freshness:**
- ⏳ Published dates
- ⏳ Modified signals
- ⏳ Stale claims
- ⏳ Update cadence

**Corroboration:**
- ⏳ Internal consistency
- ⏳ Third-party agreement
- ⏳ Content provenance credentials
- ⏳ Canonical source

**Engagement Handoff:**
- ⏳ Primary actions
- ⏳ Action legibility
- ⏳ Contact paths
- ⏳ Conversion clarity


---


## 10. 📡 Coverage & Timing Telemetry

**Crawl Coverage:**

| Metric | Value |
|---|---|
| Pages Fetched | 40 |
| Pages Rendered (JS) | 10 |
| Render Count | 10 |
| Templates Identified | 7 |
| HTTP Requests | 54 |
| Robots.txt Status | ok |
| Crawl Stopped Reason | early_stop |
| Skipped Skill Count | 0 |
| Scope Limitations | 0 |

**Execution Timing:**

| Phase | Duration |
|---|---|
| Total Wall-Clock | 75.98s |
| Crawl Phase | 53.14s |
| Render Phase | 0.79s |

| Skill | Duration |
|---|---|
| Site Type Classifier | 0.00s |
| Crawl Access | 0.00s |
| Render & Extract | 8.32s |
| Citation Extractability | 2.35s |
| Entity Identity | 4.61s |
| Freshness | 0.13s |
| AI Answerability | 0.05s |
| Engagement Handoff | 2.18s |
| Corroboration | 5.19s |


---


## 12. 📚 Methodological Disclosure

1. **Read-Only Non-Invasive Audit:** All evaluations via standard HTTP GET/HEAD with zero mutation.
2. **RFC 9309 Adherence:** Crawl respects `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` exclusion rules.
3. **Dual-Fetch Rendering Verification:** Compares raw server-rendered HTML against client-side hydrated DOM to detect JS-gated extraction barriers.
4. **Citation Extractability vs Live Ranking:** Measures structural extractability — physical preconditions for AI ingest — not stochastic query volume.
5. **Zero LLM Calls:** All analysis is deterministic and rule-based. No external AI API calls during audit.
6. **Simulated Perception Disclaimer:** The Perception Console simulates LLM extraction capability. It is NOT a live query to any AI system.


---

*Report produced by Brand AI Readiness Diagnostic Engine*  
*Audit ID: `stripe-saas-audit-run` · Generated: 2026-09-13T04:59:58.757Z*
