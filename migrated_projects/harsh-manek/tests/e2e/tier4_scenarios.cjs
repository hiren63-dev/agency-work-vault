/**
 * Tier 4: Real-World Application Scenarios Test Suite
 * 6 Comprehensive End-to-End User Journeys
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
    id: "T4-01",
    name: "Scenario 1: Salaried Tech Professional Tax Optimization Journey (F06, F05, F02)",
    features: ["F06", "F05", "F02"],
    tier: 4,
    complexity: "High",
    run: async () => {
      // Step 1: User enters ₹12,00,000 gross salary
      const gross = 1200000;
      const newRegime = statutoryOracles.calculateNewRegimeTax(gross);
      const oldRegime = statutoryOracles.calculateOldRegimeTax(gross, 150000, 25000);

      // Verify ₹75,000 standard deduction
      assertEqual(newRegime.stdDeduction, 75000, "New regime standard deduction must be ₹75,000");
      assertEqual(newRegime.taxable, 1125000, "Taxable income must be ₹11,25,000");

      // Verify tax calculations
      // New: 0 (0-3L) + 20,000 (3-7L) + 30,000 (7-10L) + 18,750 (10-11.25L) = 68,750 + 4% cess = 71,500
      assertEqual(newRegime.totalTax, 71500, "New regime tax on 12L should be ₹71,500");
      // Old: 12L - 50k std - 1.75L deductions = 9.75L taxable. Tax: 12.5k + 95k = 1,07,500 + 4% = 1,11,800
      assertEqual(oldRegime.totalTax, 111800, "Old regime tax on 12L should be ₹1,11,800");

      // New regime saves ₹40,300
      const savings = oldRegime.totalTax - newRegime.totalTax;
      assertEqual(savings, 40300, "New regime tax savings must be ₹40,300");

      // Step 2: User inspects compliance calendar for filing deadline (July 31)
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /July\s+31|31st\s+July/i, "Compliance calendar must present July 31 ITR deadline");

      // Step 3: User books consultation with FCA verified professional
      assertMatch(appCode, /FCA\s*(&|and)\s*DISA/i, "Booking CTA must display verified qualifications");
      assertMatch(appCode, /Schedule\s+Consultation/i, "CTA must use 'Schedule Consultation'");
    },
  },

  {
    id: "T4-02",
    name: "Scenario 2: Rajkot Manufacturing Unit GST & Invoice Invoicing Compliance (F07, F08, F05, F10)",
    features: ["F07", "F08", "F05", "F10"],
    tier: 4,
    complexity: "High",
    run: async () => {
      // Step 1: Forward invoicing calculation for ₹1,80,000 consignment (Inter-state)
      const invoice = statutoryOracles.calculateInvoice({
        amount: 180000,
        isReverse: false,
        isInterState: true,
        rate: 0.18,
      });

      assertEqual(invoice.baseAmount, 180000, "Base consignment value is ₹1,80,000");
      assertEqual(invoice.igst, 32400, "18% IGST is ₹32,400");
      assertEqual(invoice.totalAmount, 212400, "Total invoice amount is ₹2,12,400");

      // Step 2: Value exceeds ₹50,000 -> Rule 138 E-Way bill alert
      assertEqual(invoice.eWayBillRequired, true, "E-Way bill required for consignment > ₹50,000");

      // Step 3: Check GSTR-3B monthly deadline (20th of month)
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /GSTR-3B|20th/i, "Dynamic timeline must include GSTR-3B 20th deadline");

      // Step 4: Delayed payment penalty simulator for 15 days delay
      const gstPen = statutoryOracles.calculatePenaltyGST({
        delayDays: 15,
        isNil: false,
        unpaidTax: invoice.igst,
      });
      assertEqual(gstPen.feeSec47, 750, "15 days late fee @ ₹50/day is ₹750");
      assert(gstPen.interestSec50 > 230 && gstPen.interestSec50 < 250, "15 days interest @ 18% p.a. on ₹32,400 is approx ₹240");
    },
  },

  {
    id: "T4-03",
    name: "Scenario 3: Corporate Annual Statutory Audit & MCA Compliance Onboarding (F02, F05, F09, F03)",
    features: ["F02", "F05", "F09", "F03"],
    tier: 4,
    complexity: "Medium",
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";

      // Step 1: Verify firm credentials & absence of fabricated reviews
      assertMatch(appCode, /FCA\s*(&|and)\s*DISA/i, "Credentials must confirm FCA and DISA qualifications");
      assertNotMatch(appCode, /5\.0\s*(?:Rating|★)/i, "Must not contain fake ratings");

      // Step 2: Statutory MCA audit deadlines
      assertMatch(appCode, /Tax\s+Audit|September\s+30|October\s+31/i, "Must specify corporate audit deadlines");

      // Step 3: Blog article on compliance & anti-slop copy verification
      assertMatch(appCode, /BLOG_POSTS/i, "Must provide structured blog articles");
      const emDashCount = (appCode.match(/\u2014/g) || []).length;
      assertEqual(emDashCount, 0, "Zero em dashes allowed in corporate onboarding copy");

      // Step 4: Schedule Consultation without fee undercutting
      assertMatch(appCode, /Schedule\s+Consultation/i, "Must present Schedule Consultation CTA");
      assertNotMatch(appCode, /Free\s+Consultation/i, "Must not use Free Consultation phrasing");
    },
  },

  {
    id: "T4-04",
    name: "Scenario 4: Belated Return & Section 234 Interest Assessment Workflow (F08, F06, F02)",
    features: ["F08", "F06", "F02"],
    tier: 4,
    complexity: "Medium",
    run: async () => {
      // Step 1: Taxpayer with gross income ₹6,50,000 filing belated return on Nov 15 (4 months late)
      const income = 650000;
      const newRegime = statutoryOracles.calculateNewRegimeTax(income);

      // Income after std deduction = 6.5L - 75k = 5.75L -> Section 87A full rebate applies
      assertEqual(newRegime.totalTax, 0, "Taxable income ₹5.75L has ₹0 base tax under 87A");

      // Step 2: Self-employed individual with taxable income ₹6,50,000 and ₹20,000 unpaid self-assessment tax
      const penalty = statutoryOracles.calculatePenaltyITR({
        taxableIncome: 650000,
        delayMonths: 4,
        unpaidTax: 20000,
      });

      // Income > ₹5L -> Section 234F fee is ₹5,000
      assertEqual(penalty.fee234F, 5000, "Section 234F late fee for income > 5L is ₹5,000");
      // 4 months interest @ 1% per month on ₹20,000 = ₹800
      assertEqual(penalty.interest234A, 800, "Section 234A interest for 4 months on ₹20k is ₹800");
      assertEqual(penalty.totalLateCost, 5800, "Total late filing liability is ₹5,800");

      // Step 3: UI checks
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /234F|234A/i, "Penalty simulator must handle 234F and 234A");
    },
  },

  {
    id: "T4-05",
    name: "Scenario 5: Local Search Discovery & FAQ Answering Journey (F10, F11, F04, F02)",
    features: ["F10", "F11", "F04", "F02"],
    tier: 4,
    complexity: "Medium",
    run: async () => {
      // Step 1: Crawler discovers robots.txt and sitemap.xml
      assert(fileExists("public/robots.txt"), "robots.txt must exist");
      assert(fileExists("public/sitemap.xml"), "sitemap.xml must exist");

      const robots = readProjectFile("public/robots.txt") || "";
      assertMatch(robots, /Sitemap:/i, "robots.txt must link to sitemap.xml");

      const sitemap = readProjectFile("public/sitemap.xml") || "";
      assertMatch(sitemap, /<loc>/i, "sitemap must contain URL locations");

      // Step 2: Search engine parses index.html structured data
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /AccountingService|LocalBusiness/i, "Must define AccountingService schema");
      assertMatch(indexHtml, /FAQPage/i, "Must define FAQPage schema for AI search engines");
      assertMatch(indexHtml, /Rajkot/i, "Must declare Rajkot locality");
      assertMatch(indexHtml, /geo\.region/i, "Must declare geo.region tag");

      // Step 3: Verify zero review fabrication in schema or page
      assertNotMatch(indexHtml, /aggregateRating/i, "Must not inject aggregateRating schema");
      assertNotMatch(indexHtml, /5\.0\s*★/i, "Must not contain 5.0 star claims");
    },
  },

  {
    id: "T4-06",
    name: "Scenario 6: Reverse Invoicing and E-Way Bill Dispatch Calculation (F07, F04, F03)",
    features: ["F07", "F04", "F03"],
    tier: 4,
    complexity: "Medium",
    run: async () => {
      // Client enters all-inclusive budget of ₹1,18,000 for SAC 9982 services
      const inv = statutoryOracles.calculateInvoice({
        amount: 118000,
        isReverse: true,
        isInterState: false,
        rate: 0.18,
      });

      assertEqual(inv.baseAmount, 100000, "Base value for ₹1,18,000 inclusive is ₹1,00,000");
      assertEqual(inv.totalTax, 18000, "Total 18% GST is ₹18,000");
      assertEqual(inv.cgst, 9000, "Intra-state CGST (9%) is ₹9,000");
      assertEqual(inv.sgst, 9000, "Intra-state SGST (9%) is ₹9,000");
      assertEqual(inv.eWayBillRequired, true, "Total amount > ₹50k triggers Rule 138 threshold");

      // UI checks: SAC 9982, zero purple tokens, zero em dashes
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /9982/, "SAC 9982 must be displayed in invoice component");

      const invMatch = appCode.match(/function InvoiceStrategist[\s\S]*?(?=function\s+[A-Z]|$)/);
      if (invMatch) {
        assertNotMatch(invMatch[0], /purple|violet/i, "Invoice component must contain zero purple tokens");
        assertNotMatch(invMatch[0], /\u2014/, "Invoice component must contain zero em dashes");
      }
    },
  },
];

module.exports = { tests };
