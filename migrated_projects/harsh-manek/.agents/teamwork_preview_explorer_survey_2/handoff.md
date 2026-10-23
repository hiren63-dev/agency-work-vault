# Interactive UI Tools & Production Parity Survey — Handoff Report

**Agent:** Explorer 2 (Interactive UI Tools & Production Parity Surveyor)  
**Date:** 2026-09-07T16:55:00Z  
**Target Codebase:** `harshmanek-portfolio`  
**Environments Examined:**
- Localhost Dev Server: `http://localhost:5173/` (Chrome DevTools Page 4)
- Production Vercel App: `https://harshmanek-portfolio.vercel.app/` (Chrome DevTools Page 3)

---

## 1. Observation

### 1.1 File Locations & Architecture Overview
All 4 interactive tools and their supporting wrappers are located inside the monolithic file:
`c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\src\App.tsx`

| Component | File Path | Line Range | Purpose & Context |
| :--- | :--- | :--- | :--- |
| **`DynamicTimeline`** | `src/App.tsx` | 665–689 | Section `#services`: alternating timeline with scroll-linked beam displaying 8 core practice areas. |
| **`ServiceCard`** | `src/App.tsx` | 545–662 | Child card of `DynamicTimeline`: accordion expandable with "Documents Needed" vs "Our Process" tabs. |
| **`ToolsHub`** | `src/App.tsx` | 692–710 | Container section `#tools` wrapping the financial utilities. |
| **`TaxSandbox`** | `src/App.tsx` | 713–860 | Income tax take-home pay simulator with Old vs New regime automated comparison. |
| **`InvoiceStrategist`** | `src/App.tsx` | 862–945 | Reverse invoice calculator (net pocket target → base fee, GST rate, TDS Sec 194J). |
| **`PenaltySimulator`** | `src/App.tsx` | 947–1047 | Due date delay slider (ITR AY 2026-27, late fee Sec 234F, interest Sec 234A) with animated mascot. |
| **`DocumentChecklist`** | `src/App.tsx` | 1050–1120 | Accompanying utility card: dropdown for ITR, GST, Pvt Ltd, Tax Audit document checklists. |

### 1.2 Build & Linter Diagnostics
1. **Production Build**:
   ```bash
   cmd.exe /c "npm run build"
   ```
   **Result:** `0 errors` (TypeScript 6.0.2 / Vite 8.2.2 passed cleanly in 835ms).
   - Dist bundle: `dist/assets/index-CDq9uYYq.css` (58.20 kB), `dist/assets/index-n4LiHiQZ.js` (467.68 kB).

2. **Linter Analysis**:
   ```bash
   cmd.exe /c "npx oxlint"
   ```
   **Output:**
   - `! react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'animatedTakehome'` at `src/App.tsx:765:6`.
     ```ts
     // src/App.tsx:751-765
     useEffect(() => {
       let start = animatedTakehome;
       const end = takeHome;
       if (start === end) return;
       const duration = 400;
       ...
     }, [takeHome]);
     ```
   - `! react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders` at `src/App.tsx:149:5` (`setMobileMenuOpen(false)` inside `Navbar`).

3. **Browser Console Diagnostics (Chrome DevTools Page 3 Production vs Page 4 Localhost)**:
   Both localhost (`http://localhost:5173/`) and production (`https://harshmanek-portfolio.vercel.app/`) report:
   - `[issue] No label associated with a form field (count: 7)`
   - `[issue] A form field element should have an id or name attribute (count: 6)`
   - `0 runtime or unhandled JavaScript exceptions`.

---

### 1.3 Deep-Dive Audit of the 4 Interactive Tools

