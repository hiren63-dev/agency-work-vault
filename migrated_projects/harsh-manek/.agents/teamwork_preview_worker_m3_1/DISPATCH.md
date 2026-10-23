# DISPATCH: Milestone 3 Worker (SEO, GEO & AEO Architecture)

- **Working Directory**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m3_1
- **Role**: Milestone 3 Implementation Worker
- **Original Request**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
- **Project Spec**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
- **Explorer Survey Report**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_3\handoff.md
- **Test Specs**: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md

## Scope of Work (Milestone 3)
1. **`index.html` Metadata & Typography**:
   - Title: `Harsh Manek & Co. | Chartered Accountants in Rajkot | Tax, Audit & GST Advisory`
   - Description: Factual, professional meta description with Rajkot location, Est. 2016, and core services.
   - Web font `<link>` tags: Google Fonts for `Instrument Serif` and `JetBrains Mono` / `Geist`.
   - OpenGraph tags: `og:title`, `og:description`, `og:type` (`website`), `og:url`, `og:image`, `og:locale` (`en_IN`).
   - Twitter card tags: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
   - Rajkot Geo tags: `geo.region` (`IN-GJ`), `geo.placename` (`Rajkot, Gujarat`), `geo.position` (`22.3039;70.8022`), `ICBM` (`22.3039, 70.8022`).
   - JSON-LD Structured Data:
     - `AccountingService` / `LocalBusiness` with exact address (309, Time Square II, Ayodhya Chowk, 150 Feet Ring Road, Rajkot, Gujarat 360005), telephone (`+919033440008`), founder CA Harsh Manek (FCA, DISA).
     - `FAQPage` with complete Question/Answer entities for all 10 FAQ items for AI search engine answers (AEO).
2. **`public/robots.txt`**:
   - Standard crawler directives allowing indexing and linking to sitemap.
3. **`public/sitemap.xml`**:
   - Standard XML sitemap covering canonical routes (`/`, `/blog`, `/privacy`, `/terms`).
4. **Verification**:
   - Verify with `cmd /c "npm run build"` and `cmd /c "node tests/e2e/run_tests.cjs"`.

## Exclusive Write Ownership
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

## 2026-09-07T17:07:29Z
You are the Milestone 3 Worker (teamwork_preview_worker) for the Harsh Manek & Co. project.
Working directory: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m3_1
Parent conversation ID: d6c15049-b919-4894-82fc-205711b9df37
Original request: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\PROJECT.md
Dispatch details: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_worker_m3_1\DISPATCH.md
Explorer Survey: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\.agents\teamwork_preview_explorer_survey_3\handoff.md
Test suite: c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio\TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

Scope & Tasks:
1. `index.html`:
   - Set `<title>Harsh Manek & Co. | Chartered Accountants in Rajkot | Tax, Audit & GST Advisory</title>`.
   - Add `<meta name="description" content="Harsh Manek & Co. is an established Chartered Accountancy firm in Rajkot, Gujarat (Est. 2016). Specializing in Income Tax, GST, Statutory Audits, Corporate Advisory, and CMA Project Finance.">`.
   - Add Google Fonts `<link>` preconnect and stylesheet for `Instrument Serif` and `JetBrains Mono` (and Geist / Inter fallback).
   - Add OpenGraph tags (`og:title`, `og:description`, `og:type`="website", `og:url`="http://localhost:5173/", `og:image`="/harshmanek.jpg", `og:locale`="en_IN").
   - Add Twitter Card tags (`twitter:card`="summary_large_image", `twitter:title`, `twitter:description`, `twitter:image`="/harshmanek.jpg").
   - Add Rajkot Geo tags (`geo.region`="IN-GJ", `geo.placename`="Rajkot, Gujarat", `geo.position`="22.3039;70.8022", `ICBM`="22.3039, 70.8022").
   - Add JSON-LD `<script type="application/ld+json">` for:
     - `AccountingService` & `LocalBusiness` (address: 309, Time Square II, Ayodhya Chowk, 150 Feet Ring Road, Rajkot, Gujarat 360005, phone: +919033440008, founder: CA Harsh Manek, openingHours, geo).
     - `FAQPage` with all 10 FAQ Question and Answer entries from the site for AI answer engine retrieval (AEO).
2. `public/robots.txt`:
   - Add `User-agent: *`, `Allow: /`, `Sitemap: http://localhost:5173/sitemap.xml`.
3. `public/sitemap.xml`:
   - Standard XML sitemap containing `/`, `/blog`, `/privacy`, `/terms` with `<lastmod>`.
4. Verification:
   - Run `cmd /c "npm run build"` to verify 0 errors.
   - Run `cmd /c "node tests/e2e/run_tests.cjs"` to verify M3 tests pass.
5. Write your handoff report to `handoff.md` and notify parent via send_message.

