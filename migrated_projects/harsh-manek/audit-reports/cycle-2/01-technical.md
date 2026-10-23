# Technical Infra Audit Report
**Phase:** A | **Cycle:** 2
**Target:** http://localhost:5174/ (React SPA)
**Auditor:** Technical Infra Auditor

## 1. Rubric & Scoring

| # | Criteria | Score (0-1) | Observations |
|---|----------|-------------|--------------|
| 1 | **Architecture & File Structure** | 0.0 | All components and pages are stuffed into a single 830+ line `App.tsx` file. No modularization. |
| 2 | **Code Splitting & Lazy Loading** | 0.0 | No `React.lazy()` or dynamic imports used for routing. Entire app loads in one bundle. |
| 3 | **TypeScript Strictness** | 0.5 | `tsconfig.app.json` is missing `"strict": true`. Strict type checking is not enforced. |
| 4 | **Vite & Build Optimization** | 0.5 | Barebones Vite config. Missing manual chunking strategies or alias configurations. |
| 5 | **Asset & Image Performance** | 0.0 | Heavy Unsplash images are hotlinked without `loading="lazy"` or `srcset`. Major LCP/Perf hit. |
| 6 | **Dead Code & Boilerplate** | 0.0 | Leftover React Vite boilerplate CSS remains in `App.css` and is still imported. |
| 7 | **Linting & Formatting** | 1.0 | `oxlint` is correctly set up as a fast linter in the scripts. |
| 8 | **Dependency Health** | 0.5 | Tailwind CSS dependencies are listed in `dependencies` instead of `devDependencies`. |
| 9 | **Routing & Error Handling** | 0.5 | Basic React Router works, but no 404 Not Found page or Error Boundaries are configured. |
| 10| **CSS & Styling Setup** | 1.0 | Tailwind v4 is integrated cleanly using `@tailwindcss/vite` and `index.css`. |

**Total Score: 4.0 / 10**

---

## 2. Findings & Impact Analysis

### 🔴 Critical Issues
1. **Monolithic Architecture (App.tsx):** 
   - *Impact:* Unmaintainable codebase, merge conflicts, impossible to scale.
   - *Issue:* Massive `App.tsx` housing `Navbar`, `HomePage`, `BlogIndexPage`, `BlogPostPage`, and routing logic in one file.

2. **No Code Splitting:**
   - *Impact:* Massive initial load time (TBT).
   - *Issue:* The browser downloads blog content and secondary pages even if the user only visits the homepage.

### 🟠 High Impact Issues
3. **Missing TS Strict Mode:**
   - *Impact:* Allows any types, null pointer exceptions, defeating the purpose of TypeScript.
   - *Issue:* `"strict": true` missing in `tsconfig.app.json`.

4. **Unoptimized Assets:**
   - *Impact:* Destroys Core Web Vitals (Largest Contentful Paint).
   - *Issue:* Missing `loading="lazy"` on off-screen images; loading massive Unsplash images without size limits.

5. **Dead Boilerplate Code:**
   - *Impact:* Unprofessional, adds unused CSS payload.
   - *Issue:* `App.css` contains default Vite counters and logos CSS that is unused by the portfolio.

---

## 3. Recommended Next Steps
- Break down `App.tsx` into `src/pages/` and `src/components/`.
- Implement `React.lazy()` for route-level code splitting in the router.
- Enable `"strict": true` in `tsconfig.app.json` and fix any resulting errors.
- Delete `App.css` and its import in `main.tsx`/`App.tsx`.
- Add `loading="lazy"` to all images below the fold.
