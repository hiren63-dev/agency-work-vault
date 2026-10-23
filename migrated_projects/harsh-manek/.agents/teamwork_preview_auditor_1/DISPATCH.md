# DISPATCH: Forensic Auditor (Integrity Forensics)

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_auditor_1
- **Role**: Forensic Integrity Auditor
- **Target**: Perform comprehensive integrity verification on the entire project:
  - Check for cheating: No hardcoded test responses, no mock test facades, no dummy implementations.
  - Verify genuine business logic: Check calculations in `src/App.tsx`, genuine components, genuine data structures.
  - Verify static analysis and runtime tracing: Execute `cmd /c "npm run build"`, `cmd /c "node tests/e2e/run_tests.cjs"`.
  - Verify ICAI Code of Ethics compliance: Check zero fabricated ratings, zero testimonials, no superlatives, zero promotional undercutting.
  - Verify anti-slop rules: Check zero em dashes (`\u2014`), WCAG AA compliant contrast, no purple glow.
  - Verify localhost isolation: Ensure no remote Git remotes or deployment scripts.
- **Verdict Output**: Issue CLEAN or INTEGRITY VIOLATION in `handoff.md`.

## 2026-09-07T17:39:45Z
You are the Forensic Auditor (teamwork_preview_auditor) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_auditor_1
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Dispatch details: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_auditor_1\DISPATCH.md

Instructions:
1. Read ORIGINAL_REQUEST.md and PROJECT.md.
2. Execute comprehensive integrity forensics across the entire project:
   - Cheating detection: Search for hardcoded test checks, mock facades, dummy returns designed only to satisfy tests without actual logic.
   - Verification of genuine implementation: Inspect `src/App.tsx`, `src/index.css`, `index.html`, `public/robots.txt`, `public/sitemap.xml`.
   - ICAI Ethics verification: Confirm zero fabricated reviews, no superlatives ("best", "#1"), no promotional undercutting ("free consultation"), and only authentic credentials.
   - Anti-slop verification: Confirm 0 em dashes (`\u2014`), WCAG AA contrast compliance, zero generic purple glow.
   - Localhost isolation: Confirm 0 remote Git remotes and no remote deployment commands.
3. Run `cmd /c "npm run build"` and `cmd /c "node tests/e2e/run_tests.cjs"`.
4. Issue your binary verdict (CLEAN or INTEGRITY VIOLATION) in `handoff.md` and notify the parent via send_message.
