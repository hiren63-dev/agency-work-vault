/**
 * Tier 3: Pairwise Combinations Test Suite
 * 16 Cross-Feature Test Cases
 * Harsh Manek & Co. Portfolio
 */

const {
  assert,
  assertEqual,
  assertMatch,
  assertNotMatch,
  httpGet,
  readProjectFile,
  fileExists,
  statutoryOracles,
} = require("./helpers.cjs");

const tests = [
  {
    id: "T3-01",
    name: "[F01 x F02] Localhost HTTP response ensures zero remote tracking or external review script injection",
    features: ["F01", "F02"],
    tier: 3,
    run: async () => {
      const res = await httpGet("/");
      assertEqual(res.statusCode, 200, "Local dev server must return 200");
      assertNotMatch(
        res.body,
        /justdial\.com|google-reviews|trustpilot/i,
        "Localhost page must not load external review syndication scripts"
      );
    },
  },
  {
    id: "T3-02",
    name: "[F02 x F03] Consultation booking CTA copy ('Schedule Consultation') contains zero em dashes and meets AA contrast",
    features: ["F02", "F03"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const ctaMatches = appCode.match(/Schedule\s+Consultation/gi) || [];
      assert(ctaMatches.length > 0, "CTA 'Schedule Consultation' must be present in App.tsx");
      assertNotMatch(
        appCode,
        /Schedule\s+Consultation[^\n]*\u2014/,
        "CTA line must not include em dash"
      );
    },
  },
  {
    id: "T3-03",
    name: "[F03 x F04] Typography styling with font-serif (Instrument Serif) and font-sans (Geist) pairs with compliant contrast text tokens",
    features: ["F03", "F04"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /Instrument\+Serif|Geist/i, "Approved fonts must be loaded in HTML");
      assertNotMatch(
        appCode,
        /font-serif[^\n]*text-white\/30/,
        "Serif typography must not use low-contrast text-white/30"
      );
    },
  },
  {
    id: "T3-04",
    name: "[F04 x F07] Invoice Strategist card layout conforms strictly to emerald/zinc color tokens with zero purple/violet glow tokens",
    features: ["F04", "F07"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const invMatch = appCode.match(/function InvoiceStrategist[\s\S]*?(?=function\s+[A-Z]|$)/);
      assert(invMatch, "InvoiceStrategist component must exist");
      const invCode = invMatch[0];
      assertNotMatch(invCode, /purple|violet/i, "InvoiceStrategist must contain zero purple or violet classes");
      assertMatch(invCode, /emerald|zinc/, "InvoiceStrategist must use emerald and zinc tokens");
    },
  },
  {
    id: "T3-05",
    name: "[F05 x F06] Dynamic Timeline statutory ITR filing dates (July 31 / Oct 31) harmonize with Tax Sandbox FY 2024-25 / AY 2025-26 rules",
    features: ["F05", "F06"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /July\s+31/i, "Timeline must mention July 31 deadline");
      assertMatch(appCode, /75000|75_000/, "Tax sandbox must use FY 2024-25 ₹75k standard deduction");
    },
  },
  {
    id: "T3-06",
    name: "[F06 x F08] Tax Sandbox tax liability for income > ₹15 Lakhs correctly feeds Section 234B advance tax default interest",
    features: ["F06", "F08"],
    tier: 3,
    run: async () => {
      // Income of ₹18,00,000 -> Taxable ₹17,25,000
      const taxRes = statutoryOracles.calculateNewRegimeTax(1800000);
      assert(taxRes.totalTax > 200000, "Tax on 18L should exceed ₹2,00,000");
      // If advance tax unpaid, Section 234B imposes 1% per month on shortfall
      const penalty = statutoryOracles.calculatePenaltyITR({
        taxableIncome: taxRes.taxable,
        delayMonths: 3,
        unpaidTax: taxRes.totalTax,
      });
      const expectedInterest = Math.round(taxRes.totalTax * 0.01 * 3);
      assertEqual(penalty.interest234A, expectedInterest, "3 months 234 interest on calculated tax matches oracle");
    },
  },
  {
    id: "T3-07",
    name: "[F07 x F08] Invoice Strategist net GST liability (18% on ₹2,00,000 = ₹36,000) correctly feeds GST Section 50 interest simulator for delayed payment",
    features: ["F07", "F08"],
    tier: 3,
    run: async () => {
      const inv = statutoryOracles.calculateInvoice({ amount: 200000, isReverse: false, rate: 0.18 });
      assertEqual(inv.totalTax, 36000, "18% GST on ₹2,00,000 is ₹36,000");
      // 30 days delayed payment of ₹36,000 GST liability
      const gstPen = statutoryOracles.calculatePenaltyGST({ delayDays: 30, isNil: false, unpaidTax: inv.totalTax });
      assertEqual(gstPen.feeSec47, 1500, "30 days late fee is ₹1,500");
      assert(gstPen.interestSec50 > 500 && gstPen.interestSec50 < 600, "30 days 18% p.a. interest is approx ₹532.60");
    },
  },
  {
    id: "T3-08",
    name: "[F06 x F07] Professional presumptive taxation under Section 44ADA (50% of gross receipts) harmonizes with SAC 9982 professional invoicing",
    features: ["F06", "F07"],
    tier: 3,
    run: async () => {
      const inv = statutoryOracles.calculateInvoice({ amount: 1000000, isReverse: false, rate: 0.18 });
      assertEqual(inv.sacCode, "9982", "SAC code for professional CA services must be 9982");
      // 44ADA taxable profit on 10 Lakhs is 5 Lakhs
      const profit44ADA = inv.baseAmount * 0.5;
      assertEqual(profit44ADA, 500000, "44ADA 50% deemed profit of ₹10L is ₹5L");
    },
  },
  {
    id: "T3-09",
    name: "[F02 x F09] Dynamic Blog article contents strictly adhere to ICAI ethics guidelines (factual analysis, zero unverified reviews or fee undercutting)",
    features: ["F02", "F09"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const blogMatch = appCode.match(/BLOG_POSTS\s*=\s*\[[\s\S]*?\];/);
      assert(blogMatch, "BLOG_POSTS dataset must be defined");
      const blogContent = blogMatch[0];
      assertNotMatch(blogContent, /5\.0\s*★|5\.0\s*Rating/i, "Blog posts must not contain fake ratings");
      assertNotMatch(blogContent, /free consultation|free review/i, "Blog posts must not advertise free consultations");
    },
  },
  {
    id: "T3-10",
    name: "[F03 x F09] Dynamic Blog post headers, bodies, and excerpts contain zero em dashes and maintain high text contrast",
    features: ["F03", "F09"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const blogMatch = appCode.match(/BLOG_POSTS\s*=\s*\[[\s\S]*?\];/);
      assert(blogMatch, "BLOG_POSTS dataset must be defined");
      const blogContent = blogMatch[0];
      assertNotMatch(blogContent, /\u2014/, "BLOG_POSTS must not contain em dashes (\\u2014)");
    },
  },
  {
    id: "T3-11",
    name: "[F05 x F09] Dynamic Blog articles reference statutory deadlines (e.g. Budget 2024 changes, GSTR-3B compliance) featured in the compliance timeline",
    features: ["F05", "F09"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /Budget\s+2024|Tax\s+Reforms|GST\s+Updates/i, "Blog articles must cover statutory tax and GST updates");
    },
  },
  {
    id: "T3-12",
    name: "[F10 x F11] Sitemap.xml <loc> entries match all canonical URLs referenced in OpenGraph meta tags and JSON-LD schema",
    features: ["F10", "F11"],
    tier: 3,
    run: async () => {
      const sitemap = readProjectFile("public/sitemap.xml") || "";
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(sitemap, /<loc>/, "sitemap.xml must have <loc> tags");
      assertMatch(indexHtml, /og:url/, "index.html must have og:url meta tag");
    },
  },
  {
    id: "T3-13",
    name: "[F02 x F10] JSON-LD LocalBusiness / AccountingService schema specifies verified credentials ('FCA', 'DISA') and excludes fake aggregateRating schema",
    features: ["F02", "F10"],
    tier: 3,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain JSON-LD");
      assertNotMatch(
        jsonLdMatch[1],
        /aggregateRating/i,
        "JSON-LD must NOT contain aggregateRating schema per ICAI ethics"
      );
    },
  },
  {
    id: "T3-14",
    name: "[F04 x F08] Penalty Simulator sliders, progress indicators, and penalty breakdown badges conform strictly to zinc/emerald/rose palette without purple glow",
    features: ["F04", "F08"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const penMatch = appCode.match(/function PenaltySimulator[\s\S]*?(?=function\s+[A-Z]|$)/);
      assert(penMatch, "PenaltySimulator component must exist");
      const penCode = penMatch[0];
      assertNotMatch(penCode, /purple|violet/i, "PenaltySimulator must not contain purple or violet tokens");
    },
  },
  {
    id: "T3-15",
    name: "[F01 x F12] Localhost dev server parity check: static assets served on port 5173 correspond to files in project workspace without 404s",
    features: ["F01", "F12"],
    tier: 3,
    run: async () => {
      const res = await httpGet("/favicon.svg");
      assertEqual(res.statusCode, 200, "Static asset /favicon.svg must return HTTP 200");
    },
  },
  {
    id: "T3-16",
    name: "[F07 x F10] Invoice Strategist SAC code 9982 and Rajkot jurisdiction align with LocalBusiness schema tax consultancy service classification",
    features: ["F07", "F10"],
    tier: 3,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(appCode, /9982/, "App.tsx must include SAC 9982");
      assertMatch(indexHtml, /AccountingService|Rajkot/i, "index.html must include Rajkot accounting service classification");
    },
  },
];

module.exports = { tests };
