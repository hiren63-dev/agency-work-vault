# Project: Harsh Manek & Co. Localhost Parity & Enhancement

## Architecture
- **Framework**: Vite 8.2.2 + React 19.2.8 + TypeScript 6.0.2
- **Styling**: Tailwind CSS v4.3.3 via `@tailwindcss/vite` and `@theme` tokens in `src/index.css`
- **Animation**: Motion v13.1.1 (`import { motion, AnimatePresence } from "motion/react"`) with spring physics
- **Routing**: React Router DOM 7.18.3 (`BrowserRouter`, `Routes`, `Route`, `useParams`)
- **Icons**: Lucide React 1.35.0
- **Environment**: Isolated localhost `http://localhost:5173/`. Zero git remotes; production Vercel deployment (`harshmanek-portfolio.vercel.app`) remains pristine.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Localhost Isolation & Build Parity | Zero remote mutations, clean build via `cmd /c "npm run build"`, 0 console errors on port 5173 | M1 | survey |
| F02 | ICAI Ethics Compliance | Remove "5.0 Rating" and "5.0 ★ on JustDial"; replace with factual credentials "FCA & DISA Qualified"; replace promotional "Book Free Consultation" with "Schedule Consultation" | M1 | survey |
| F03 | Anti-Slop Copy & A11y Contrast | Eliminate all 25 em dashes (`—`) across UI copy; elevate `text-white/40` and `text-white/30` to meet WCAG AA (>= 4.5:1) | M1 | survey |
| F04 | Taste Architect Polish & Fonts | Remove generic purple-500 violet glow/accents from InvoiceStrategist; load web fonts (`Geist`, `Instrument Serif`, `JetBrains Mono`) in `index.html`; fix hover cursor | M1 | survey |
| F05 | Dynamic Timeline & Statutory Calendar | Add statutory compliance calendar mode to DynamicTimeline; accessible accordion with spring physics | M2 | survey |
| F06 | Enhanced Tax Sandbox | Update New Regime standard deduction to ₹75,000; implement Sec 87A marginal relief; accessible toggles (`role="switch" aria-checked`) & `aria-live` | M2 | survey |
| F07 | Enhanced Invoice Strategist | Reverse invoicing with Rule 138 E-Way bill threshold check (₹50k), Rule 48(4) E-Invoicing badge (₹5 Cr), SAC 9982, interstate IGST | M2 | survey |
| F08 | Enhanced Penalty Simulator | Dual-mode Income Tax (234A/B/C/F) & GST (Sec 47 & 50) simulator, local SVG badges (no external CDN), accessible keyboard slider | M2 | survey |
| F09 | Dynamic Blog Routing & Resilience | Fix `/blog/:id` to consume `useParams` and render matching article dynamically from `BLOG_POSTS`; smooth anchor navigation | M1 | survey |
| F10 | SEO, GEO & AEO Architecture | Title, meta description, OG/Twitter tags, Rajkot GEO tags, JSON-LD schemas (`AccountingService`, `LocalBusiness`, `FAQPage`) linking 10 FAQs | M3 | survey |
| F11 | Crawler Directives & Sitemap | Create `public/robots.txt` and `public/sitemap.xml` for proper search engine indexing | M3 | survey |
| F12 | Comprehensive E2E Verification | Automated opaque-box test runner (Tiers 1-4) + Tier 5 adversarial hardening + localhost verification | M4 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | ICAI Ethics, Anti-Slop & Design Polish | F01, F02, F03, F04, F09 | none | DONE (Worker: 152593e6, 100% M1 pass) |
| M2 | Interactive Generative UI Tools | F05, F06, F07, F08 | M1 | DONE (Worker: 0dd6fdef, 142/142 pass) |
| M3 | SEO, GEO & AEO Architecture | F10, F11 | none | DONE (Worker: 16f708bd, 100% F10/F11 pass) |
| M4 | Final Milestone (E2E Pass & Hardening) | F12 | M1, M2, M3, TEST_READY.md | DONE (Gate PASSED: 142/142 tests pass, Auditor CLEAN) |

## Interface Contracts
### M1 (Design & Ethics) ↔ M2 (Interactive Tools)
- Styling contracts: Monochrome zinc (`zinc-900`, `zinc-800`, `zinc-400`, `zinc-200`) and emerald (`emerald-400`, `emerald-500`) accent tokens. No purple/violet color classes.
- Typography: Body `font-sans` (Geist), display `font-serif` (Instrument Serif), numerical data & badges `font-mono` (JetBrains Mono).
- Motion spring physics: Use `SPRING_SNAPPY = { type: "spring", stiffness: 240, damping: 26, mass: 1 }` and `SPRING_MICRO = { stiffness: 450, damping: 30, mass: 0.8 }`.
- Copy guidelines: Strict prohibition of em dashes (`—`), superlatives ("best", "#1"), and fee undercutting ("free consultation").

### M1/M2/M3 ↔ M4 (E2E Testing & Acceptance)
- Test entry point: `cmd /c "npm run build"` must pass with 0 errors.
- Dev server entry point: `http://localhost:5173/` must respond with HTTP 200 and zero console errors.
- Routes: `/`, `/#services`, `/#tools`, `/#experience`, `/#team`, `/#faq`, `/#book`, `/blog`, `/blog/:id`, `/privacy`, `/terms`.
- Static assets: `/robots.txt`, `/sitemap.xml`.

## Code Layout
- `index.html`: Web font links, SEO meta tags, OpenGraph/Twitter cards, Rajkot geo tags, JSON-LD structured data.
- `public/robots.txt`: Search crawler indexing instructions and sitemap link.
- `public/sitemap.xml`: XML sitemap for search engines.
- `src/index.css`: Tailwind v4 `@theme` definitions, utilities, and fine-pointer media queries.
- `src/App.tsx`: Core application, navigation, routing, modal dialogs, sections, and interactive tools.
- `src/data/csmContent.ts`: Structured data arrays for slides, pillars, and office branches.
- `tests/e2e/`: Automated E2E test harness and test suites created by the E2E Testing Track.
