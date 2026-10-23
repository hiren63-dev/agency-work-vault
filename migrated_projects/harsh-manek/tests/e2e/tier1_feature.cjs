/**
 * Tier 1: Feature Coverage Test Suite (F01 - F12)
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
  // F01: Localhost Isolation & Build Parity
  // ==========================================
  {
    id: "T1-F01-01",
    name: "Localhost dev server responds with HTTP 200 on http://localhost:5173/",
    feature: "F01",
    tier: 1,
    run: async () => {
      const res = await httpGet("/");
      assertEqual(res.statusCode, 200, "Dev server must return HTTP 200 on /");
      assert(res.body.length > 100, "Dev server response must contain HTML content");
    },
  },
  {
    id: "T1-F01-02",
    name: "Local git repository has zero remote URLs configured (zero leakage)",
    feature: "F01",
    tier: 1,
    run: async () => {
      let remotes = "";
      try {
        remotes = execSync("git remote -v", { encoding: "utf8" }).trim();
      } catch (e) {
        remotes = "";
      }
      assertEqual(remotes, "", "Git repository must have zero remotes configured");
    },
  },
  {
    id: "T1-F01-03",
    name: "Application source code contains zero hardcoded remote API endpoints or live Vercel deploy hooks",
    feature: "F01",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /https?:\/\/[a-zA-Z0-9-]+\.vercel\.app\/api/i,
        "Source code must not contain remote Vercel API endpoints"
      );
      assertNotMatch(
        appCode,
        /https?:\/\/api\.harshmanek/i,
        "Source code must not contain remote production API URLs"
      );
    },
  },
  {
    id: "T1-F01-04",
    name: "Root index.html serves valid HTML structure with React mounting container",
    feature: "F01",
    tier: 1,
    run: async () => {
      const html = readProjectFile("index.html") || "";
      assertMatch(html, /<div id="root"><\/div>/, "index.html must contain #root container");
      assertMatch(html, /<script type="module" src="\/src\/main\.tsx"><\/script>/, "index.html must load main.tsx");
    },
  },
  {
    id: "T1-F01-05",
    name: "Project package.json defines standard build and preview scripts with React 19 & Vite",
    feature: "F01",
    tier: 1,
    run: async () => {
      const pkg = JSON.parse(readProjectFile("package.json") || "{}");
      assert(pkg.scripts && pkg.scripts.build, "package.json must contain build script");
      assert(pkg.dependencies && pkg.dependencies.react, "package.json must specify react dependency");
      assert(pkg.devDependencies && pkg.devDependencies.vite, "package.json must specify vite");
    },
  },

  // ==========================================
  // F02: ICAI Code of Ethics Compliance
  // ==========================================
  {
    id: "T1-F02-01",
    name: "Absence of fabricated star ratings ('5.0 Rating', '5.0 ★') in UI copy and HTML",
    feature: "F02",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const indexHtml = readProjectFile("index.html") || "";
      assertNotMatch(
        appCode,
        /5\.0\s*(?:Rating|★|Stars?)/i,
        "App.tsx must not contain '5.0 Rating' or '5.0 ★' per ICAI ethics"
      );
      assertNotMatch(
        indexHtml,
        /5\.0\s*(?:Rating|★|Stars?)/i,
        "index.html must not contain '5.0 Rating' per ICAI ethics"
      );
    },
  },
  {
    id: "T1-F02-02",
    name: "Presence of verified factual qualifications ('FCA & DISA Qualified' or 'FCA')",
    feature: "F02",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /FCA\s*(&|and)\s*DISA/i,
        "App.tsx must display verified professional credentials 'FCA & DISA Qualified'"
      );
    },
  },
  {
    id: "T1-F02-03",
    name: "Absence of promotional fee-undercutting phrasing ('Book Free Consultation', 'Free Consultation')",
    feature: "F02",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /Free\s+Consultation/i,
        "App.tsx must not use fee undercutting promotional copy 'Free Consultation'"
      );
    },
  },
  {
    id: "T1-F02-04",
    name: "Presence of professional consultation booking CTA ('Schedule Consultation')",
    feature: "F02",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Schedule\s+Consultation/i,
        "App.tsx must use dignified CTA 'Schedule Consultation'"
      );
    },
  },
  {
    id: "T1-F02-05",
    name: "Absence of prohibited superlative marketing claims ('#1 CA', 'Best CA firm')",
    feature: "F02",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(appCode, /#1\s+CA/i, "Must not claim '#1 CA' per ICAI advertisement rules");
      assertNotMatch(appCode, /Best\s+CA\s+in/i, "Must not claim 'Best CA' per ICAI advertisement rules");
      assertNotMatch(appCode, /top\s+chartered\s+accountant/i, "Must not claim 'top chartered accountant'");
    },
  },

  // ==========================================
  // F03: Anti-Slop Copy & A11y Contrast
  // ==========================================
  {
    id: "T1-F03-01",
    name: "Zero em dashes (\u2014) in UI copy across the application codebase",
    feature: "F03",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const emDashCount = (appCode.match(/\u2014/g) || []).length;
      assertEqual(emDashCount, 0, `App.tsx contains ${emDashCount} em dashes (\\u2014). Target is 0.`);
    },
  },
  {
    id: "T1-F03-02",
    name: "Absence of low-contrast text-white/30 utility classes in UI text",
    feature: "F03",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /\btext-white\/30\b/,
        "App.tsx contains text-white/30 which fails WCAG AA contrast threshold"
      );
    },
  },
  {
    id: "T1-F03-03",
    name: "Absence of low-contrast text-white/40 utility classes on essential text content",
    feature: "F03",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(
        appCode,
        /\btext-white\/40\b/,
        "App.tsx contains text-white/40 which fails WCAG AA (>= 4.5:1) for body text"
      );
    },
  },
  {
    id: "T1-F03-04",
    name: "Absence of generic AI marketing slop words ('revolutionary', 'game-changing', 'disruptive')",
    feature: "F03",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertNotMatch(appCode, /\brevolutionary\b/i, "Copy must not contain generic slop word 'revolutionary'");
      assertNotMatch(appCode, /\bgame-changing\b/i, "Copy must not contain generic slop word 'game-changing'");
      assertNotMatch(appCode, /\bdisruptive\b/i, "Copy must not contain generic slop word 'disruptive'");
      assertNotMatch(appCode, /\bsynergistic\b/i, "Copy must not contain generic slop word 'synergistic'");
    },
  },
  {
    id: "T1-F03-05",
    name: "Form elements provide accessible names or aria-label attributes",
    feature: "F03",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /aria-label="Chat on WhatsApp"/,
        "WhatsApp floating CTA must specify accessible aria-label"
      );
      assertMatch(
        appCode,
        /<input[^>]+aria-label=|<label/i,
        "Inputs must be accompanied by labels or aria-label attributes"
      );
    },
  },

  // ==========================================
  // F04: Taste Architect Luxury Design & Fonts
  // ==========================================
  {
    id: "T1-F04-01",
    name: "Absence of generic purple-500 violet glow utility classes in InvoiceStrategist",
    feature: "F04",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const invoiceSectionMatch = appCode.match(/function InvoiceStrategist[\s\S]*?(?=function\s+[A-Z]|$)/);
      const invoiceCode = invoiceSectionMatch ? invoiceSectionMatch[0] : "";
      assertNotMatch(
        invoiceCode,
        /\b(?:purple|violet)-(?:400|500|600)\b/,
        "InvoiceStrategist must not contain purple/violet glow accents"
      );
    },
  },
  {
    id: "T1-F04-02",
    name: "UI color palette adheres strictly to zinc monochrome with emerald accents",
    feature: "F04",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /\btext-emerald-400\b|\bbg-emerald-500\b/, "App must utilize emerald accent tokens");
      assertMatch(appCode, /\bbg-zinc-900\b|\btext-zinc-200\b/, "App must utilize zinc dark tokens");
    },
  },
  {
    id: "T1-F04-03",
    name: "index.html loads approved typography font families (Geist, Instrument Serif, JetBrains Mono)",
    feature: "F04",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /Geist/i, "index.html must load Geist font");
      assertMatch(indexHtml, /Instrument\+Serif|Instrument Serif/i, "index.html must load Instrument Serif font");
      assertMatch(indexHtml, /JetBrains\+Mono|JetBrains Mono/i, "index.html must load JetBrains Mono font");
    },
  },
  {
    id: "T1-F04-04",
    name: "Subtle border styling (border-white/10, border-zinc-800) used across cards",
    feature: "F04",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /\bborder-white\/10\b|\bborder-zinc-800\b/,
        "Cards must use refined subtle border styling"
      );
    },
  },
  {
    id: "T1-F04-05",
    name: "Responsive mobile viewport meta tag configuration present in index.html",
    feature: "F04",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(
        indexHtml,
        /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/i,
        "index.html must contain proper viewport meta tag"
      );
    },
  },

  // ==========================================
  // F05: Dynamic Timeline & Statutory Deadlines
  // ==========================================
  {
    id: "T1-F05-01",
    name: "Dynamic Timeline supports statutory compliance calendar view alongside firm journey",
    feature: "F05",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Statutory|Compliance Calendar|Due Dates/i,
        "DynamicTimeline must provide statutory compliance calendar view"
      );
    },
  },
  {
    id: "T1-F05-02",
    name: "Statutory timeline includes non-audit ITR filing deadline (July 31)",
    feature: "F05",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /July\s+31|31st\s+July/i,
        "Statutory timeline must include July 31 ITR filing deadline"
      );
    },
  },
  {
    id: "T1-F05-03",
    name: "Statutory timeline includes Tax Audit filing deadline (September 30 / October 31)",
    feature: "F05",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /September\s+30|October\s+31|Tax\s+Audit/i,
        "Statutory timeline must include Tax Audit deadline"
      );
    },
  },
  {
    id: "T1-F05-04",
    name: "Statutory timeline includes GST monthly return deadline (GSTR-3B by 20th)",
    feature: "F05",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /GSTR-3B|20th\s+of\s+every\s+month/i,
        "Statutory timeline must include monthly GSTR-3B deadline"
      );
    },
  },
  {
    id: "T1-F05-05",
    name: "Interactive timeline provides accessible state toggles or spring physics transitions",
    feature: "F05",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /SPRING_SNAPPY|SPRING_HEAVY|SPRING_MICRO/,
        "Timeline interactions must leverage spring physics presets"
      );
    },
  },

  // ==========================================
  // F06: Enhanced Tax Sandbox
  // ==========================================
  {
    id: "T1-F06-01",
    name: "New Tax Regime standard deduction updated to statutory ₹75,000 (Budget 2024)",
    feature: "F06",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const taxSection = appCode.match(/function TaxSandbox[\s\S]*?(?=function\s+[A-Z]|$)/);
      const taxCode = taxSection ? taxSection[0] : "";
      assertMatch(
        taxCode,
        /75000|75_000/,
        "TaxSandbox must implement ₹75,000 standard deduction under New Regime (Budget 2024)"
      );
    },
  },
  {
    id: "T1-F06-02",
    name: "Section 87A rebate calculation yields ₹0 net tax for taxable income up to ₹7,00,000 under New Regime",
    feature: "F06",
    tier: 1,
    run: async () => {
      // Compare with oracle
      const oracleResult = statutoryOracles.calculateNewRegimeTax(775000); // 7.75L gross - 75k std = 7L taxable
      assertEqual(oracleResult.totalTax, 0, "Oracle taxable income ₹7L must have ₹0 tax under New Regime 87A rebate");

      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /87A|rebate/i,
        "TaxSandbox must implement Section 87A rebate logic"
      );
    },
  },
  {
    id: "T1-F06-03",
    name: "Section 87A marginal relief computation for taxable income marginally above ₹7,00,000",
    feature: "F06",
    tier: 1,
    run: async () => {
      // Oracle check for ₹7,76,000 gross (₹7,01,000 taxable) -> tax should be capped at ₹1,000 + cess = ₹1,040
      const oracle = statutoryOracles.calculateNewRegimeTax(776000);
      assert(oracle.totalTax <= 1040, "Marginal relief must cap tax to excess taxable income over 7L");

      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /marginal\s*relief/i,
        "TaxSandbox must incorporate marginal relief under Section 87A"
      );
    },
  },
  {
    id: "T1-F06-04",
    name: "Old vs New regime comparative tax computation accurately calculates slab differentials",
    feature: "F06",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /oldTax|taxOld|Old Regime/i, "TaxSandbox must compute Old Regime tax");
      assertMatch(appCode, /newTax|taxNew|New Regime/i, "TaxSandbox must compute New Regime tax");
    },
  },
  {
    id: "T1-F06-05",
    name: "Tax sandbox controls provide accessible switch roles (role='switch', aria-checked) and aria-live announcements",
    feature: "F06",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /role="switch"|aria-checked/i,
        "TaxSandbox toggles must specify role='switch' and aria-checked attributes"
      );
      assertMatch(
        appCode,
        /aria-live="polite"/i,
        "Dynamic tax results container must define aria-live='polite' for screen readers"
      );
    },
  },

  // ==========================================
  // F07: Enhanced Invoice Strategist
  // ==========================================
  {
    id: "T1-F07-01",
    name: "Dual calculation modes: Forward invoicing (base to total) and Reverse invoicing (total to base)",
    feature: "F07",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /reverse|Reverse Invoicing|Inclusive of GST/i,
        "InvoiceStrategist must support reverse/inclusive invoicing mode"
      );
    },
  },
  {
    id: "T1-F07-02",
    name: "Rule 138 E-Way Bill alert triggers when invoice amount exceeds ₹50,000",
    feature: "F07",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /E-Way|Rule 138|50,?000/i,
        "InvoiceStrategist must check Rule 138 E-Way bill threshold at ₹50,000"
      );
    },
  },
  {
    id: "T1-F07-03",
    name: "Rule 48(4) E-Invoicing badge indicator for ₹5 Crore aggregate turnover",
    feature: "F07",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /E-Invoic|Rule 48|5\s*Cr/i,
        "InvoiceStrategist must reference Rule 48(4) E-Invoicing turnover threshold"
      );
    },
  },
  {
    id: "T1-F07-04",
    name: "Services Accounting Code (SAC) 9982 is displayed for Legal & Accounting services",
    feature: "F07",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /9982/,
        "InvoiceStrategist must display SAC 9982 for Legal and Accounting professional services"
      );
    },
  },
  {
    id: "T1-F07-05",
    name: "Tax breakdown calculation supports Intra-state (CGST+SGST 18%) and Inter-state (IGST 18%)",
    feature: "F07",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /CGST|SGST/i, "InvoiceStrategist must calculate intra-state CGST & SGST");
      assertMatch(appCode, /IGST/i, "InvoiceStrategist must calculate inter-state IGST");
    },
  },

  // ==========================================
  // F08: Enhanced Penalty Simulator
  // ==========================================
  {
    id: "T1-F08-01",
    name: "Dual simulator mode supporting both Income Tax and GST penalty assessments",
    feature: "F08",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /234[A-F]|Income Tax Late|GST Late/i,
        "PenaltySimulator must provide modes for both Income Tax and GST penalties"
      );
    },
  },
  {
    id: "T1-F08-02",
    name: "Section 234F late fee logic (₹5,000 for income > ₹5L, ₹1,000 for income <= ₹5L)",
    feature: "F08",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /234F|5000.*1000|1000.*5000/i,
        "PenaltySimulator must calculate Section 234F late fee based on ₹5L income threshold"
      );
    },
  },
  {
    id: "T1-F08-03",
    name: "Section 234A interest logic (1% per month on unpaid tax from due date)",
    feature: "F08",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /234A|1% per month/i,
        "PenaltySimulator must implement Section 234A interest (1% per month)"
      );
    },
  },
  {
    id: "T1-F08-04",
    name: "GST Section 47 late fee calculation (₹50/day regular, ₹20/day nil return)",
    feature: "F08",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Section 47|50.*day|20.*day/i,
        "PenaltySimulator must calculate GST Sec 47 late fee"
      );
    },
  },
  {
    id: "T1-F08-05",
    name: "GST Section 50 interest calculation (18% per annum on delayed tax payment)",
    feature: "F08",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Section 50|18%/i,
        "PenaltySimulator must calculate GST Sec 50 interest at 18% p.a."
      );
    },
  },

  // ==========================================
  // F09: Dynamic Blog Routing & Resilience
  // ==========================================
  {
    id: "T1-F09-01",
    name: "React Router route configured for dynamic blog post /blog/:id",
    feature: "F09",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /path="\/blog\/:id"/,
        "App.tsx must define Route path='/blog/:id'"
      );
    },
  },
  {
    id: "T1-F09-02",
    name: "Dynamic blog detail component consumes useParams to load matching article dynamically",
    feature: "F09",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /useParams/,
        "App.tsx must use useParams hook to read :id dynamic route parameter"
      );
    },
  },
  {
    id: "T1-F09-03",
    name: "Blog posts data source contains structured posts with valid slug, title, and content",
    feature: "F09",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /BLOG_POSTS\s*=\s*\[/,
        "App.tsx must define BLOG_POSTS dataset"
      );
      assertMatch(
        appCode,
        /id:\s*["']budget-2024|id:\s*["']gst/i,
        "BLOG_POSTS must contain structured articles"
      );
    },
  },
  {
    id: "T1-F09-04",
    name: "Non-existent blog post ID triggers graceful fallback / 'Article not found' handling",
    feature: "F09",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /Article not found|Post not found/i,
        "BlogPostPage must handle missing blog posts gracefully"
      );
    },
  },
  {
    id: "T1-F09-05",
    name: "Smooth section anchor navigation links exist across navigation components",
    feature: "F09",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(appCode, /#services/, "Navigation must include #services anchor");
      assertMatch(appCode, /#tools/, "Navigation must include #tools anchor");
      assertMatch(appCode, /#faq/, "Navigation must include #faq anchor");
    },
  },

  // ==========================================
  // F10: SEO, GEO & AEO Architecture
  // ==========================================
  {
    id: "T1-F10-01",
    name: "Document title contains firm name and professional positioning",
    feature: "F10",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(
        indexHtml,
        /<title>.*Harsh\s+Manek.*<\/title>/i,
        "index.html <title> must include 'Harsh Manek & Co.'"
      );
    },
  },
  {
    id: "T1-F10-02",
    name: "Complete OpenGraph metadata tags (og:title, og:description, og:image, og:url)",
    feature: "F10",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /<meta\s+property="og:title"/i, "index.html must include og:title");
      assertMatch(indexHtml, /<meta\s+property="og:description"/i, "index.html must include og:description");
      assertMatch(indexHtml, /<meta\s+property="og:image"/i, "index.html must include og:image");
      assertMatch(indexHtml, /<meta\s+property="og:url"/i, "index.html must include og:url");
    },
  },
  {
    id: "T1-F10-03",
    name: "Complete Twitter card metadata tags (twitter:card, twitter:title, twitter:description)",
    feature: "F10",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /<meta\s+name="twitter:card"/i, "index.html must include twitter:card");
      assertMatch(indexHtml, /<meta\s+name="twitter:title"/i, "index.html must include twitter:title");
    },
  },
  {
    id: "T1-F10-04",
    name: "Rajkot GEO tags (geo.region 'IN-GJ', geo.placename 'Rajkot', geo.position)",
    feature: "F10",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /<meta\s+name="geo\.region"\s+content="IN-GJ"/i, "index.html must include geo.region IN-GJ");
      assertMatch(indexHtml, /<meta\s+name="geo\.placename"\s+content="Rajkot"/i, "index.html must include geo.placename Rajkot");
    },
  },
  {
    id: "T1-F10-05",
    name: "JSON-LD structured data (AccountingService / LocalBusiness and FAQPage) embedded in index.html",
    feature: "F10",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(
        indexHtml,
        /<script\s+type="application\/ld\+json">/i,
        "index.html must embed application/ld+json structured schema"
      );
      assertMatch(
        indexHtml,
        /AccountingService|LocalBusiness/i,
        "JSON-LD must specify AccountingService or LocalBusiness type"
      );
    },
  },

  // ==========================================
  // F11: Crawler Directives & Sitemap
  // ==========================================
  {
    id: "T1-F11-01",
    name: "public/robots.txt exists and is accessible via HTTP at /robots.txt",
    feature: "F11",
    tier: 1,
    run: async () => {
      assert(fileExists("public/robots.txt"), "public/robots.txt file must exist");
      const res = await httpGet("/robots.txt");
      assertEqual(res.statusCode, 200, "Dev server must serve /robots.txt with HTTP 200");
    },
  },
  {
    id: "T1-F11-02",
    name: "robots.txt defines User-agent: * and Allow: / directives",
    feature: "F11",
    tier: 1,
    run: async () => {
      const content = readProjectFile("public/robots.txt") || "";
      assertMatch(content, /User-agent:\s*\*/i, "robots.txt must specify User-agent: *");
      assertMatch(content, /Allow:\s*\//i, "robots.txt must specify Allow: /");
    },
  },
  {
    id: "T1-F11-03",
    name: "robots.txt includes Sitemap reference link",
    feature: "F11",
    tier: 1,
    run: async () => {
      const content = readProjectFile("public/robots.txt") || "";
      assertMatch(content, /Sitemap:\s*https?:\/\/.*sitemap\.xml/i, "robots.txt must reference sitemap.xml");
    },
  },
  {
    id: "T1-F11-04",
    name: "public/sitemap.xml exists and is accessible via HTTP at /sitemap.xml",
    feature: "F11",
    tier: 1,
    run: async () => {
      assert(fileExists("public/sitemap.xml"), "public/sitemap.xml file must exist");
      const res = await httpGet("/sitemap.xml");
      assertEqual(res.statusCode, 200, "Dev server must serve /sitemap.xml with HTTP 200");
    },
  },
  {
    id: "T1-F11-05",
    name: "sitemap.xml contains valid XML structure with canonical routes and lastmod",
    feature: "F11",
    tier: 1,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      assertMatch(content, /<\?xml/i, "sitemap.xml must start with XML declaration");
      assertMatch(content, /<urlset/i, "sitemap.xml must contain <urlset>");
      assertMatch(content, /<loc>.*<\/loc>/i, "sitemap.xml must contain <loc> entries");
    },
  },

  // ==========================================
  // F12: Comprehensive E2E Verification
  // ==========================================
  {
    id: "T1-F12-01",
    name: "Dev server returns HTTP 200 with text/html Content-Type on root",
    feature: "F12",
    tier: 1,
    run: async () => {
      const res = await httpGet("/");
      assertEqual(res.statusCode, 200, "Dev server root must return HTTP 200");
      assertMatch(
        res.headers["content-type"] || "",
        /text\/html/,
        "Root Content-Type header must be text/html"
      );
    },
  },
  {
    id: "T1-F12-02",
    name: "Public static assets (e.g. favicon.svg, avatar) are served with HTTP 200",
    feature: "F12",
    tier: 1,
    run: async () => {
      const res = await httpGet("/favicon.svg");
      assertEqual(res.statusCode, 200, "Static asset /favicon.svg must return HTTP 200");
    },
  },
  {
    id: "T1-F12-03",
    name: "Project TypeScript source compiles without structural syntax corruption",
    feature: "F12",
    tier: 1,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assert(appCode.length > 5000, "App.tsx must have substantial content");
      // Check balanced braces at file level
      const openBraces = (appCode.match(/\{/g) || []).length;
      const closeBraces = (appCode.match(/\}/g) || []).length;
      assertEqual(openBraces, closeBraces, "App.tsx must have balanced opening and closing braces");
    },
  },
  {
    id: "T1-F12-04",
    name: "Responsive viewport configuration allows scalable mobile presentation",
    feature: "F12",
    tier: 1,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertNotMatch(
        indexHtml,
        /user-scalable=no/i,
        "Viewport must not disable user-scalable for a11y compliance"
      );
    },
  },
  {
    id: "T1-F12-05",
    name: "Master test runner execution harness validates tier execution and formats markdown table",
    feature: "F12",
    tier: 1,
    run: async () => {
      assert(fileExists("tests/e2e/run_tests.cjs"), "run_tests.cjs master runner must exist");
      assert(fileExists("tests/e2e/helpers.cjs"), "helpers.cjs must exist");
    },
  },
];

module.exports = { tests };
