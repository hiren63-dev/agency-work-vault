# DISPATCH: Milestone 1 Worker (Ethics, Anti-Slop & Design Polish)

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_1
- **Role**: Milestone 1 Implementation Worker
- **Original Request**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
- **Project Spec**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
- **Explorer Survey Reports**:
  - `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_1\handoff.md`
  - `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_3\handoff.md`

## Scope of Work (Milestone 1)
1. **ICAI Code of Ethics Compliance**:
   - `src/App.tsx:346-350`: Remove artificial "5.0 Rating" glass badge. Replace with factual badge: "Chartered Accountant" / "FCA".
   - `src/App.tsx:405`: Remove "5.0 ★ on JustDial" badge. Replace with verified qualification: "FCA & DISA Qualified".
   - `src/App.tsx:281, 1381, 1882`: Replace promotional "Book Free Consultation" with professional neutral phrasing: "Schedule Consultation" or "Request Consultation".
2. **Anti-Slop Copywriting & Formatting (Hard Gate)**:
   - Eliminate all 25 em dashes (`—`) in `src/App.tsx` (lines 384, 427, 442, 458, 488, 532, 1205, 1306, 1308, 1614, 1627, 1661, 1743, 1789, 1847, 1854, 1855, 1857, 1858, 1860, 1863, 1864, 1867, 1892). Replace with commas, hyphens, colons, or parentheses.
   - Fix WCAG AA low contrast text: elevate `text-white/40` and `text-white/30` on labels and blog metadata to `text-white/70` and `text-white/60` (>= 4.5:1 ratio).
3. **Taste Architect Polish**:
   - In `src/App.tsx:880, 897, 908, 915, 922`: Remove purple-500 violet glow and borders in `InvoiceStrategist`. Use refined monochrome zinc and emerald accents.
   - In `src/index.css`: Wrap custom cursor override in `@media (hover: hover) and (pointer: fine)`.
4. **Dynamic Blog Routing**:
   - In `BlogPostPage` (`src/App.tsx:1816`): Use `useParams<{ id: string }>()` to lookup and render the active blog post dynamically matching `id` from the articles list.
5. **Verification**:
   - Run `cmd /c "npm run build"` to verify clean compilation with 0 TypeScript/Vite errors.

## Exclusive Write Ownership
- `src/App.tsx`
- `src/index.css`

## 2026-09-07T16:53:54Z
You are the Milestone 1 Worker (teamwork_preview_worker) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_1
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Dispatch details: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_1\DISPATCH.md
Explorer surveys:
- c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_1\handoff.md
- c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_3\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Tasks:
1. ICAI Code of Ethics Compliance:
   - `src/App.tsx:346-350`: Remove artificial "5.0 Rating" glass badge. Replace with factual badge: "Chartered Accountant" / "FCA".
   - `src/App.tsx:405`: Remove "5.0 ★ on JustDial" badge. Replace with verified qualification: "FCA & DISA Qualified".
   - `src/App.tsx:281, 1381, 1882`: Replace promotional "Book Free Consultation" with professional neutral phrasing: "Schedule Consultation" or "Request Consultation".
2. Anti-Slop Copywriting & Formatting (Hard Gate):
   - Eliminate all 25 em dashes (`—`) across `src/App.tsx` (lines 384, 427, 442, 458, 488, 532, 1205, 1306, 1308, 1614, 1627, 1661, 1743, 1789, 1847, 1854, 1855, 1857, 1858, 1860, 1863, 1864, 1867, 1892). Replace with commas, hyphens, colons, or parentheses.
   - Fix WCAG AA low contrast text: elevate `text-white/40` and `text-white/30` on labels and blog metadata to `text-white/70` and `text-white/60` (>= 4.5:1 ratio).
3. Taste Architect Polish:
   - In `src/App.tsx:880, 897, 908, 915, 922`: Remove purple-500 violet glow and borders in `InvoiceStrategist`. Use refined monochrome zinc and emerald accents.
   - In `src/index.css`: Wrap custom cursor override in `@media (hover: hover) and (pointer: fine)`.
4. Dynamic Blog Routing:
   - In `BlogPostPage` (`src/App.tsx:1816`): Use `useParams<{ id: string }>()` to lookup and render the active blog post dynamically matching `id` from the articles list.
5. Verification:
   - Run `cmd /c "npm run build"` to verify clean compilation with 0 TypeScript/Vite errors.
6. Write a comprehensive handoff report to `handoff.md` in your working directory and notify the parent via send_message.

## 2026-09-07T17:12:45Z
**Context**: Milestone 1 Implementation (Ethics, Anti-Slop & Taste Architect Polish)
**Content**: Checking in on your progress with the modifications to src/App.tsx and src/index.css.
**Action**: Please update progress.md with your current step and let us know if you need any clarification or assistance.

