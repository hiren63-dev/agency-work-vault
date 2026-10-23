# E2E Test Infra: Harsh Manek & Co. Portfolio

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and user-facing requirements, not implementation internals.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- Environment: Isolated localhost `http://localhost:5173/` and production build (`dist/`). Zero remote Vercel mutations.

## Feature Inventory (12 Features)
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| F01 | Localhost Isolation & Build Parity | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F02 | ICAI Code of Ethics Compliance | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F03 | Anti-Slop Copy & A11y Contrast | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F04 | Taste Architect Luxury Design | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F05 | Dynamic Timeline & Statutory Deadlines | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| F06 | Enhanced Tax Sandbox | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| F07 | Enhanced Invoice Strategist | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| F08 | Enhanced Penalty Simulator | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| F09 | Dynamic Blog Routing & Resilience | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F10 | SEO, GEO & AEO Architecture | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F11 | Crawler Directives & Sitemap | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F12 | Comprehensive E2E Verification | ORIGINAL_REQUEST Acceptance | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Location**: `tests/e2e/`
- **Runner**: Node.js test script (`cmd /c "node tests/e2e/run_tests.cjs"`)
- **Execution semantics**: Exit code 0 on all tests passing; nonzero with failure details if any test fails.
- **Verification mechanisms**:
  - Direct HTTP/DOM verification of running server (`http://localhost:5173/`)
  - Static AST and file assertions on source/build artifacts
  - Statutory calculation oracle tests for tax, invoice, and penalty formulas
  - Accessibility contrast & ARIA attribute validation

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Salaried Tech Professional Tax Optimization | F06, F05, F02 | High |
| 2 | Rajkot Manufacturing Unit GST & Invoice Invoicing Compliance | F07, F08, F05, F10 | High |
| 3 | Corporate Annual Statutory Audit & MCA Compliance Onboarding | F02, F05, F09, F03 | Medium |
| 4 | Belated Return & Penalty Assessment Workflow | F08, F06, F02 | Medium |
| 5 | Local Search Discovery & FAQ Answering Journey | F10, F11, F04, F02 | Medium |

## Coverage Thresholds
- Tier 1: ≥ 5 test cases per feature (60+ cases)
- Tier 2: ≥ 5 boundary and corner cases per feature (60+ cases)
- Tier 3: Pairwise combinations across major features (15+ cases)
- Tier 4: Real-world user workflows (5+ cases)
- **Target Total**: ≥ 140 test cases
