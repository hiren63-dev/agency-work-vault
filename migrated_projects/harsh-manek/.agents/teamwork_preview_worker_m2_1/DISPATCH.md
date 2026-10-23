# DISPATCH: Milestone 2 Worker (Interactive Generative UI Tools)

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m2_1
- **Role**: Milestone 2 Implementation Worker
- **Original Request**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
- **Project Spec**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
- **Explorer Survey Report**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_2\handoff.md
- **Test Specs & Runner**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md

## Scope of Work (Milestone 2)
1. **Dynamic Timeline & Statutory Deadlines Calendar (F05)**:
   - Enhance `DynamicTimeline` with a dual-view or dedicated statutory compliance calendar mode:
     - Deadlines covered: ITR filing (July 31), Tax Audit u/s 44AB (October 31 / September 30), Monthly/Quarterly GSTR-3B (20th of subsequent month), Advance Tax installments (June 15, Sept 15, Dec 15, March 15), MCA ROC annual return (October 30).
     - Full keyboard navigation and ARIA support (`role="button"`, `aria-expanded`).
     - Smooth spring physics transitions (`SPRING_SNAPPY`, `SPRING_MICRO`).
2. **Enhanced Tax Sandbox (F06)**:
   - New Regime Standard Deduction: Update from ₹50,000 to **₹75,000** (per Finance (No. 2) Act 2024).
   - Section 87A Full Rebate & Marginal Relief:
     - If taxable income <= ₹7,00,000: Tax = ₹0.
     - Marginal relief proviso: If taxable income > ₹7,00,000, tax liability shall not exceed the amount by which taxable income exceeds ₹7,00,000.
     - Add 4% Health & Education cess.
   - Accessibility & ARIA:
     - Convert toggle switches from plain `<div>` to `<button role="switch" aria-checked={...} tabIndex={0}>` with visible focus rings.
     - Attach `id` and `htmlFor` to income input and labels.
     - Add `aria-live="polite"` on results card.
3. **Enhanced Invoice Strategist (F07)**:
   - Retain reverse invoice calculation.
   - Add **Rule 138 E-Way Bill threshold indicator**: Display an automatic compliance indicator when consignment / total invoice value exceeds ₹50,000 ("E-Way Bill Mandatory (Consignment > ₹50,000 under Rule 138)").
   - Add **Rule 48(4) E-Invoicing applicability badge**: Clarifying the mandatory IRN generation requirement for entities with aggregate turnover exceeding ₹5 Crore.
   - Add **SAC Code 9982** indicator for accounting, tax, and auditing services.
   - Support interstate IGST (single rate) vs intra-state CGST+SGST (half rate each).
   - Convert TDS toggle to `<button role="switch" aria-checked={...}>` with visible keyboard focus rings.
4. **Enhanced Penalty Simulator (F08)**:
   - Add dual-mode selector: "Income Tax (Sec 234A/B/C/F)" vs "GST (Sec 47 & 50)".
   - **Income Tax Mode**:
     - Section 234F: Late fee is ₹1,000 if total income <= ₹5,00,000; ₹5,000 if income > ₹5,00,000; ₹0 if below basic exemption limit.
     - Section 234A interest: 1% per month or part of a month on unpaid tax.
     - Section 234B & 234C reference/indicators.
   - **GST Mode**:
     - Section 47 late fee: ₹20/day (₹10 CGST + ₹10 SGST) for Nil returns (max ₹500); ₹50/day (₹25 CGST + ₹25 SGST) for regular returns (capped per turnover slab).
     - Section 50 interest: 18% per annum on net tax liability.
   - Replace external Apple emoji PNGs (`em-content.zobj.net`) with local inline vector SVGs or Lucide icons.
   - Accessible slider: Add custom `:focus-visible` styling, `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.
5. **Verification**:
   - Run `cmd /c "npm run build"` to verify 0 errors.
   - Run `cmd /c "node tests/e2e/run_tests.cjs"` to verify 100% of tests pass (142/142).

## Exclusive Write Ownership
- `src/App.tsx`

## 2026-09-07T17:29:53Z
You are the Milestone 2 Worker (teamwork_preview_worker) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m2_1
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Dispatch details: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m2_1\DISPATCH.md
Test suite: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md
Explorer survey: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_2\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
- `src/App.tsx`

Scope & Tasks:
1. Dynamic Timeline & Statutory Deadlines Calendar (F05):
   - Enhance `DynamicTimeline` or `ToolsHub` with a statutory compliance calendar view/toggle tracking statutory deadlines:
     - ITR filing (July 31), Tax Audit u/s 44AB (October 31 / September 30), GSTR-3B (20th of subsequent month), Advance Tax installments (June 15, Sept 15, Dec 15, March 15), MCA ROC annual return (October 30).
     - Full keyboard navigation and ARIA support (`role="button"`, `aria-expanded`).
2. Enhanced Tax Sandbox (F06):
   - Update New Regime Standard Deduction to ₹75,000.
   - Implement Section 87A full rebate (tax = 0 if taxable income <= ₹7,00,000) and marginal relief proviso (tax liability capped at income exceeding ₹7,00,000) + 4% cess.
   - Convert switches to `<button role="switch" aria-checked={...}>` with visible focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-400`).
   - Add `id`/`htmlFor` and `aria-live="polite"` on results.
3. Enhanced Invoice Strategist (F07):
   - Retain reverse invoice calculation.
   - Add Rule 138 E-Way bill threshold check: Flag when invoice/consignment value > ₹50,000.
   - Add Rule 48(4) E-Invoicing badge: Informing mandatory IRN generation when turnover > ₹5 Cr.
   - Add SAC Code 9982 indicator for accounting/auditing services.
   - Support interstate IGST vs intra-state CGST/SGST.
   - Convert TDS switch to `<button role="switch" aria-checked={...}>`.
4. Enhanced Penalty Simulator (F08):
   - Add dual-mode selector: Income Tax (Sec 234A/B/C/F) vs GST (Sec 47 & 50).
   - Income Tax: Sec 234F late fee (₹1,000 for income <= ₹5L, ₹5,000 for income > ₹5L), Sec 234A interest (1%/month).
   - GST: Sec 47 late fee (₹20/day Nil, ₹50/day regular, capped), Sec 50 interest (18% p.a.).
   - Replace external Apple emoji PNG hotlinks with local SVG badges or Lucide icons.
   - Accessible keyboard slider with `:focus-visible` styling, ARIA attributes.
5. Verification:
   - Run `cmd /c "npm run build"` to verify 0 errors.
   - Run `cmd /c "node tests/e2e/run_tests.cjs"` to verify 142/142 tests pass!
6. Write handoff report to `handoff.md` and notify parent via `send_message`.

