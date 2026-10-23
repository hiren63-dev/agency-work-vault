# DISPATCH: E2E Test Writer

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_test_writer_e2e_1
- **Role**: E2E Test Suite Creator
- **Scope**:
  - Build comprehensive opaque-box automated test harness in `tests/e2e/` (e.g. `tests/e2e/run_tests.cjs`).
  - Implement test cases covering Tiers 1-4 across all 12 features from `TEST_INFRA.md` and `PROJECT.md`:
    - Tier 1: Feature coverage (>= 5 per feature, 60+ cases).
    - Tier 2: Boundary & corner cases (>= 5 per feature, 60+ cases).
    - Tier 3: Pairwise combinations (>= 15 cases).
    - Tier 4: Real-world application scenarios (>= 5 cases).
  - Test runner must execute cleanly via `cmd /c "node tests/e2e/run_tests.cjs"`.
  - When test suite is built and ready, publish `TEST_READY.md` at project root with summary counts.
- **Exclusive Write Ownership**: `tests/e2e/**`, `TEST_READY.md`.
- **References**:
  - `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md`
  - `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md`
  - `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_INFRA.md`


## 2026-09-07T16:54:00Z
Received dispatch from parent d6c15049-b919-4894-82fc-205711b9df37:
You are the E2E Test Writer (teamwork_preview_test_writer) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_test_writer_e2e_1
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Test Infrastructure plan: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_INFRA.md

Instructions:
1. Read ORIGINAL_REQUEST.md, PROJECT.md, and TEST_INFRA.md.
2. Build an automated opaque-box test runner in `tests/e2e/run_tests.cjs` (or multiple test files executed by `run_tests.cjs`).
   - Implement test cases covering Tiers 1-4 for all 12 features:
     - Tier 1: Feature Coverage (>= 5 test cases per feature across F01 to F12 = 60+ cases).
     - Tier 2: Boundary & Corner Cases (>= 5 cases per feature across F01 to F12 = 60+ cases).
     - Tier 3: Pairwise Combinations (>= 15 cross-feature cases).
     - Tier 4: Real-World Application Scenarios (>= 5 comprehensive scenarios).
   - Total test cases should exceed 140.
   - The test script should be executable via `cmd /c "node tests/e2e/run_tests.cjs"` and report pass/fail per tier with a formatted summary table.
   - Tests should verify:
     - Localhost dev server availability (`http://localhost:5173/`) and zero remote deployment leakage.
     - ICAI compliance (absence of ratings, absence of "free consultation", presence of verified credentials).
     - Anti-slop rules (zero em dashes `\u2014`, WCAG AA contrast).
     - Taste architect standards (absence of purple glow).
     - Interactive tools (Tax Sandbox with ₹75k standard deduction & 87A relief, Invoice Strategist thresholds, Penalty Simulator ITR/GST logic).
     - Blog routing (`/blog/:id` dynamism).
     - SEO metadata, OpenGraph, JSON-LD schema, robots.txt, and sitemap.xml.
3. Verify that the test runner executes cleanly. Note: some tests may fail currently until workers complete implementation milestones — that is expected for TDD!
4. Write `TEST_READY.md` at project root summarizing the test runner command, test counts per tier, and feature checklist.
5. Write your handoff report to `handoff.md` in your working directory and notify the parent via send_message.