#### Tool 1: Tax Sandbox (`src/App.tsx:713-860`)
- **State Model**:
  ```ts
  const [income, setIncome] = useState("1200000");
  const [deductions, setDeductions] = useState([
    { id: '80c', name: '80C Investments (PPF, ELSS)', max: 150000, active: false, desc: 'Max limit ₹1.5L' },
    { id: '80ccd', name: 'NPS (Pension System)', max: 50000, active: false, desc: 'Extra ₹50k under 80CCD(1B)' },
    { id: '80d', name: 'Health Insurance', max: 75000, active: false, desc: 'Up to ₹75k limit' },
    { id: '24b', name: 'Home Loan Interest', max: 200000, active: false, desc: 'Up to ₹2L limit' }
  ]);
  const [animatedTakehome, setAnimatedTakehome] = useState(0);
  ```
- **Inputs**:
  - `income`: Single uncontrolled/formatted text input (`inputMode="numeric"`), formatted as Indian locale (`val.toLocaleString('en-IN')`).
  - `deductions`: 4 binary toggles with fixed maximum amounts (₹1.5L, ₹50k, ₹75k, ₹2L). Users cannot input custom actual deduction amounts.
  - No regime selection switch: The system automatically picks whichever regime yields lower tax (`const isOldBetter = taxOld < taxNew; const finalTax = isOldBetter ? taxOld : taxNew;`).
- **Calculation Logic & Statutory Accuracy**:
  - **Standard Deduction**: Hardcoded to `const stdDed = 50000;`.
    * *Statutory Reality*: Under the New Tax Regime for FY 2024-25 & FY 2025-26 (Finance (No. 2) Act 2024), standard deduction for salaried individuals was increased to **₹75,000**.
  - **New Regime Slab Function**:
    ```ts
    if (inc <= 300000) return 0;
    if (inc <= 700000) return 0; // Rebate
    if (inc <= 1000000) return 20000 + (inc - 700000) * 0.10;
    if (inc <= 1200000) return 50000 + (inc - 1000000) * 0.15;
    if (inc <= 1500000) return 80000 + (inc - 1200000) * 0.20;
    return 110000 + (inc - 1500000) * 0.30;
    ```
    * *Marginal Relief Flaw (Section 87A)*: If taxable income is ₹7,00,000, tax is ₹0. But if taxable income is ₹7,00,001, tax immediately jumps to ₹20,000.10 + 4% cess. The statutory marginal relief proviso under Section 87A (capping tax to the excess income above ₹7,00,000) is omitted.
    * *Surcharge*: High-income surcharges (> ₹50L: 10%, > ₹1Cr: 15%, > ₹2Cr: 25%) are not implemented.
- **Animation & Physics**:
  - Counter animation uses raw `window.requestAnimationFrame` with polynomial easeOut `1 - Math.pow(1 - progress, 5)` over 400ms duration. It does **not** use Framer Motion springs (`SPRING_SNAPPY` or `motion.span`).
  - Toggle switch animation uses pure CSS transitions: `transition-colors duration-300` and `transition-transform duration-300 shadow-md`.
- **Accessibility**:
  - Toggles are rendered as `div onClick={() => toggleDed(i)}`:
    * `tag: "div"`, `role: "none"`, `tabIndex: -1`, `ariaLabel: "none"`, `ariaChecked: "none"`.
    * Completely unnavigable and unclickable via keyboard (Tab / Enter / Space).
  - Income text field `<input>` has a visual label above it, but no `id`, no `htmlFor`, and no `aria-label`.
  - No `aria-live="polite"` on results (screen readers do not announce calculated take-home pay when changed).

---

#### Tool 2: Dynamic Timeline (`src/App.tsx:545-689`)
- **Current Role**:
  `DynamicTimeline` renders the firm's 8 practice areas (Accounting, Direct Tax, Indirect Tax, Auditing, Corporate Advisory, DSC, Project Finance, Business Formation) along an alternating left/right timeline with an animated vertical light beam.
- **State Model**:
  - `DynamicTimeline`: `containerRef = useRef(null)`, `useScroll({ target: containerRef, offset: ["start center", "end center"] })`, `useTransform(scrollYProgress, [0, 1], ["0%", "100%"])`.
  - `ServiceCard`: `const [expanded, setExpanded] = useState(false);`, `const [activeTab, setActiveTab] = useState<"docs" | "process">("docs");`.
