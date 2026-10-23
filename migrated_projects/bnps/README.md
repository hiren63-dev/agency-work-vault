# BNPS website

Professional, responsive static website for B N P S and Associates LLP. Source content is in `build.mjs`; shared styling and interactions are in `dist/styles.css` and `dist/app.js`. No runtime dependencies are needed.

## Run locally

Use Node.js: `npm run build`, `npm run check`, then `npm start`. Open http://127.0.0.1:4173. The `dist` directory is deployable static output. Source changes to content require rebuilding; CSS and JavaScript are served directly.

## Design and structure

Navy, white and blue grey, with architectural photography and editorial typography. The site includes a home page, firm page, service directory and six service pages, searchable partner directory and 14 biographies, office directory, resources, website information and a 404 page.

Motion includes entrance choreography, a scroll-following process narrative, a horizontal industry gallery, portrait transitions, office panel transitions, reading progress and page transitions where supported. System reduced motion and a persistent user motion control are supported. Navigation, city filters and office tabs support keyboard operation. See [DESIGN_NOTES.md](DESIGN_NOTES.md) for the visitor journey and design rationale.

Interaction references: https://21st.dev/community/components and https://www.framer.com/marketplace/components/. These were used as references; no paid components were copied.

## Content and professional review

The supplied content.md was edited into factual descriptions. Client testimonials, names, client counts, revenue and outcome claims, cumulative experience claims, lecture counts, superlatives and sales solicitations are omitted. The conflicting 60+ years claim was omitted. The constituent firm establishment date of 1974 is distinguished from the merged firm.

RBI/CAG empanelment, peer review status and eligibility claims are not published without current supporting records. Partner qualifications and addresses are based on the supplied material and should be confirmed by the firm against its current records before a public launch. No membership or firm registration number has been invented. No phone number, email address or enquiry delivery backend was supplied, so the site provides addresses, directions and partner profiles without a fake contact form.

Research source: ICAI Council Guidelines for Advertisement, 2008, updated through December 2025, including section 3.3 on websites: https://resource.cdn.icai.org/93219cg_advt2008.pdf. ICAI identifies the revised Code as applicable from 1 April 2026: https://www.icai.org/post/prc-icai-press-release-12-12-2025. This implementation is a conservative informational presentation, not a legal compliance certification. A responsible firm partner should approve the final public copy.

The source file names several insights and publications but does not supply their full articles or document files. These have not been fabricated or presented as downloadable documents. The Resources page provides official reference portals. Add the approved publications when actual files or verified article URLs are available.

## Search and answer engine readiness

All content is rendered as static HTML, including individual partner and service pages. Each page includes a unique title, description, canonical URL and social title/description. JSON-LD describes the firm, offices, people and services; the home page FAQ markup matches its visible answers. Sitemap, robots.txt and llms.txt are supplied. No ratings or review schema is used. Search visibility or answer-engine citations cannot be guaranteed, and a private preview is not publicly indexable.

Before moving to the official domain, set SITE_ORIGIN to the final HTTPS origin and run `npm run build` to regenerate canonical URLs, schema URLs, sitemap and llms.txt. The existing bnpsca.com site has not been modified.

## Assets

The 14 partner photographs were supplied by the user. Architecture photograph by Sebastian Schuster, from https://unsplash.com/photos/modern-skyscrapers-with-geometric-patterns-in-black-and-white-UR2urwF9LwA, used under https://unsplash.com/license. It is decorative and does not depict a BNPS office. Fonts are DM Sans and Manrope, requested from Google Fonts.

## Validation

`npm run check` checks local page and asset references, heading structure, metadata, JSON-LD syntax and selected excluded promotional claims. Browser checks cover desktop and mobile layout, mobile menu, partner search, office selection and keyboard controls, motion preference, and runtime errors.
