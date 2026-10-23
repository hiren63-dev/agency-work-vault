# Handoff Report: Challenger 1 (Adversarial Coverage & Statutory Oracles)

**Verdict**: `CHALLENGE_DETECTED`

---

## 1. Observation

Direct code inspections and empirical execution revealed the following exact observations:

### Observation 1.1: Negative Delay Calculation in `tests/e2e/helpers.cjs`
- **File**: `tests/e2e/helpers.cjs` (Lines 297–310)
- **Code snippet**:
  ```javascript
  calculatePenaltyGST({ delayDays = 0, isNil = false, unpaidTax = 0 }) {
    // Section 47 Late Fee: ₹50/day (₹25 CGST + ₹25 SGST) or ₹20/day (nil return)
    const ratePerDay = isNil ? 20 : 50;
    const feeSec47 = delayDays * ratePerDay;

    // Section 50 Interest: 18% per annum on delayed tax payment
    const interestSec50 = delayDays > 0 ? Math.round(unpaidTax * (0.18 / 365) * delayDays * 100) / 100 : 0;

    return {
      feeSec47,
      interestSec50,
      totalLateCost: feeSec47 + interestSec50,
    };
  }
  ```
- **Empirical Execution Command**:
  ```bash
  node -e "const { statutoryOracles } = require('./tests/e2e/helpers.cjs'); console.log(statutoryOracles.calculatePenaltyGST({ delayDays: -10, unpaidTax: 20000 }));"
  ```
- **Verbatim Output**:
  ```json
  { "feeSec47": -500, "interestSec50": 0, "totalLateCost": -500 }
  ```
- **Application Comparison**: In `src/App.tsx` (line 1431), the client UI protects against this:
  ```typescript
  const feeSec47 = val > 0 ? val * ratePerDay : 0;
  ```
  However, the test oracle `helpers.cjs` lacks `delayDays > 0`, computing a negative fee (`-₹500` for 10 days early, `-₹1500` for 30 days early).

### Observation 1.2: Unrounded Floating-Point Currency in `tests/e2e/helpers.cjs`
- **File**: `tests/e2e/helpers.cjs` (Lines 165–187)
- **Code snippet**:
  ```javascript
    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;

    return {
      grossSalary,
      stdDeduction,
      taxable,
      baseTax: tax,
      cess,
      totalTax,
    };
  ```
- **Empirical Execution Command**:
  ```bash
  node -e "const { statutoryOracles } = require('./tests/e2e/helpers.cjs'); console.log(statutoryOracles.calculateNewRegimeTax(797223));"
  ```
- **Verbatim Output**:
  ```json
  {
    "grossSalary": 797223,
    "stdDeduction": 75000,
    "taxable": 722223,
    "baseTax": 22222.3,
    "cess": 889,
    "totalTax": 23111.3
  }
  ```
- **Application Comparison**: In `src/App.tsx` (line 1004), `taxNew` is rounded: `Math.round(baseTaxNew * 1.04) = 23111`. `helpers.cjs` yields `23111.3`, leaving unrounded fractional currency.

### Observation 1.3: Penalty Slider Maximum Range in `src/App.tsx`
- **File**: `src/App.tsx` (Line 1405 & Line 1633)
- **Code snippet**:
  ```typescript
  const min = -30, max = 150, range = 180;
  ```
  The slider `max` is restricted to 150 days, meaning delays up to the dispatched 180-day boundary cannot be selected directly in the UI slider, despite `range` being set to 180 (`150 - (-30) = 180`).

### Observation 1.4: Existing E2E Test Suite Execution
- **Command**: `cmd /c "node tests/e2e/run_tests.cjs"`
- **Result**:
  - Tier 1: 60/60 passed (100.0%)
  - Tier 2: 60/60 passed (100.0%)
  - Tier 3: 16/16 passed (100.0%)
  - Tier 4: 6/6 passed (100.0%)
  - Total: 142/142 passed (100.0%)
- **Test Gap**: `tier2_boundary.cjs` (lines 497–551) tests `delayDays: 0`, `delayDays: 1`, `delayDays: 10`, and `delayDays: 365`, but omitted negative delay tests for `calculatePenaltyGST`.

---

## 2. Logic Chain

