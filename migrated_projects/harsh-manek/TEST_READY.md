# Test Ready: Harsh Manek & Co. E2E Automated Test Suite

## Overview
An automated, opaque-box end-to-end (E2E) test harness has been constructed in `tests/e2e/` to verify requirements and acceptance criteria across all 12 project features (F01–F12).

The test suite enforces strict TDD (Test-Driven Development) semantics: tests verify specification compliance independently of implementation details using statutory calculation oracles, HTTP verification, Unicode boundary analysis, and DOM/AST checks.

---

## Quick Start & Runner Invocations

### Standard Execution (Strict CI Mode: Exits 0 if all pass, 1 if failures)
```bash
cmd /c "node tests/e2e/run_tests.cjs"
```

### Summary Table Only
```bash
cmd /c "node tests/e2e/run_tests.cjs --summary-only"
```

### Verbose Mode (Detailed per-test latency and assertion logs)
```bash
cmd /c "node tests/e2e/run_tests.cjs --verbose"
```

### Non-Strict TDD Diagnostic Mode (Exits 0 during intermediate development)
```bash
cmd /c "node tests/e2e/run_tests.cjs --allow-tdd-failures"
```

---

## Test Inventory & Tier Breakdown

| Tier | Description | Cases | Target Threshold | Status |
|---|---|:---:|:---:|:---:|
| **Tier 1** | Feature Coverage (F01–F12) | 60 | >= 60 (5 per feature) | Ready |
| **Tier 2** | Boundary & Corner Cases (F01–F12) | 60 | >= 60 (5 per feature) | Ready |
| **Tier 3** | Pairwise Combinations | 16 | >= 15 cross-feature | Ready |
| **Tier 4** | Real-World Application Scenarios | 6 | >= 5 scenarios | Ready |
| **Total** | **All Verification Tiers** | **142** | **>= 140 test cases** | **Ready** |

---

## Feature Verification Matrix (F01 – F12)

| # | Feature Code | Description | Milestone | Tier 1 Cases | Tier 2 Cases | Cross-Tier Tests |
|---|--------------|-------------|:---------:|:------------:|:------------:|:----------------:|
| F01 | Localhost Isolation & Build Parity | Zero remote leakage, HTTP 200 on port 5173, no git remotes | M1 | T1-F01-01..05 | T2-F01-01..05 | T3-01, T3-15 |
| F02 | ICAI Ethics Compliance | Absence of ratings/stars, absence of fee undercutting, verified FCA & DISA credentials | M1 | T1-F02-01..05 | T2-F02-01..05 | T3-02, T3-09, T3-13, T4-01, T4-03 |
| F03 | Anti-Slop Copy & A11y Contrast | 0 em dashes (`\u2014`), WCAG AA >= 4.5:1 contrast, no AI buzzwords | M1 | T1-F03-01..05 | T2-F03-01..05 | T3-02, T3-03, T3-10, T4-03, T4-06 |
| F04 | Taste Architect Luxury Design | Absence of purple glow, Geist/Instrument Serif/JetBrains Mono fonts, subtle borders | M1 | T1-F04-01..05 | T2-F04-01..05 | T3-03, T3-04, T3-14, T4-06 |
| F05 | Dynamic Timeline & Calendar | Statutory compliance calendar mode (ITR July 31, Audit Oct 31, GSTR-3B 20th) | M2 | T1-F05-01..05 | T2-F05-01..05 | T3-05, T3-11, T4-01, T4-02, T4-03 |
| F06 | Enhanced Tax Sandbox | FY 2024-25 ₹75k standard deduction, Sec 87A rebate & marginal relief, accessible toggles | M2 | T1-F06-01..05 | T2-F06-01..05 | T3-05, T3-06, T3-08, T4-01, T4-04 |
| F07 | Enhanced Invoice Strategist | Reverse invoicing, Rule 138 E-Way bill (₹50k), Rule 48(4) E-Invoicing (₹5 Cr), SAC 9982 | M2 | T1-F07-01..05 | T2-F07-01..05 | T3-04, T3-07, T3-08, T3-16, T4-02, T4-06 |
| F08 | Enhanced Penalty Simulator | Dual mode (ITR 234A/B/C/F & GST Sec 47/50), accessible slider, zero purple glow | M2 | T1-F08-01..05 | T2-F08-01..05 | T3-06, T3-07, T3-14, T4-02, T4-04 |
| F09 | Dynamic Blog Routing & Resilience | React Router `/blog/:id` with useParams, fallback not-found handling, anchor links | M1 | T1-F09-01..05 | T2-F09-01..05 | T3-09, T3-10, T3-11, T4-03 |
| F10 | SEO, GEO & AEO Architecture | Title, OpenGraph, Twitter cards, Rajkot GEO tags, JSON-LD schema with 10 FAQs | M3 | T1-F10-01..05 | T2-F10-01..05 | T3-12, T3-13, T3-16, T4-02, T4-05 |
| F11 | Crawler Directives & Sitemap | `public/robots.txt` and `public/sitemap.xml` with canonical routes & lastmod | M3 | T1-F11-01..05 | T2-F11-01..05 | T3-12, T4-05 |
| F12 | Comprehensive E2E Verification | Master runner execution, static asset checks, HTML tag closure, sub-second latency | M4 | T1-F12-01..05 | T2-F12-01..05 | T3-15 |