- **Animation & Spring Physics**:
  - Card view entry: `viewport={{ once: true, margin: "-80px" }}`, `transition={{ ...SPRING_SNAPPY, delay: index * 0.05 }}` where `SPRING_SNAPPY = { type: "spring", stiffness: 240, damping: 26, mass: 1 }`.
  - Accordion expand/collapse: `AnimatePresence` with `transition={SPRING_SNAPPY}` and height animation.
  - Tab transition: `mode="wait"`, `transition={SPRING_MICRO}` (`stiffness: 450, damping: 30, mass: 0.8`).
- **Critical Feature Gap vs Requirements**:
  - The specification explicitly requests:
    `Dynamic Timeline (compliance calendar / statutory deadlines / milestones)`
  - Currently, `DynamicTimeline` in the codebase displays **Core Practice Areas**, not a statutory compliance calendar.
  - In git commit `HEAD:src/App.tsx`, there existed an `InteractiveTaxCalendar` with `DEADLINES.business` and `DEADLINES.individual`, but that component was removed when `ToolsHub` was injected.
  - The footer at line 1534 retains `{ label: "Tax Deadlines 2025-26", href: "/#tools" }`, which leads to `#tools` where no statutory compliance timeline exists.
- **Accessibility**:
  - The outer card is an unadorned `div` with `onClick={() => setExpanded(!expanded)}`:
    * `tag: "div"`, `role: "none"`, `tabIndex: -1`, `ariaLabel: "none"`, `ariaExpanded: "none"`.
    * Keyboard users cannot tab to or press Enter/Space to expand services.
  - Tab buttons inside expanded cards have `<button>`, but lack `role="tab"` and `aria-selected`.

---

#### Tool 3: Invoice Strategist (`src/App.tsx:862-945`)
- **State Model**:
  ```ts
  const [target, setTarget] = useState("100000");
  const [gstRate, setGstRate] = useState(18);
  const [hasTds, setHasTds] = useState(false);
  ```
- **Calculation Logic**:
  ```ts
  const numTarget = parseInt(target.replace(/[^0-9]/g, "")) || 0;
  const base = hasTds ? (numTarget / 0.9) : numTarget;
  const gstAmt = (base * gstRate) / 100;
  const totalInvoice = base + gstAmt;
  const tdsAmt = hasTds ? (base * 0.10) : 0;
  const clientPays = totalInvoice - tdsAmt;
  const netCash = clientPays - gstAmt;
  ```
  - Math is correct for reverse-engineering net take-home when client withholds 10% TDS under Section 194J.
- **Critical Feature Gaps vs Requirements**:
  - Requirement: `Invoice Strategist (GST invoicing, e-way bill / e-invoicing thresholds / compliance check)`
  - **Missing Compliance Capabilities**:
    1. **E-Way Bill Threshold Check**:
       - Under Rule 138 of CGST Rules, an e-way bill is mandatory when invoice / consignment value exceeds ₹50,000 (inter-state) or state-notified threshold (Gujarat intra-state ₹50,000). Tool does not flag when invoice exceeds ₹50,000.
    2. **E-Invoicing Mandate Check**:
       - Under Rule 48(4) of CGST Rules, e-invoicing (IRN generation on IRP) is legally mandatory for all B2B transactions if the entity's aggregate turnover exceeded **₹5 Crore** in any preceding financial year from 2017-18 onwards.
    3. **HSN / SAC Code Guidance**:
       - For CA / accounting / legal services: SAC 9982 (Accounting, auditing, and bookkeeping services). Missing 4-digit / 6-digit HSN mapping guidance.
    4. **Interstate vs Intrastate Toggle**:
       - Always assumes CGST + SGST (50/50 split). No IGST option for inter-state clients outside Gujarat.
- **Animation & Physics**:
  - Instantaneous numerical state changes without spring physics or rolling animation.
  - Rate buttons use CSS `transition-colors`.
  - TDS switch uses CSS `transition-transform duration-300`.