1. **Premise 1 (Statutory Definition of Late Fees)**: Under Section 47 of the Central Goods and Services Tax (CGST) Act, 2017, late fees accrue only if a registered person fails to furnish a return by the due date. Filing before or on the due date (`delayDays <= 0`) carries a late fee of ₹0. A negative late fee is legally nonexistent.
2. **Step 1 (Observation 1.1)**: `statutoryOracles.calculatePenaltyGST` in `tests/e2e/helpers.cjs` multiplies `delayDays * ratePerDay` unconditionally without ensuring `delayDays > 0`. Consequently, for any negative delay (e.g., `-10` or `-30` days), it returns a negative fee (`-₹500` or `-₹1,500`).
3. **Premise 2 (Statutory Currency & Rounding Standards)**: Under Section 288B of the Income-tax Act, 1961, tax amounts must be rounded off to the nearest ₹10, and in UI accounting presentations, currency figures must resolve to integer rupees.
4. **Step 2 (Observation 1.2)**: `calculateNewRegimeTax` in `helpers.cjs` fails to round `baseTax` or `totalTax` after computing slab tax on incomes past the marginal relief threshold, returning floating-point fractions (e.g., `23111.3`), whereas `src/App.tsx` properly produces `23111`.
5. **Step 3 (App Robustness)**: In `src/App.tsx`, all statutory calculators function correctly across the tested edge cases:
   - **Tax Sandbox**: Correctly calculates ₹0 at ₹0 salary, full Section 87A rebate (₹0 tax) up to ₹7,75,000 gross salary (₹7,00,000 taxable), exact marginal relief capping tax to excess income over ₹7,00,000 between ₹7,00,001 and ₹7,22,222 taxable, and handles all 16 deduction combinations.
   - **Invoice Strategist**: Correctly implements Rule 138 E-Way bill threshold at `totalInvoice > 50000` (exempt at ₹50,000, mandatory at ₹50,001), handles 0% to 28% GST in forward/reverse without divide-by-zero, accurately applies Section 194J 10% TDS to base fee, and splits CGST/SGST vs IGST cleanly.
   - **Penalty Simulator**: In `App.tsx`, accurately clamps fees to ₹0 when `val <= 0`, switches Section 234F fees between ₹1,000 and ₹5,000 at the ₹5L boundary, applies Section 234A 1%/month ceil stepping, and computes Section 50 interest at 18% p.a.
6. **Conclusion derived from Steps 1–5**: While `src/App.tsx` logic is sound and resilient, the test oracle in `tests/e2e/helpers.cjs` contains a severe boundary calculation defect for negative delay values and a precision defect in tax calculation. Therefore, `CHALLENGE_DETECTED` is warranted.

---

## 3. Caveats

1. **Review-Only Role**: Under role constraints, the challenger does NOT edit `tests/e2e/helpers.cjs` or `src/App.tsx`. Proposed fixes are documented for the worker/orchestrator.
2. **Surcharge Out-of-Scope**: Neither `src/App.tsx` nor `helpers.cjs` implements High Net-Worth Individual (HNI) surcharge (> ₹50L: 10%, > ₹1Cr: 15%). This is consistent with the project scope defined in `PROJECT.md` (Feature F06 specifies Standard Deduction and Section 87A marginal relief only).
3. **UI Slider Cap**: In `src/App.tsx`, the slider cap is 150 days. Days > 150 cannot be chosen via the UI slider, though the underlying mathematical functions handle them.

---

## 4. Conclusion

**Verdict: CHALLENGE_DETECTED**

The application code in `src/App.tsx` is robust, but the test oracle in `tests/e2e/helpers.cjs` must be hardened:

1. **Fix in `tests/e2e/helpers.cjs:300`**:
   Replace:
   ```javascript
   const feeSec47 = delayDays * ratePerDay;
   ```
   with:
   ```javascript
   const feeSec47 = delayDays > 0 ? delayDays * ratePerDay : 0;
   ```
2. **Fix in `tests/e2e/helpers.cjs:185`**:
   Ensure `baseTax` and `totalTax` are rounded:
   ```javascript
   const roundedBaseTax = Math.round(tax);
   const cess = Math.round(roundedBaseTax * 0.04);
   const totalTax = roundedBaseTax + cess;
   ```
3. **Optional UI polish in `src/App.tsx:1405`**:
   Adjust `max = 180, range = 210` if 180 full days of positive delay are intended to be user-selectable.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Negative Delay Oracle Defect**:
   ```bash
   node -e "const { statutoryOracles } = require('./tests/e2e/helpers.cjs'); console.log(statutoryOracles.calculatePenaltyGST({ delayDays: -10 }));"
   ```
   *Expected defect*: Returns `{ feeSec47: -500, interestSec50: 0, totalLateCost: -500 }`.

2. **Verify Unrounded Tax Float Defect**:
   ```bash
   node -e "const { statutoryOracles } = require('./tests/e2e/helpers.cjs'); console.log(statutoryOracles.calculateNewRegimeTax(797223));"
   ```
   *Expected defect*: Returns `{ baseTax: 22222.3, cess: 889, totalTax: 23111.3 }`.

3. **Verify Adversarial Stress Harness**:
   ```bash
   node tests/e2e/adversarial_oracle_stress.cjs
   ```
   *Expected result*: Runs 19 tests across Tax Sandbox, Invoice Strategist, and Penalty Simulator, passing 17 and flagging the 2 oracle challenges.

4. **Verify Full Baseline E2E Suite**:
   ```bash
   cmd /c "node tests/e2e/run_tests.cjs"
   ```
   *Expected result*: 142/142 tests pass cleanly across Tiers 1–4.
