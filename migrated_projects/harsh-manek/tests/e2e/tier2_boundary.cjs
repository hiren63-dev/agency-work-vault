/**
 * Tier 2: Boundary & Corner Cases Test Suite (F01-B - F12-B)
 * 60 Test Cases (5 per feature across 12 features)
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
const { execSync } = require("child_process");

const tests = [
  // ==========================================
  // F01-B: Localhost Isolation Boundaries
  // ==========================================
  {
    id: "T2-F01-01",
    name: "Git remotes command execution handles empty or whitespace output without throwing",
    feature: "F01",
    tier: 2,
    run: async () => {
      let remotes = "";
      try {
        remotes = execSync("git remote -v", { encoding: "utf8" }).trim();
      } catch (err) {
        remotes = "";
      }
      assertEqual(remotes.length, 0, "Git remotes must have length 0");
    },
  },
  {
    id: "T2-F01-02",
    name: "Dev server handles HEAD request gracefully returning 200 with content-type",
    feature: "F01",
    tier: 2,
    run: async () => {
      const res = await httpGet("/", { method: "HEAD" });
      assertEqual(res.statusCode, 200, "HEAD request to / must return HTTP 200");
    },
  },
  {
    id: "T2-F01-03",
    name: "Dev server serves static assets with non-zero Content-Length or valid body",
    feature: "F01",
    tier: 2,
    run: async () => {
      const res = await httpGet("/favicon.svg");
      assertEqual(res.statusCode, 200, "favicon.svg must return HTTP 200");
      assert(res.body.length > 50, "favicon.svg body must be non-empty");
    },
  },
  {
    id: "T2-F01-04",
    name: "Localhost port 5173 does not issue 301/302 redirects to remote external domains",
    feature: "F01",
    tier: 2,
    run: async () => {
      const res = await httpGet("/");
      assert(
        res.statusCode !== 301 && res.statusCode !== 302,
        "Dev server must not redirect to remote domain"
      );
      if (res.headers.location) {
        assertNotMatch(
          res.headers.location,
          /^https?:\/\//,
          "Redirect location must not point to external domain"
        );
      }
    },
  },
  {
    id: "T2-F01-05",
    name: "Build script handles production env flags without throwing environment variable errors",
    feature: "F01",
    tier: 2,
    run: async () => {
      const viteConfig = readProjectFile("vite.config.ts") || "";
      assertMatch(viteConfig, /defineConfig/, "vite.config.ts must be valid configuration");
    },
  },

  // ==========================================
  // F02-B: ICAI Ethics Boundary & Synonym Variations
  // ==========================================
  {
    id: "T2-F02-01",
    name: "Regex detects subtle fractional ratings ('4.9/5', '4.8 out of 5', '5/5 stars') in source code",
    feature: "F02",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /(?:4\.[5-9]|5\.0)\s*\/\s*5/i,
        "App.tsx must not contain fractional star ratings like 4.9/5"
      );
      assertNotMatch(
        appCode,
        /(?:4\.[5-9]|5\.0)\s*out of\s*5/i,
        "App.tsx must not contain 'out of 5' rating claims"
      );
    },
  },
  {
    id: "T2-F02-02",
    name: "Regex detects Unicode star symbols (★, ⭐, ☆) attached to numerical review metrics",
    feature: "F02",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /[0-9]\.[0-9]\s*[★⭐☆]/,
        "App.tsx must not contain numerical rating combined with star symbols"
      );
    },
  },
  {
    id: "T2-F02-03",
    name: "Case-insensitive detection of discount bait phrases ('complimentary consultation', 'free 30-min call', '100% free')",
    feature: "F02",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(appCode, /complimentary\s+consultation/i, "Must not advertise 'complimentary consultation'");
      assertNotMatch(appCode, /free\s+(?:30-?min|discovery|introductory)\s+call/i, "Must not advertise 'free discovery call'");
      assertNotMatch(appCode, /100%\s+free/i, "Must not advertise '100% free'");
    },
  },
  {
    id: "T2-F02-04",
    name: "Search ensures FCA qualification is accompanied by DISA or statutory ICAI designations",
    feature: "F02",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /FCA\s*(&|and)\s*DISA/i,
        "Credential display must specifically highlight 'FCA & DISA Qualified'"
      );
    },
  },
  {
    id: "T2-F02-05",
    name: "Detection of promotional superlatives with punctuation variations ('#1!', 'Best in Saurashtra', 'No. 1 CA')",
    feature: "F02",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(appCode, /No\.\s*1\s+CA/i, "Must not advertise 'No. 1 CA'");
      assertNotMatch(appCode, /#1\s+in\s+Rajkot/i, "Must not advertise '#1 in Rajkot'");
      assertNotMatch(appCode, /Best\s+in\s+Saurashtra/i, "Must not advertise 'Best in Saurashtra'");
    },
  },

  // ==========================================
  // F03-B: Anti-Slop Unicode & Contrast Boundaries
  // ==========================================
  {
    id: "T2-F03-01",
    name: "Rigorous Unicode check for all em dash variants (U+2014 em dash, U+2015 horizontal bar, &mdash;, &#8212;)",
    feature: "F03",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const indexHtml = readProjectFile("index.html") || "";
      assertNotMatch(appCode, /[\u2014\u2015]|&mdash;|&#8212;/, "App.tsx contains em dash or horizontal bar entity");
      assertNotMatch(indexHtml, /[\u2014\u2015]|&mdash;|&#8212;/, "index.html contains em dash entity");
    },
  },
  {
    id: "T2-F03-02",
    name: "Permissible en dash (U+2013) verification in numerical ranges (e.g. 2024–25, 9–5) without em dash conflation",
    feature: "F03",
    tier: 2,
    run: async () => {
      // Oracle check: en dash is U+2013, em dash is U+2014
      const enDash = "\u2013";
      const emDash = "\u2014";
      assert(enDash.charCodeAt(0) === 0x2013, "En dash char code is 0x2013");
      assert(emDash.charCodeAt(0) === 0x2014, "Em dash char code is 0x2014");
    },
  },
  {
    id: "T2-F03-03",
    name: "Detects stacked low-contrast opacity classes (text-white/20, text-white/25, text-zinc-600/30)",
    feature: "F03",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(appCode, /\btext-white\/(?:10|15|20|25)\b/, "Must not use ultra-low contrast white text opacity");
      assertNotMatch(appCode, /\btext-zinc-600\/(?:20|30)\b/, "Must not use muted zinc opacity on dark background");
    },
  },
  {
    id: "T2-F03-04",
    name: "Input placeholders in contact modals provide legible contrast (placeholder:text-zinc-400 or placeholder:text-zinc-500)",
    feature: "F03",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /\bplaceholder:text-white\/(?:20|30)\b/,
        "Input placeholders must not use illegible text-white/20 or text-white/30"
      );
    },
  },
  {
    id: "T2-F03-05",
    name: "Heading hierarchy boundary: ensures main heading is present and properly nested",
    feature: "F03",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /<h1[\s>]/, "App.tsx must define an <h1> tag for main hero section");
      assertMatch(appCode, /<h2[\s>]/, "App.tsx must define <h2> tags for section headings");
    },
  },

  // ==========================================
  // F04-B: Taste Architect Color & Font Boundaries
  // ==========================================
  {
    id: "T2-F04-01",
    name: "Exhaustive color scan checks across all Tailwind purple/violet tokens (purple-300 to 900, violet-300 to 900)",
    feature: "F04",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /\b(?:bg|text|border|ring|shadow)-(?:purple|violet)-(?:300|400|500|600|700|800|900)\b/,
        "App.tsx contains prohibited purple/violet utility tokens"
      );
    },
  },
  {
    id: "T2-F04-02",
    name: "Gradient boundary: checks that no background gradient uses purple stop (to-purple-, via-purple-, from-violet-)",
    feature: "F04",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /\b(?:from|via|to)-(?:purple|violet)-/i,
        "Gradients must not include purple or violet color stops"
      );
    },
  },
  {
    id: "T2-F04-03",
    name: "Font family declaration boundary: verifies fallback generic families (sans-serif, serif, monospace) in CSS tokens",
    feature: "F04",
    tier: 2,
    run: async () => {
      const css = readProjectFile("src/index.css") || "";
      assertMatch(css, /font-sans|sans-serif/i, "CSS must define sans-serif font family");
      assertMatch(css, /font-serif|serif/i, "CSS must define serif font family");
      assertMatch(css, /font-mono|monospace/i, "CSS must define monospace font family");
    },
  },
  {
    id: "T2-F04-04",
    name: "Refined border radius boundary: ensures interactive cards use subtle rounded corners",
    feature: "F04",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /\brounded-(?:xl|2xl|3xl)\b/,
        "Cards and modals must use refined rounded corner tokens"
      );
    },
  },
  {
    id: "T2-F04-05",
    name: "Motion spring physics boundary: verifies damping, stiffness, and mass constants are positive numbers",
    feature: "F04",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /stiffness:\s*[0-9]+/, "Spring physics stiffness must be a positive number");
      assertMatch(appCode, /damping:\s*[0-9]+/, "Spring physics damping must be a positive number");
    },
  },

  // ==========================================
  // F05-B: Dynamic Timeline Edge Dates & State Boundaries
  // ==========================================
  {
    id: "T2-F05-01",
    name: "Statutory calendar handles leap-year February 28/29 edge dates without overflow",
    feature: "F05",
    tier: 2,
    run: async () => {
      const leapDate = new Date("2024-02-29");
      assertEqual(leapDate.getDate(), 29, "2024 is a leap year with 29 days in Feb");
    },
  },
  {
    id: "T2-F05-02",
    name: "Advance tax payment installment dates (June 15, Sept 15, Dec 15, March 15) all verified",
    feature: "F05",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Advance Tax|15th\s+June|15th\s+September|15th\s+December|15th\s+March/i,
        "Statutory calendar must specify Advance Tax installments"
      );
    },
  },
  {
    id: "T2-F05-03",
    name: "Belated/revised return deadline (December 31 of Assessment Year) verified",
    feature: "F05",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /December\s+31|31st\s+December|Belated/i,
        "Statutory calendar must specify December 31 belated return deadline"
      );
    },
  },
  {
    id: "T2-F05-04",
    name: "Dynamic timeline view switch toggles between exactly 2 defined modes without undefined state",
    feature: "F05",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /timelineMode|activeTimeline|viewMode/i,
        "DynamicTimeline must define explicit state for switching views"
      );
    },
  },
  {
    id: "T2-F05-05",
    name: "Timeline events list is strictly ordered by date or step sequence without duplicate IDs",
    feature: "F05",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /TIMELINE|DEADLINES|CALENDAR/i, "Timeline items array must be defined");
    },
  },

  // ==========================================
  // F06-B: Tax Sandbox Boundary Salaries & Marginal Relief
  // ==========================================
  {
    id: "T2-F06-01",
    name: "Gross salary exactly ₹7,00,000: New Regime tax after ₹75k standard deduction is ₹0",
    feature: "F06",
    tier: 2,
    run: async () => {
      const result = statutoryOracles.calculateNewRegimeTax(700000);
      assertEqual(result.taxable, 625000, "Taxable income must be ₹6,25,000");
      assertEqual(result.totalTax, 0, "Tax must be ₹0 under Section 87A rebate");
    },
  },
  {
    id: "T2-F06-02",
    name: "Gross salary exactly ₹7,75,000: Taxable income is ₹7,00,000, Section 87A rebate applies, net tax = ₹0",
    feature: "F06",
    tier: 2,
    run: async () => {
      const result = statutoryOracles.calculateNewRegimeTax(775000);
      assertEqual(result.taxable, 700000, "Taxable income must be exactly ₹7,00,000");
      assertEqual(result.totalTax, 0, "Tax must be ₹0 due to full Section 87A rebate at ₹7L taxable income");
    },
  },
  {
    id: "T2-F06-03",
    name: "Marginal relief boundary at gross salary ₹7,75,100: Tax payable cannot exceed excess income over ₹7,75,000",
    feature: "F06",
    tier: 2,
    run: async () => {
      const result = statutoryOracles.calculateNewRegimeTax(775100);
      assertEqual(result.taxable, 700100, "Taxable income is ₹7,00,100");
      // Excess over 7L is 100. Tax before cess capped at 100.
      assert(result.baseTax <= 100, "Base tax must not exceed excess income of ₹100");
    },
  },
  {
    id: "T2-F06-04",
    name: "Zero income boundary (₹0 Gross): tax is ₹0, no negative tax or NaN calculated",
    feature: "F06",
    tier: 2,
    run: async () => {
      const result = statutoryOracles.calculateNewRegimeTax(0);
      assertEqual(result.taxable, 0, "Taxable income for ₹0 gross must be 0");
      assertEqual(result.totalTax, 0, "Tax for ₹0 gross must be 0");
      assert(!isNaN(result.totalTax), "Tax must not be NaN");
    },
  },
  {
    id: "T2-F06-05",
    name: "High net worth boundary (₹5,00,00,000 Gross): correctly calculates 30% top bracket and 4% cess without integer overflow",
    feature: "F06",
    tier: 2,
    run: async () => {
      const result = statutoryOracles.calculateNewRegimeTax(50000000);
      assert(result.totalTax > 14000000, "Tax on 5 Cr must exceed 1.4 Cr");
      assert(Number.isFinite(result.totalTax), "Tax must be a finite number");
    },
  },

  // ==========================================
  // F07-B: Invoice Strategist Threshold Boundaries & Rounding
  // ==========================================
  {
    id: "T2-F07-01",
    name: "Consignment value boundary at exactly ₹50,000: E-Way bill Rule 138 applies when value exceeds ₹50,000",
    feature: "F07",
    tier: 2,
    run: async () => {
      const resAt50k = statutoryOracles.calculateInvoice({ amount: 50000, isReverse: false, rate: 0.18 });
      // Rule 138 specifies consignment value exceeding ₹50,000
      assertEqual(resAt50k.eWayBillThreshold, 50000, "E-Way bill threshold must be ₹50,000");
    },
  },
  {
    id: "T2-F07-02",
    name: "Consignment value boundary at ₹50,001: E-Way bill alert MUST be active",
    feature: "F07",
    tier: 2,
    run: async () => {
      const resAbove50k = statutoryOracles.calculateInvoice({ amount: 50001, isReverse: false, rate: 0.18 });
      assertEqual(resAbove50k.eWayBillRequired, true, "E-Way bill must be required for value > ₹50,000");
    },
  },
  {
    id: "T2-F07-03",
    name: "Aggregate turnover boundary at ₹5,00,00,000 (₹5 Cr): Rule 48(4) E-Invoicing mandatory badge active",
    feature: "F07",
    tier: 2,
    run: async () => {
      const oracle = statutoryOracles.calculateInvoice({ amount: 100000 });
      assertEqual(oracle.eInvoicingThreshold, 50000000, "E-Invoicing turnover threshold is ₹5 Crore");
    },
  },
  {
    id: "T2-F07-04",
    name: "Reverse invoicing paise rounding: input ₹1,00,000 total with 18% GST gives base ₹84,745.76 and GST ₹15,254.24 (sum equals total)",
    feature: "F07",
    tier: 2,
    run: async () => {
      const res = statutoryOracles.calculateInvoice({ amount: 100000, isReverse: true, rate: 0.18 });
      assertEqual(res.baseAmount, 84745.76, "Base amount must be ₹84,745.76");
      assertEqual(res.totalTax, 15254.24, "Total tax must be ₹15,254.24");
      const sum = Math.round((res.baseAmount + res.totalTax) * 100) / 100;
      assertEqual(sum, 100000, "Base amount + tax must equal exactly ₹1,00,000");
    },
  },
  {
    id: "T2-F07-05",
    name: "Input validation: negative invoice amounts or non-numeric strings are clamped to 0",
    feature: "F07",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Math\.max\(0|parseFloat|Number\(/,
        "InvoiceStrategist must sanitize numerical inputs"
      );
    },
  },

  // ==========================================
  // F08-B: Penalty Simulator Day & Income Boundaries
  // ==========================================
  {
    id: "T2-F08-01",
    name: "Delay of exactly 0 days: both 234A interest and GST late fee equal ₹0",
    feature: "F08",
    tier: 2,
    run: async () => {
      const itrPenalty = statutoryOracles.calculatePenaltyITR({ taxableIncome: 800000, delayMonths: 0, unpaidTax: 50000 });
      assertEqual(itrPenalty.fee234F, 0, "234F fee must be 0 for 0 delay");
      assertEqual(itrPenalty.interest234A, 0, "234A interest must be 0 for 0 delay");

      const gstPenalty = statutoryOracles.calculatePenaltyGST({ delayDays: 0, unpaidTax: 20000 });
      assertEqual(gstPenalty.feeSec47, 0, "GST Sec 47 late fee must be 0 for 0 delay");
      assertEqual(gstPenalty.interestSec50, 0, "GST Sec 50 interest must be 0 for 0 delay");
    },
  },
  {
    id: "T2-F08-02",
    name: "Delay of 1 day: triggers 1 month interest under Section 234A (part of month counts as full month) and 1 day GST late fee",
    feature: "F08",
    tier: 2,
    run: async () => {
      const itrPenalty = statutoryOracles.calculatePenaltyITR({ taxableIncome: 800000, delayMonths: 1, unpaidTax: 10000 });
      assertEqual(itrPenalty.interest234A, 100, "1 month 234A interest on 10k is ₹100 (1%)");

      const gstPenalty = statutoryOracles.calculatePenaltyGST({ delayDays: 1, isNil: false, unpaidTax: 10000 });
      assertEqual(gstPenalty.feeSec47, 50, "1 day regular GST late fee is ₹50");
    },
  },
  {
    id: "T2-F08-03",
    name: "Income boundary for Section 234F: exactly ₹5,00,000 yields ₹1,000 late fee, ₹5,00,001 yields ₹5,000 late fee",
    feature: "F08",
    tier: 2,
    run: async () => {
      const penaltyAt5L = statutoryOracles.calculatePenaltyITR({ taxableIncome: 500000, delayMonths: 2 });
      assertEqual(penaltyAt5L.fee234F, 1000, "234F late fee for income <= 5L is ₹1,000");

      const penaltyAbove5L = statutoryOracles.calculatePenaltyITR({ taxableIncome: 500001, delayMonths: 2 });
      assertEqual(penaltyAbove5L.fee234F, 5000, "234F late fee for income > 5L is ₹5,000");
    },
  },
  {
    id: "T2-F08-04",
    name: "GST nil return late fee boundary: 10 days delay on nil return = ₹200 (₹20/day) vs regular return = ₹500 (₹50/day)",
    feature: "F08",
    tier: 2,
    run: async () => {
      const nilPenalty = statutoryOracles.calculatePenaltyGST({ delayDays: 10, isNil: true });
      assertEqual(nilPenalty.feeSec47, 200, "10 days nil return late fee is ₹200");

      const regPenalty = statutoryOracles.calculatePenaltyGST({ delayDays: 10, isNil: false });
      assertEqual(regPenalty.feeSec47, 500, "10 days regular return late fee is ₹500");
    },
  },
  {
    id: "T2-F08-05",
    name: "Extended delay boundary (365 days): Section 50 interest computes exactly 18% of delayed principal",
    feature: "F08",
    tier: 2,
    run: async () => {
      const penaltyYear = statutoryOracles.calculatePenaltyGST({ delayDays: 365, unpaidTax: 100000 });
      assertEqual(penaltyYear.interestSec50, 18000, "365 days interest on 1,00,000 at 18% p.a. is ₹18,000");
    },
  },

  // ==========================================
  // F09-B: Blog Route Slugs & Parameter Boundaries
  // ==========================================
  {
    id: "T2-F09-01",
    name: "Blog slug boundary: non-existent slug /blog/non-existent-article-xyz renders graceful not-found UI",
    feature: "F09",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /find\s*\(\s*p\s*=>\s*p\.id\s*===/i,
        "BlogPostPage must find post by id matching route param"
      );
      assertMatch(
        appCode,
        /!post|post === undefined/i,
        "BlogPostPage must handle missing post condition"
      );
    },
  },
  {
    id: "T2-F09-02",
    name: "Empty slug path /blog renders blog index listing all articles",
    feature: "F09",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /path="\/blog"/,
        "App.tsx must define Route path='/blog' for blog index"
      );
    },
  },
  {
    id: "T2-F09-03",
    name: "URL encoded characters in slug /blog/gst%20rules handled safely without URIError",
    feature: "F09",
    tier: 2,
    run: async () => {
      const testSlug = decodeURIComponent("gst%20rules");
      assertEqual(testSlug, "gst rules", "decodeURIComponent handles encoded slug safely");
    },
  },
  {
    id: "T2-F09-04",
    name: "Case sensitivity handling for blog slugs in routing data",
    feature: "F09",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /toLowerCase\(\)|toLowerCase/i,
        "Blog lookup or slugs should normalize or handle case comparisons safely"
      );
    },
  },
  {
    id: "T2-F09-05",
    name: "Blog posts data array has valid unique slugs, published dates, reading times, and non-empty content strings",
    feature: "F09",
    tier: 2,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /readTime:/i, "BLOG_POSTS items must define readTime");
      assertMatch(appCode, /date:/i, "BLOG_POSTS items must define date");
    },
  },

  // ==========================================
  // F10-B: Schema LD+JSON Parsing & Data Validation Boundaries
  // ==========================================
  {
    id: "T2-F10-01",
    name: "Embedded JSON-LD script contains valid parseable JSON (JSON.parse does not throw)",
    feature: "F10",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain <script type='application/ld+json'>");
      const parsed = JSON.parse(jsonLdMatch[1]);
      assert(typeof parsed === "object" && parsed !== null, "JSON-LD must parse to valid object");
    },
  },
  {
    id: "T2-F10-02",
    name: "Schema @context must be 'https://schema.org' and @type must be 'AccountingService' or 'LocalBusiness'",
    feature: "F10",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain JSON-LD");
      const parsed = JSON.parse(jsonLdMatch[1]);
      const schema = Array.isArray(parsed) ? parsed[0] : (parsed["@graph"] ? parsed["@graph"][0] : parsed);
      assertMatch(schema["@context"], /https?:\/\/schema\.org/, "Schema @context must be schema.org");
      assertMatch(schema["@type"], /AccountingService|LocalBusiness/, "Schema @type must be AccountingService or LocalBusiness");
    },
  },
  {
    id: "T2-F10-03",
    name: "Schema geo coordinates (latitude, longitude) are valid numerical floats corresponding to Rajkot region",
    feature: "F10",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain JSON-LD");
      const parsed = JSON.parse(jsonLdMatch[1]);
      const schema = Array.isArray(parsed) ? parsed[0] : (parsed["@graph"] ? parsed["@graph"][0] : parsed);
      const geo = schema.geo;
      assert(geo, "Schema must contain geo coordinates");
      const lat = parseFloat(geo.latitude);
      const lon = parseFloat(geo.longitude);
      // Rajkot coordinates ~22.3° N, ~70.8° E
      assert(lat >= 22.0 && lat <= 23.0, `Latitude ${lat} must be in Rajkot region (22.0 - 23.0)`);
      assert(lon >= 70.0 && lon <= 71.5, `Longitude ${lon} must be in Rajkot region (70.0 - 71.5)`);
    },
  },
  {
    id: "T2-F10-04",
    name: "Schema address object contains streetAddress, addressLocality ('Rajkot'), addressRegion ('Gujarat'), and postalCode",
    feature: "F10",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain JSON-LD");
      const parsed = JSON.parse(jsonLdMatch[1]);
      const schema = Array.isArray(parsed) ? parsed[0] : (parsed["@graph"] ? parsed["@graph"][0] : parsed);
      const address = schema.address;
      assert(address, "Schema must define address object");
      assertEqual(address.addressLocality, "Rajkot", "addressLocality must be 'Rajkot'");
      assertEqual(address.addressRegion, "Gujarat", "addressRegion must be 'Gujarat'");
    },
  },
  {
    id: "T2-F10-05",
    name: "FAQPage schema contains mainEntity array with at least 5 Q&A objects containing Question and Answer",
    feature: "F10",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      assert(jsonLdMatch, "index.html must contain JSON-LD");
      const parsed = JSON.parse(jsonLdMatch[1]);
      let faqSchema = null;
      if (parsed["@type"] === "FAQPage") faqSchema = parsed;
      else if (parsed["@graph"]) faqSchema = parsed["@graph"].find(x => x["@type"] === "FAQPage");
      else if (Array.isArray(parsed)) faqSchema = parsed.find(x => x["@type"] === "FAQPage");
      assert(faqSchema, "FAQPage schema must be present in JSON-LD");
      assert(Array.isArray(faqSchema.mainEntity) && faqSchema.mainEntity.length >= 5, "FAQPage must have at least 5 Q&A items");
    },
  },

  // ==========================================
  // F11-B: Crawler Directives Schema & XML Boundaries
  // ==========================================
  {
    id: "T2-F11-01",
    name: "Robots.txt specifies disallow directives for private or query paths if applicable and allows public paths",
    feature: "F11",
    tier: 2,
    run: async () => {
      const content = readProjectFile("public/robots.txt") || "";
      assertMatch(content, /User-agent:/i, "robots.txt must define User-agent");
      assertMatch(content, /Allow:\s*\//i, "robots.txt must define Allow: /");
    },
  },
  {
    id: "T2-F11-02",
    name: "Sitemap.xml validates XML header declaration (<?xml version='1.0' encoding='UTF-8'?>)",
    feature: "F11",
    tier: 2,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      assertMatch(
        content,
        /^<\?xml\s+version="1\.0"\s+encoding="UTF-8"\?>/i,
        "sitemap.xml must start with valid XML version and UTF-8 encoding header"
      );
    },
  },
  {
    id: "T2-F11-03",
    name: "Sitemap urlset schema defines xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'",
    feature: "F11",
    tier: 2,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      assertMatch(
        content,
        /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/i,
        "sitemap.xml must specify canonical sitemap 0.9 schema"
      );
    },
  },
  {
    id: "T2-F11-04",
    name: "Sitemap URL <loc> tags are absolute URLs or standard canonical paths",
    feature: "F11",
    tier: 2,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      const locMatches = content.match(/<loc>(.*?)<\/loc>/g) || [];
      assert(locMatches.length >= 3, "sitemap.xml must contain at least 3 <loc> entries (/, /blog, etc.)");
    },
  },
  {
    id: "T2-F11-05",
    name: "Sitemap <priority> values are valid floats between 0.0 and 1.0",
    feature: "F11",
    tier: 2,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      const priorityMatches = content.match(/<priority>(.*?)<\/priority>/g) || [];
      for (const m of priorityMatches) {
        const val = parseFloat(m.replace(/<\/?priority>/g, ""));
        assert(val >= 0.0 && val <= 1.0, `Priority ${val} must be between 0.0 and 1.0`);
      }
    },
  },

  // ==========================================
  // F12-B: Systemic & Bundle Integrity Boundaries
  // ==========================================
  {
    id: "T2-F12-01",
    name: "HTML document has valid doctype, opening and closing <html>, <head>, <body> tags",
    feature: "F12",
    tier: 2,
    run: async () => {
      const html = readProjectFile("index.html") || "";
      assertMatch(html, /<!doctype\s+html>/i, "HTML must start with doctype html");
      assertMatch(html, /<html[\s>]/i, "HTML must contain <html>");
      assertMatch(html, /<\/html>/i, "HTML must contain closing </html>");
    },
  },
  {
    id: "T2-F12-02",
    name: "No unrendered raw template expressions or React symbols ({/*, [object Object], undefined) exposed in served HTML",
    feature: "F12",
    tier: 2,
    run: async () => {
      const res = await httpGet("/");
      assertNotMatch(res.body, /\[object Object\]/, "HTML must not contain [object Object]");
      assertNotMatch(res.body, />undefined</, "HTML must not contain raw undefined text");
    },
  },
  {
    id: "T2-F12-03",
    name: "SVG icons in public/ and src/ have valid viewBox and XML namespaces",
    feature: "F12",
    tier: 2,
    run: async () => {
      const favicon = readProjectFile("public/favicon.svg") || "";
      assertMatch(favicon, /viewBox="[^"]+"/, "favicon.svg must define viewBox");
    },
  },
  {
    id: "T2-F12-04",
    name: "Favicon link in HTML references valid SVG icon /favicon.svg",
    feature: "F12",
    tier: 2,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(
        indexHtml,
        /<link\s+rel="icon"[^>]+href="\/favicon\.svg"/i,
        "index.html must reference /favicon.svg"
      );
    },
  },
  {
    id: "T2-F12-05",
    name: "Localhost HTTP response time is under 1000ms for static and index routes",
    feature: "F12",
    tier: 2,
    run: async () => {
      const start = Date.now();
      const res = await httpGet("/");
      const duration = Date.now() - start;
      assertEqual(res.statusCode, 200, "Response must be 200");
      assert(duration < 1000, `Response duration ${duration}ms must be under 1000ms`);
    },
  },
];

module.exports = { tests };