- **Accessibility**:
  - TDS toggle switch is a `div onClick={() => setHasTds(!hasTds)}`: `tabIndex: -1`, no `role="switch"`, no `aria-checked`.
  - GST Rate buttons lack `aria-pressed`.
  - Target amount `<input>` lacks `id`/`htmlFor` and `aria-label`.
  - Results card lacks `aria-live="polite"`.

---

#### Tool 4: Penalty Simulator (`src/App.tsx:947-1047`)
- **State Model**:
  ```ts
  const [delay, setDelay] = useState(0);
  const min = -30, max = 150, range = 180;
  ```
- **Calculation Logic**:
  ```ts
  const fFee = val > 0 ? 5000 : 0;
  const aFee = val > 0 ? 100000 * 0.01 * Math.ceil(val / 30) : 0;
  const total = fFee + aFee;
  ```
- **Critical Statutory Gaps vs Requirements**:
  - Requirement: `Penalty Simulator (GST / Income Tax late filing fee, interest u/s 234A/B/C, 47A)`
  - **Income Tax Gaps**:
    1. **Section 234F Flaw**: Late fee is hardcoded to ₹5,000. Under the proviso to Section 234F, if total income does not exceed ₹5,00,000, late fee is capped at **₹1,000**; if income is below basic exemption limit, late fee is **₹0**.
    2. **Hardcoded ₹1,00,000 Tax**: Section 234A interest is calculated against a hardcoded ₹1,00,000 hypothetical tax liability.
    3. **Missing Section 234B**: Interest @ 1% per month for default in payment of advance tax (if advance tax paid < 90% of assessed tax).
    4. **Missing Section 234C**: Interest @ 1% per month for shortfall in advance tax installments (15% Jun 15, 45% Sep 15, 75% Dec 15, 100% Mar 15).
  - **GST Gaps (Completely Absent)**:
    1. **Section 47 Late Fee**:
       - Nil GSTR-3B / GSTR-1: ₹20/day (₹10 CGST + ₹10 SGST), statutory maximum ₹500.
       - Normal return (Turnover up to 1.5 Cr): ₹50/day (₹25 CGST + ₹25 SGST), capped at ₹2,000.
       - Turnover 1.5 Cr to 5 Cr: ₹50/day, capped at ₹5,000.
       - Turnover > 5 Cr: ₹50/day, capped at ₹10,000.
    2. **Section 50 / 47A Interest**: 18% per annum on net cash tax liability.
    3. **No GST vs ITR Switcher**: Tool only models ITR AY 2026-27.
- **External Asset Dependency Warning**:
  - Mascot images are fetched from an external CDN:
    `https://em-content.zobj.net/source/apple/391/relieved-face_1f60c.png`
    `https://em-content.zobj.net/source/apple/391/worried-face_1f61f.png`
    `https://em-content.zobj.net/source/apple/391/anxious-face-with-sweat_1f630.png`
    `https://em-content.zobj.net/source/apple/391/face-screaming-in-fear_1f631.png`
  - In restricted network environments or offline localhost testing, these images break. They should be replaced with native vector SVG / Lucide icons or localized assets.
- **Animation & Physics**:
  - Mascot relies on CSS `@keyframes float`, `jiggle`, `panic` injected via `<style dangerouslySetInnerHTML>`.
  - Slider thumb does not have spring-damped tracking; it tracks the raw slider position.
- **Accessibility**:
  - Slider input has `className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"`.
  - Because `opacity-0` is used without custom `:focus-visible` styling on the thumb, **there is zero visual focus indication** when tabbing into the slider.
  - No `aria-label`, `aria-valuemin`, `aria-valuemax`, or `aria-valuetext` (e.g. `aria-valuetext="15 days late, August 15, ₹6,000 penalty"`).

---

## 2. Logic Chain

