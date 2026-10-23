# Kadivar & Associates - Website Redesign

This is a Next.js App Router project for Kadivar & Associates, built to strict ICAI guidelines.

## Verification of Analytics

Vercel Analytics is integrated. We track three primary conversion events:
1. **Contact Form Submitted**: Fires when a user successfully submits the enquiry form on `/contact` or `/services/[slug]` or the homepage.
2. **Call Click**: Fires when a user taps the "Call Us" sticky button on mobile devices.
3. **WhatsApp Click**: Fires when a user taps the "WhatsApp" sticky button on mobile devices.

**How to verify:**
1. Open the Developer Tools in your browser (F12).
2. Go to the Network tab.
3. Interact with the form (submit) or click the Call/WhatsApp buttons.
4. Look for a network request to `/_vercel/insights/script.js` or `/_vercel/insights/event`. The payload will contain the event name (e.g., `Contact Form Submitted`).
5. Alternatively, once deployed to Vercel, you can view these events popping up in real-time in the Vercel Dashboard under the "Analytics" -> "Events" tab.

## Compliance
This codebase is strictly aligned with the Institute of Chartered Accountants of India (ICAI) Code of Ethics. There are no client logos, testimonials, comparisons, or superlatives. Do not introduce any of these in future updates.
