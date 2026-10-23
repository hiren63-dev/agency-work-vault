# Project: Kadivar & Associates (Next.js 16 Website)

## Overview
A modern, luxury, high-performance website for **Kadivar & Associates**, a Chartered Accountancy & Tax Advisory firm headquartered in Rajkot, Gujarat, India.

- **Founder & Principal Partner:** CA Irfan Kadivar — Chartered Accountant. Practises in direct tax litigation and appears as an **authorised representative** before the Income Tax and GST authorities.
  - ⚠️ **He is NOT a "Tax Solicitor".** An earlier revision described him this way across the site. In India legal practice is reserved to advocates enrolled under the Advocates Act, 1961 — a CA is not a solicitor, and publishing that title misdescribes professional status. Never reintroduce it. Use `siteConfig.partnerRole`.
- **Direct Contact:** +91 90162 84892 | info@kadivar.co
- **Headquarters:** Office 1108, R K World Tower, Near Shital Park Chowk, 150 Feet Ring Road, Rajkot 360006
- **Live Deployment:** https://kadivar-redesign.vercel.app

---

## CRITICAL ICAI ETHICAL & LEGAL CONSTRAINTS
Chartered Accountants in India are strictly governed by the **ICAI (Institute of Chartered Accountants of India) Code of Ethics** regarding advertising and solicitation.
**NEVER introduce or re-introduce any of the following:**
1. ❌ NO client names, logos, or brand marks.
2. ❌ NO testimonials, ratings, or reviews.
3. ❌ NO comparisons against other CA firms (e.g. "Standard vs Kadivar").
4. ❌ NO superlatives ("best", "leading", "No. 1", "dominate", "elite", "premier").
5. ❌ NO fee schedules, promotional pricing, discounts, or special offers.
6. ❌ NO guaranteed outcomes or financial return claims.
7. ❌ NO fabricated statistics (e.g. "500+ audits done", "₹100 Cr saved").
8. ❌ NO aggressive solicitation language.
9. ❌ NO dollar signs (`$`) — always use Indian Rupees (`₹`, Lakhs, Crores) if currency is mentioned.
10. ❌ NO professional designations the partner does not hold — in particular **never "Solicitor", "Advocate" or "Lawyer"**. See the note under Overview.
11. ❌ NO placeholder text rendered to visitors (`[TODO]`, `[XX.X]`, `Address Line 1`). If a real value is unavailable, hide the element instead — `siteConfig` values are nullable for exactly this reason.

### Audience — write for these people, not a CFO
The visitors are Morbi ceramic manufacturers with stuck GST refunds; Rajkot engineering MSME owners who received a TDS notice; family jewellery and trading businesses; first-time founders incorporating; and salaried individuals who received an income tax notice. Write plain English, short sentences, concrete situations. **Banned words:** enterprise, institutional, architecture, ecosystem, strategic growth partner, pillars.

**ALWAYS lead with:**
- Named partner qualifications and credentials (CA Irfan Kadivar).
- Factual service descriptions and practice areas.
- Required documents checklists.
- Statutory due dates and compliance timelines.
- Clear, factual Standard Operating Procedures (SOP).
- Office contact information and formal engagement disclaimers.

---

## Tech Stack & Architecture
- **Framework:** Next.js 16.3.3 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom glassmorphism / dark palette (`#050505`)
- **Typography:** Inter (`--font-sans`) & Playfair Display (`--font-serif`)
- **Animations:** Framer Motion (respects `prefers-reduced-motion` via `<MotionConfig>`)
- **Smooth Scrolling:** `@studio-freight/react-lenis`
- **Analytics:** `@vercel/analytics` (Custom events: `Contact Form Submitted`, `Call Click`, `WhatsApp Click`)
- **SEO & Structured Data:** Dynamic JSON-LD `AccountingService` schema, dynamic `robots.ts`, dynamic `sitemap.ts`, Open Graph / Twitter cards (`/public/og-image.jpg`).

---

## Key Files & Directories
- `src/lib/config.ts`: Central firm configuration (phone, address, partner info, membership placeholders).
- `src/lib/services-data.ts`: Factual data source for all 6 service dynamic routes.
- `src/app/page.tsx`: Homepage (Hero, Partner section, Services interactive list, Virtual CFO Rupee preview, FAQs, LeadGen form).
- `src/app/services/[slug]/page.tsx`: Dynamic route for all 6 service detail pages (`await params` for Next.js 15+).
- `src/app/about/page.tsx`: About the firm & partner profile.
- `src/app/how-we-work/page.tsx`: 5-step factual engagement methodology.
- `src/app/contact/page.tsx`: Rajkot HQ details, office hours, and contact form.
- `src/app/privacy-policy/page.tsx`: DPDP Act 2023 compliant privacy policy.
- `src/app/terms/page.tsx`: Terms of service.
- `src/app/disclaimer/page.tsx`: ICAI non-solicitation disclaimer.
- `src/components/Footer.tsx`: Global footer with Rajkot HQ, legal links, practice areas.
- `src/components/Navbar.tsx`: Fixed navigation with direct WhatsApp button and Client Portal button.
- `src/components/Associates.tsx`: CA Irfan Kadivar medium shot profile (4:5 aspect ratio with grayscale-to-color hover effect).
- `src/components/ServiceEnquiryForm.tsx` & `src/components/ContactForm.tsx`: Interactive enquiry forms with accessible labels and Vercel Analytics tracking.

---

## Commands & Workflows
- **Start Dev Server:** `npm run dev`
- **Build & Typecheck:** `npm run build`
- **Deploy to Vercel:** `npx vercel --prod --yes`

---

## Pending Backlog / Potential Next Steps
1. **Email Backend Integration:** Wire `ContactForm.tsx` and `ServiceEnquiryForm.tsx` to a real email delivery service (e.g. Next.js Server Actions with Resend, SendGrid, or Nodemailer) instead of the simulated state.
2. **Client Portal Authentication:** If the client wants a real client portal at `/client-portal`, integrate NextAuth / Supabase / Clerk authentication.
3. **Partner Membership Numbers:** When CA Irfan Kadivar provides the ICAI Membership No. and Firm Registration No. (FRN), populate them in `src/lib/config.ts`.
