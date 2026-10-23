# Phase A, Cycle 1: SEO Discoverability Audit

## 1. SEO Rubric (10 Points)

1. **Title Tag Optimization (1 pt):** Each page/route has a unique `<title>` that accurately describes the content and includes primary keywords.
2. **Meta Descriptions (1 pt):** Each page has a unique, compelling `<meta name="description">` outlining the content to improve click-through rates.
3. **Open Graph & Twitter Cards (1 pt):** Proper `<meta property="og:*">` and `<meta name="twitter:*">` tags are present for rich social sharing previews.
4. **Semantic HTML (1 pt):** Proper use of `<header>`, `<main>`, `<article>`, `<nav>`, `<section>`, and `<footer>` elements instead of generic `<div>` containers.
5. **Heading Hierarchy (1 pt):** Exactly one `<h1>` per view, followed by logically ordered `<h2>`, `<h3>`, etc., without skipping levels.
6. **Image Alt Attributes (1 pt):** Descriptive `alt` text is provided for all meaningful `<img>` elements; decorative images use `alt=""`.
7. **robots.txt (1 pt):** A valid `robots.txt` file exists in the root (`public/`) directory to guide search engine crawlers.
8. **sitemap.xml (1 pt):** A valid XML sitemap exists to help search engines discover all SPA routes (e.g., Home, Blog, individual articles).
9. **Canonical Tags (1 pt):** Proper `<link rel="canonical">` tags exist to indicate the preferred URL and prevent duplicate content issues.
10. **Mobile Viewport & Favicon (1 pt):** A proper viewport meta tag is present for mobile responsiveness, alongside a favicon.

---

## 2. Audit Findings

* **Title Tag Optimization (Score: 0/1)**
  * **Finding:** The `<title>` in `index.html` is statically set to `harshmanek-portfolio`. It does not change across different routes (Home, Privacy Policy, Insights). This severely hurts SEO and user experience.
* **Meta Descriptions (Score: 0/1)**
  * **Finding:** There is completely no `<meta name="description">` tag in `index.html` or dynamically injected for the individual routes. 
* **Open Graph & Twitter Cards (Score: 0/1)**
  * **Finding:** No social sharing metadata tags (`og:title`, `og:image`, `twitter:card`, etc.) are implemented, making shared links fallback to plain unoptimized text.
* **Semantic HTML (Score: 0.5/1)**
  * **Finding:** The codebase adequately uses `<main>`, `<nav>`, `<header>`, `<footer>`, and `<section>`. However, it misses the opportunity to use `<article>` tags for the individual blog/insight posts.
* **Heading Hierarchy (Score: 1/1)**
  * **Finding:** Valid hierarchy observed. Each conditionally rendered view (Home, Privacy, Blog) contains exactly one `<h1>` tag, and sub-sections follow appropriately with `<h2>`, `<h3>`, etc.
* **Image Alt Attributes (Score: 0/1)**
  * **Finding:** Numerous `<img>` tags in `App.tsx` (especially placeholder Unsplash images) have empty `alt=""` attributes or are completely missing descriptive text (e.g., line 132, 140, 189).
* **robots.txt (Score: 0/1)**
  * **Finding:** Missing from the `public/` directory.
* **sitemap.xml (Score: 0/1)**
  * **Finding:** Missing from the `public/` directory. Critical for an SPA to help Googlebot discover routes like `/blog/:id`.
* **Canonical Tags (Score: 0/1)**
  * **Finding:** Missing entirely.
* **Mobile Viewport & Favicon (Score: 1/1)**
  * **Finding:** Properly defined in `index.html` (`<meta name="viewport" content="width=device-width, initial-scale=1.0" />` and `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`).

---

## 3. Final Score & Conclusion

**Final Score: 2.5 / 10**

### Critical/High Impact Issues
1. **[CRITICAL] Static Document Head:** The app is a standard React SPA lacking a mechanism (like `react-helmet-async` or a custom document head manager) to dynamically update `<title>`, `<meta name="description">`, and canonical tags per route. 
2. **[CRITICAL] Missing Social Metadata:** Lack of Open Graph / Twitter card tags means sharing Insights on LinkedIn/X will generate poor, generic preview cards.
3. **[HIGH] Discoverability Blockers:** The absence of `sitemap.xml` and `robots.txt` drastically reduces crawler discovery effectiveness for the React SPA.
4. **[HIGH] Accessibility & Image SEO:** Multiple empty or missing `alt` attributes on hero images.