1. **Premise 1 (Code Location & Architecture)**:
   - Direct observation of `src/App.tsx` shows that lines 545–1120 contain the entire implementation of `DynamicTimeline`, `TaxSandbox`, `InvoiceStrategist`, `PenaltySimulator`, and `DocumentChecklist`.
   - The project builds cleanly with `cmd.exe /c "npm run build"`, showing no syntax or compilation blockers.

2. **Premise 2 (Accessibility Baseline)**:
   - Chrome DevTools evaluation on live DOM confirmed that all toggle switches (`TaxSandbox` lines 808-816, `InvoiceStrategist` lines 903-911) and accordion containers (`DynamicTimeline` lines 563-566) are rendered as plain `<div>` elements with `onClick` handlers.
   - None of these elements have `tabIndex={0}`, `role="button"` or `role="switch"`, `aria-checked`, `aria-expanded`, or keyboard event listeners (`onKeyDown`).
   - Consequently, keyboard navigation (WCAG 2.1 Success Criterion 2.1.1 Keyboard) and screen reader accessibility (WCAG 4.1.2 Name, Role, Value) are currently non-compliant.

3. **Premise 3 (Statutory Parity & Requirements Coverage)**:
   - Comparing the codebase against the user prompt requirements:
     * *Dynamic Timeline*: The prompt specifies `(compliance calendar / statutory deadlines / milestones)`. The current implementation only shows Practice Area descriptions, while statutory deadlines are completely absent from the interactive section.
     * *Invoice Strategist*: The prompt specifies `(GST invoicing, e-way bill / e-invoicing thresholds / compliance check)`. The current implementation only performs basic reverse arithmetic (`base = target / 0.9`), omitting e-way bill thresholds (₹50k), e-invoicing mandates (₹5 Cr), and HSN/SAC codes.
     * *Penalty Simulator*: The prompt specifies `(GST / Income Tax late filing fee, interest u/s 234A/B/C, 47A)`. The current implementation only covers Section 234F (with an incorrect flat ₹5k fee) and Section 234A interest, omitting 234B, 234C, and the entire GST penalty structure (Sec 47 and Sec 50).
     * *Tax Sandbox*: Standard deduction is hardcoded to ₹50k instead of ₹75k (Finance Act 2024 New Regime update), and Section 87A marginal relief is omitted.

4. **Premise 4 (Spring Physics & Motion Consistency)**:
   - Three well-crafted spring constants exist in `src/App.tsx` (`SPRING_HEAVY`, `SPRING_SNAPPY`, `SPRING_MICRO`), but their usage is inconsistent:
     * `DynamicTimeline` effectively uses `SPRING_SNAPPY` and `SPRING_MICRO` for scroll reveals, chevron rotations, and tab switches.
     * `TaxSandbox` relies on an ad-hoc `requestAnimationFrame` polynomial ease-out for rolling numbers and basic CSS transitions for switches.
     * `InvoiceStrategist` has zero motion spring transitions for calculation outputs.
     * `PenaltySimulator` uses raw CSS keyframes and external PNG emojis rather than integrated Framer Motion spring physics.

---

## 3. Caveats

1. **Localhost Isolation Constraint**:
   - The production website at `https://harshmanek-portfolio.vercel.app/` was inspected in read-only mode via Chrome DevTools. No remote deployment mutations were triggered or attempted.
2. **ICAI Regulatory Compliance**:
   - Any enhancements to these tools must strictly comply with ICAI Code of Ethics (no sensationalized marketing, no guaranteed outcome claims, clear disclaimers that tools provide mathematical simulations rather than formal legal advice).
3. **External Network Policy**:
   - The external Apple emoji images from `em-content.zobj.net` in `PenaltySimulator` were accessible during inspection but represent a fragile network dependency.

---

## 4. Conclusion

The 4 interactive tools provide a strong visual foundation and build cleanly with 0 TypeScript errors, but have **four critical gap areas** that must be resolved for production parity and anti-slop excellence:

### Prioritized Gap Breakdown

