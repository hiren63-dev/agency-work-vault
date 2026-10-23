# DISPATCH: Milestone 1 Worker Replacement (Generation 2)

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_2
- **Role**: Milestone 1 Implementation Worker (Gen 2 Replacement)
- **Original Request**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
- **Project Spec**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
- **Explorer Survey**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_3\handoff.md
- **Test Harness**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md

## Scope of Work (Milestone 1)
1. **ICAI Code of Ethics Compliance**:
   - `src/App.tsx:346-350`: Replace artificial "5.0 Rating" badge with factual badge: "Chartered Accountant" / "FCA".
   - `src/App.tsx:405`: Replace "5.0 ★ on JustDial" badge with verified qualification: "FCA & DISA Qualified".
   - `src/App.tsx:281, 1381, 1882`: Replace promotional "Book Free Consultation" with professional neutral phrasing: "Schedule Consultation" or "Request Consultation".
2. **Anti-Slop Copywriting & Formatting (Hard Gate)**:
   - Eliminate all 25 em dashes (`—`) across `src/App.tsx` (lines 384, 427, 442, 458, 488, 532, 1205, 1306, 1308, 1614, 1627, 1661, 1743, 1789, 1847, 1854, 1855, 1857, 1858, 1860, 1863, 1864, 1867, 1892). Replace with commas, hyphens, colons, or parentheses.
   - Fix WCAG AA low contrast text: elevate `text-white/40` and `text-white/30` on labels and blog metadata to `text-white/70` and `text-white/60` (>= 4.5:1 ratio).
3. **Taste Architect Polish**:
   - In `src/App.tsx:880, 897, 908, 915, 922`: Remove purple-500 violet glow and borders in `InvoiceStrategist`. Use refined monochrome zinc and emerald accents.
   - In `src/index.css`: Wrap custom cursor override in `@media (hover: hover) and (pointer: fine)`.
4. **Dynamic Blog Routing**:
   - In `BlogPostPage` (`src/App.tsx:1816`): Use `useParams<{ id: string }>()` to lookup and render the active blog post dynamically matching `id` from the articles list.
5. **Verification**:
   - Run `cmd /c "npm run build"` to verify clean compilation with 0 TypeScript/Vite errors.
   - Run `cmd /c "node tests/e2e/run_tests.cjs"` to verify M1 tests pass.

## Exclusive Write Ownership
- `src/App.tsx`
- `src/index.css`

## 2026-09-07T17:19:05Z
You are the Milestone 1 Replacement Worker (teamwork_preview_worker) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_2
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Dispatch details: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m1_2\DISPATCH.md
Test suite: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
- `src/App.tsx`
- `src/index.css`

Tasks to execute directly:
1. `src/index.css`:
   - Wrap the custom SVG cursor override in `@media (hover: hover) and (pointer: fine) { ... }`.
2. `src/App.tsx`:
   - Replace "Book Free Consultation" with "Schedule Consultation" on lines 281, 1381, 1882.
   - Replace artificial "5.0 Rating" badge (lines 346-350) with factual badge: "FCA" and "Chartered Accountant".
   - Replace "5.0 ★ on JustDial" badge (line 405) with verified credential: "FCA & DISA Qualified".
   - Replace all 25 em dashes (`—`) across the entire file with commas, hyphens, colons, or parentheses (search for `\u2014` or `—`).
   - Fix low contrast text: change `text-white/40` and `text-white/30` on labels and blog metadata to `text-white/70` and `text-white/60` (lines 783, 879, 894, 1408, 1432, 1436, 1442, 1801).
   - In `InvoiceStrategist` (lines 880, 897, 908, 915, 922): Remove purple-500 violet glow/borders; use refined monochrome zinc (`zinc-700`, `zinc-800`, `zinc-400`) and emerald accents.
   - Dynamic Blog Routing in `BlogPostPage`: Import `useParams`, read `const { id } = useParams()`, and dynamically render the matching post from `BLOG_POSTS` / `HERO_SLIDES` (or fallback).
3. Verification:
   - Run `cmd /c "npm run build"` to verify 0 errors.
   - Run `cmd /c "node tests/e2e/run_tests.cjs"` to verify M1 tests pass.
4. Write handoff report to `handoff.md` and notify parent via `send_message`.

