# Phase A, Cycle 2: SEO Discoverability Audit

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
  * **Finding:** The `<title>` in `index.html` is statically set to `harshmanek-portfolio`. It does not dynamically update when navigating between routes (Home, Privacy, Insights).
* **Meta Descriptions (Score: 0/1)**
  * **Finding:** There is no `<meta name="description">` tag present in `index.html`, nor is there a mechanism to inject it dynamically for individual views/posts.
* **Open Graph & Twitter Cards (Score: 0/1)**
  * **Finding:** Complete absence of social sharing tags (`og:title`, `og:image`, `twitter:card`, etc.).
* **Semantic HTML (Score: 0.5/1)**
  * **Finding:** Uses semantic tags like `<header>`, `<nav>`, `<footer>`, and `<section>`. However, the codebase fails to utilize the `<article>` tag for blog posts in `BlogPostPage`.
* **Heading Hierarchy (Score: 1/1)**
  * **Finding:** Excellent hierarchy. Each distinct page/view contains exactly one `<h1>` tag, with subsequent headings logically flowing into `<h2>` and `<h3>`.
* **Image Alt Attributes (Score: 0/1)**
  * **Finding:** Several `<img>` tags in `App.tsx` lack descriptive text. For instance, images on line 132 and 140 have `alt=""`, and the blog preview image on line 667 has `alt=""`. The hero image on line 733 uses a generic `alt="Finance"`.
* **robots.txt (Score: 0/1)**
  * **Finding:** Missing from the `public/` directory.
* **sitemap.xml (Score: 0/1)**
  * **Finding:** Missing from the `public/` directory. This is critical for search engines to crawl SPA routes effectively.
* **Canonical Tags (Score: 0/1)**
  * **Finding:** Missing entirely.
* **Mobile Viewport & Favicon (Score: 1/1)**
  * **Finding:** Correctly defined in `index.html`.

---

## 3. Final Score & Conclusion

**Final Score: 2.5 / 10**

### Critical/High Impact Issues
1. **[CRITICAL] Static Document Head:** The app lacks a client-side head manager (e.g., `react-helmet-async`) to dynamically update `<title>`, `<meta name="description">`, and canonical tags for SPA routes.
2. **[CRITICAL] Missing Social Metadata:** Without Open Graph or Twitter card tags, shared links on social media will appear unoptimized and generic.
3. **[HIGH] Discoverability Blockers:** The missing `sitemap.xml` and `robots.txt` significantly hinder search engine crawlers from discovering all the nested routes (like individual blog posts).
4. **[HIGH] Image SEO and Accessibility:** Several images lack descriptive `alt` attributes or have empty ones, impacting both accessibility and image search indexing.
