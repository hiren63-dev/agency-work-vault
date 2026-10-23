# Backend & Security Audit Report
**Phase:** Phase A, Cycle 1  
**Project:** Harsh Manek Portfolio (React SPA)  
**Date:** 2026-08-31

## 1. Security Rubric (10-Point Scale)

We define a strict 10-point rubric tailored for a Single Page Application (SPA). Each category is scored out of 1 point.

| # | Category | Description | Score |
|---|---|---|---|
| 1 | **Hardcoded Secrets** | No API keys, tokens, or sensitive credentials committed to the repository. | 1.0 / 1.0 |
| 2 | **Environment Variables** | No `.env` files mistakenly checked in; proper usage of frontend-safe env vars. | 1.0 / 1.0 |
| 3 | **Dependency Vulnerabilities** | Zero known CVEs in the dependency tree (`npm audit` clean). | 1.0 / 1.0 |
| 4 | **Security Headers** | Presence of a deployment configuration (e.g., `_headers`, `vercel.json`) to enforce CSP, HSTS, X-Frame-Options, etc. | 0.0 / 1.0 |
| 5 | **Cross-Site Scripting (XSS)** | Safe rendering of user data; avoidance of `dangerouslySetInnerHTML`. | 1.0 / 1.0 |
| 6 | **API Security / CSRF** | Secure token handling, no exposed internal endpoints, safe `fetch`/`axios` usage. | 1.0 / 1.0 |
| 7 | **Authentication & AuthZ** | Secure routing (if auth exists), protective guards on authenticated routes. (N/A for fully static yields full points). | 1.0 / 1.0 |
| 8 | **Build / Source Map Exposure** | Source maps are not unnecessarily exposed in production builds, preventing code scraping. | 1.0 / 1.0 |
| 9 | **Dependency Lockfile** | Presence and maintenance of `package-lock.json` / `yarn.lock` for deterministic builds. | 1.0 / 1.0 |
| 10 | **Security Linting / SAST** | Implementation of security-focused linters (e.g., `eslint-plugin-security`) or SAST tools in the pipeline. | 0.5 / 1.0 |

**Total Score: 8.5 / 10**

---

## 2. Findings & Details

### **Critical & High Impact Issues**
*None detected.* The repository is a purely static React/Vite application with no exposed API routes, server configurations, or hardcoded secrets. 

### **Medium & Low Impact Issues**

**[Medium] Missing Security Headers Configuration (Rubric Item #4)**
- **Finding:** There is no configuration file (like `netlify.toml`, `vercel.json`, or a `_headers` file) to dictate HTTP security headers for the production deployment.
- **Risk:** Without headers like `Content-Security-Policy` (CSP), `X-Content-Type-Options`, and `X-Frame-Options`, the application is theoretically vulnerable to clickjacking and certain XSS vectors, depending on the hosting provider's default settings.
- **Recommendation:** Add a routing/configuration file specific to your chosen hosting provider to strictly define these headers.

**[Low] Limited Security Linting (Rubric Item #10)**
- **Finding:** The project uses `oxlint` which is extremely fast and great for general code quality, but does not explicitly scan for security anti-patterns (as `eslint-plugin-security` would).
- **Risk:** Future development could introduce security flaws (like unsafe regexes or XSS vectors) that standard linting might miss.
- **Recommendation:** Integrate a dedicated security check in the CI/CD pipeline, even if just running `npm audit --audit-level=high` on every pull request.

---

## 3. Summary of Code Audit
- **Secrets/Env:** `Select-String` scan across the `src/` directory revealed no hardcoded API keys, tokens, or passwords.
- **Vulnerabilities:** `npm audit` returned `0 vulnerabilities` across all dependencies.
- **XSS Vectors:** A scan for `dangerouslySetInnerHTML` yielded no results, confirming standard React escaping is maintained throughout.
- **Network Requests:** The application appears entirely static. No `fetch` or `axios` calls were found, eliminating the risk of CSRF or data exfiltration via APIs.
- **Build Configurations:** `vite.config.ts` maintains safe defaults (source maps are disabled for production builds).

The application is highly secure by nature of its architecture (static SPA with no backend). Addressing deployment headers will push the security posture to an optimal state.
