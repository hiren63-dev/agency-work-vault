# BRIEFING — 2026-09-07T16:51:30Z

## Mission
Survey and audit the 4 interactive UI tools (Tax Sandbox, Dynamic Timeline, Invoice Strategist, Penalty Simulator) in the codebase for implementation completeness, calculation logic, state models, animation physics, accessibility, and production parity gaps.

## 🔒 My Identity
- Archetype: Explorer
- Roles: Interactive UI Tools & Production Parity Surveyor
- Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_2
- Original parent: d6c15049-b919-4894-82fc-205711b9df37
- Milestone: Explorer Phase 1 - Interactive Tools & Parity Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code
- File workspace discipline: write only to .agents/teamwork_preview_explorer_survey_2
- Follow Handoff Protocol: 5-component handoff report (handoff.md)
- Report back to parent via send_message

## Current Parent
- Conversation ID: d6c15049-b919-4894-82fc-205711b9df37
- Updated: 2026-09-07T16:51:30Z

## Investigation State
- **Explored paths**:
  - `src/App.tsx` (Lines 1-1934, specifically 545-1120)
  - `audit-reports/cycle-1/` and `audit-reports/cycle-2/`
  - `package.json`, `inject_tools.cjs`, `tools_code.txt`, `recover.cjs`
  - Chrome DevTools MCP: Page 3 (Production) vs Page 4 (Localhost)
- **Key findings**:
  - Localhost (http://localhost:5173/) and Production (https://harshmanek-portfolio.vercel.app/) currently mirror the same 4 tools in `#tools` + DynamicTimeline in `#services`.
  - Build passes cleanly (`npm run build`: 0 TypeScript / Vite errors, built in 835ms).
  - Oxlint reports 1 exhaustive-deps warning in TaxSandbox (`animatedTakehome` missing in useEffect dependency array) and 1 set-state-in-effect warning in Navbar.
  - Critical A11y failures: Toggles and accordion cards use unadorned `div` tags with `onClick`, lacking `tabIndex`, `role="switch"` / `role="button"`, `aria-checked`, `aria-expanded`, and keyboard listeners (`onKeyDown`).
  - Critical Functional Gaps:
    * Dynamic Timeline is currently a practice services showcase, NOT a compliance calendar / statutory deadlines timeline (earlier `InteractiveTaxCalendar` was removed; footer link to `/ #tools` for deadlines is orphaned).
    * Invoice Strategist lacks E-Way Bill threshold checks (₹50k) and E-Invoicing mandate checks (₹5 Cr turnover Rule 48(4)).
    * Penalty Simulator lacks Section 234B, 234C, and GST late fee (Sec 47) / interest (Sec 50 / 47A), and relies on hardcoded ₹1L tax with external Apple emoji CDN images.
    * Tax Sandbox New Regime standard deduction is hardcoded to ₹50k instead of ₹75k (Budget 2024), lacks 87A marginal relief calculation, and lacks user-selectable manual regime toggle.
  - Motion Physics: Spring constants (`SPRING_SNAPPY`, `SPRING_MICRO`) exist in `App.tsx`, but are only partially adopted across tools. Numbers in InvoiceStrategist update without spring animation; TaxSandbox rolling counter uses manual `requestAnimationFrame` polynomial easeOut.
- **Unexplored areas**: None. All 4 tools surveyed across state models, formulas, animation, a11y, and responsive layout.

## Key Decisions Made
- Audited live DOM and accessibility tree via Chrome DevTools MCP on both Localhost (Page 4) and Production (Page 3).
- Validated build integrity via `cmd.exe /c "npm run build"`.
- Documenting findings in comprehensive `handoff.md` with concrete before/after recommendations.

## Artifact Index
- DISPATCH.md — Initial dispatch log
- BRIEFING.md — Persistent situational awareness
- progress.md — Liveness heartbeat
- handoff.md — 5-component structured handoff report