---

## Real-World Scenarios (Tier 4)

1. **Scenario 1: Salaried Tech Professional Tax Optimization Journey (T4-01)**
   - Features: F06, F05, F02 (Complexity: High)
   - Exercises gross salary of ₹12,00,000, New Regime standard deduction ₹75,000 vs Old Regime deductions (80C/80D), calculates tax saving of ₹40,300, inspects statutory filing deadline (July 31), and schedules consultation.
2. **Scenario 2: Rajkot Manufacturing Unit GST & Invoice Invoicing Compliance (T4-02)**
   - Features: F07, F08, F05, F10 (Complexity: High)
   - Exercises forward invoicing for ₹1,80,000 consignment (IGST 18% = ₹32,400), evaluates Rule 138 E-Way bill necessity (> ₹50,000), verifies GSTR-3B monthly deadline, and simulates Section 47 & 50 late filing penalty for 15 days delay.
3. **Scenario 3: Corporate Annual Statutory Audit & MCA Compliance Onboarding (T4-03)**
   - Features: F02, F05, F09, F03 (Complexity: Medium)
   - Direct onboarding flow verifying FCA & DISA credentials, statutory audit timelines, anti-slop copy (zero em dashes), and consultation scheduling without discount gimmicks.
4. **Scenario 4: Belated Return & Section 234 Interest Assessment Workflow (T4-04)**
   - Features: F08, F06, F02 (Complexity: Medium)
   - Taxpayer with ₹6,50,000 taxable income filing after deadline with ₹20,000 unpaid tax; computes Section 234F fee (₹5,000) and Section 234A interest (4 months @ 1% = ₹800), and validates New Regime 87A relief.
5. **Scenario 5: Local Search Discovery & FAQ Answering Journey (T4-05)**
   - Features: F10, F11, F04, F02 (Complexity: Medium)
   - Search engine bot parses robots.txt, traverses sitemap.xml, parses JSON-LD schema with `AccountingService` in Rajkot, extracts 10 FAQPage answers for AI answer engines (AEO), and verifies absence of fake review schemas.
6. **Scenario 6: Reverse Invoicing and E-Way Bill Dispatch Calculation (T4-06)**
   - Features: F07, F04, F03 (Complexity: Medium)
   - Reverse calculates ₹1,18,000 inclusive total to base ₹1,00,000 and ₹18,000 tax (CGST ₹9k + SGST ₹9k), evaluates Rule 138 threshold, validates SAC 9982 badge, and checks zinc/emerald styling with zero purple accents.

---

## Statutory Calculation Oracles Included

The test harness incorporates autonomous reference oracles in `tests/e2e/helpers.cjs`:
- **New Tax Regime Oracle**: Implements Budget 2024 ₹75k standard deduction, 5-tier slab rates, Section 87A full rebate (up to ₹7,00,000 taxable income), Section 87A marginal relief formula, and 4% Health & Education cess.
- **Old Tax Regime Oracle**: Implements ₹50k standard deduction, 80C/80D caps, old slab rates, and 4% cess.
- **Invoice & GST Oracle**: Implements forward and reverse tax splitting, paise rounding, SAC 9982 attribution, Rule 138 ₹50,000 E-Way bill threshold, and Rule 48(4) ₹5 Cr E-Invoicing applicability.
- **Penalty Oracle**: Implements Section 234F (₹1k vs ₹5k), Section 234A (1%/month), GST Section 47 (₹50/day regular vs ₹20/day nil return), and GST Section 50 (18% p.a. on delayed tax payment).

---

## Test File Structure
```
tests/e2e/
├── helpers.cjs           # Shared assertion utilities, HTTP client, and statutory calculation oracles
├── tier1_feature.cjs     # Tier 1: Feature Coverage (60 test cases across F01–F12)
├── tier2_boundary.cjs    # Tier 2: Boundary & Corner Cases (60 test cases across F01–F12)
├── tier3_pairwise.cjs    # Tier 3: Pairwise Combinations (16 cross-feature test cases)
├── tier4_scenarios.cjs   # Tier 4: Real-World Application Scenarios (6 user workflows)
└── run_tests.cjs         # Master test orchestrator and CLI reporter
```

---

## Instructions for Workers & Orchestrator
1. Run `cmd /c "node tests/e2e/run_tests.cjs"` at any time to assess implementation progress.
2. Address failures corresponding to your assigned milestone (M1, M2, M3).
3. In Milestone 4 (Final Acceptance), all 142 tests must pass with exit code 0.