| Priority | Category | Specific Gap | Proposed Solution |
| :--- | :--- | :--- | :--- |
| **P0** | **Accessibility (a11y)** | Toggles & cards are unkeyboardable `div` elements lacking ARIA roles, states, and focus indicators. | Convert all toggles to `<button role="switch" aria-checked={...}>`, add visible focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-400`), attach labels via `id`/`htmlFor`, and add `aria-live="polite"` to result displays. |
| **P0** | **Compliance Scope (Dynamic Timeline)** | `DynamicTimeline` only shows practice areas; statutory compliance calendar is missing. | Add a dual-mode toggle or dedicated statutory compliance timeline tracking key deadlines (Advance Tax Q1–Q4, GSTR-1/3B, ITR filing, Tax Audit, MCA ROC). |
| **P1** | **Statutory Accuracy (Tax Sandbox)** | Standard deduction is ₹50k instead of ₹75k; Section 87A marginal relief is missing; no side-by-side Old vs New toggle. | Update New Regime standard deduction to ₹75,000, incorporate 87A marginal relief formula, and allow users to view side-by-side Old vs New breakdown. |
| **P1** | **Compliance Checks (Invoice Strategist)** | Missing E-Way Bill threshold (₹50k) and E-Invoicing mandate (₹5 Cr) indicators. | Add an automatic compliance badge: "E-Way Bill Mandatory (Consignment > ₹50,000)" and "E-Invoicing Applicability (Turnover > ₹5 Cr under Rule 48(4))", plus SAC 9982 indicator. |
| **P1** | **Statutory Breadth (Penalty Simulator)** | Missing Section 234B, 234C, and GST late fee (Sec 47) / interest (Sec 50). | Add a mode toggle between "Income Tax (Sec 234A/B/C/F)" and "GST (Sec 47 & 50)", replace external emoji CDN with local SVG badges, and provide customizable tax liability input. |
| **P2** | **Motion Physics** | Inconsistent Framer Motion spring usage; ad-hoc `requestAnimationFrame` in Tax Sandbox; static updates in Invoice Strategist. | Standardize all number counters and card morphs to use `motion.span` with `SPRING_SNAPPY` / `SPRING_MICRO`. |

---

## 5. Verification Method

### How to Independently Verify All Claims

1. **Verify Clean Production Build**:
   ```powershell
   cmd.exe /c "npm run build"
   ```
   *Expected Output*: `tsc -b && vite build` exits with code 0.

2. **Verify Oxlint Warnings**:
   ```powershell
   cmd.exe /c "npx oxlint"
   ```
   *Expected Output*: Identifies `react-hooks(exhaustive-deps)` in `src/App.tsx:765:6` and `react(set-state-in-effect)` in `src/App.tsx:149:5`.

3. **Verify DOM Accessibility Gaps via Browser Script**:
   Open DevTools on `http://localhost:5173/` and execute in Console:
   ```js
   const toggles = Array.from(document.querySelectorAll('#tools div[class*="cursor-pointer"]'));
   console.log('Unaccessible toggles found:', toggles.map(el => ({
     text: el.innerText.split('\n')[0],
     tag: el.tagName,
     role: el.getAttribute('role'),
     tabIndex: el.tabIndex
   })));
   ```
   *Expected Result*: Returns 5 elements (`80C`, `NPS`, `Health Insurance`, `Home Loan`, `Client deducts 10% TDS`) with `role: null` and `tabIndex: -1`.

4. **Verify Calculation Logic Gaps**:
   - Input ₹7,00,001 in Tax Sandbox: Notice tax jumps immediately to ₹20,000 instead of benefiting from Section 87A marginal relief.
   - Input ₹60,000 in Invoice Strategist: Notice zero prompt or warning regarding the ₹50,000 E-Way bill threshold.
   - Slider in Penalty Simulator: Notice absence of GST late fees or Section 234B/C interest calculations.

5. **Invalidation Conditions**:
   - If `src/App.tsx` is refactored into modular components (`src/components/tools/TaxSandbox.tsx`, etc.), the exact line numbers (lines 545–1120) will shift.
   - If Vite configuration is altered or dependencies updated, verify build output paths.
