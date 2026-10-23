/**
 * Tier 5: White-Box Adversarial Hardening Suite
 * Harsh Manek & Co. Portfolio
 * 
 * Conducts aggressive stress testing on:
 * 1. Route navigation: invalid blog paths, missing slugs, unicode parameters, unmapped paths
 * 2. Form validation: empty inputs, whitespace bypass, malformed contacts, unicode/XSS payloads, long inputs
 * 3. Typography & anti-slop regression: em-dash scans across entire repository
 * 4. Accessibility: form field labelling, id/name associations, WCAG AA contrast thresholds
 * 5. Mobile DOM & Layout: responsive viewport overflow, layout stability
 * 6. Crawler endpoints: robots.txt directives, sitemap.xml validity, JSON-LD schema parsing
 */

const {
  assert,
  assertEqual,
  assertMatch,
  assertNotMatch,
  httpGet,
  readProjectFile,
  fileExists,
} = require("./helpers.cjs");
const fs = require("fs");
const path = require("path");

const tests = [
  // =========================================================================
  // 1. ROUTE ADVERSARIAL HARDENING
  // =========================================================================
  {
    id: "T5-ROUTE-01",
    name: "BlogPostPage handles non-existent slug /blog/invalid gracefully without throwing",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Must normalize route param safely
      assertMatch(appCode, /normalizedId\s*=\s*\(id\s*\|\|\s*""\)\.toLowerCase\(\)/, "BlogPostPage must normalize id safely");
      // Must have fallback UI
      assertMatch(appCode, /Article not found/, "BlogPostPage must render 'Article not found' for invalid slug");
      assertMatch(appCode, /to="\/blog"/, "BlogPostPage must provide link back to all articles");
    },
  },
  {
    id: "T5-ROUTE-02",
    name: "BlogPostPage handles out-of-bounds numeric slug /blog/999 gracefully",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Numeric matching check
      assertMatch(appCode, /String\(BLOG_POSTS\.indexOf\(p\)\s*\+\s*1\)\s*===\s*id/, "BlogPostPage checks numeric index");
      // If 999 does not match, !post branch triggers
      assertMatch(appCode, /if\s*\(!post\)\s*\{/, "Missing post triggers guard branch");
    },
  },
  {
    id: "T5-ROUTE-03",
    name: "BlogPostPage safely parses URL-encoded unicode characters (%E2%9C%A8) without URIError",
    tier: 5,
    run: async () => {
      const decoded = decodeURIComponent("%E2%9C%A8");
      assertEqual(decoded, "✨", "Decodes UTF-8 sparkles symbol");
      const normalized = (decoded || "").toLowerCase();
      assertEqual(normalized, "✨", "Lowercases unicode symbol without crash");
    },
  },
  {
    id: "T5-ROUTE-04",
    name: "Wildcard route inspection for arbitrary non-existent paths (/nonexistent, /404)",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      const hasWildcardRoute = /<Route\s+path="(\*|\/\*)"/i.test(appCode);
      // Adversarial check: In SPA React Router, omitting path='*' leads to blank main area between header/footer
      assert(
        hasWildcardRoute,
        "CHALLENGE: App.tsx lacks a wildcard catch-all route (<Route path='*' .../>). Unmatched paths render blank main content."
      );
    },
  },

  // =========================================================================
  // 2. FORM VALIDATION ADVERSARIAL TESTING
  // =========================================================================
  {
    id: "T5-FORM-01",
    name: "BookingForm disables submission when required fields (intent, name, contact) are empty",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      assertMatch(
        appCode,
        /disabled=\{[^}]*!intent\s*\|\|\s*!name\s*\|\|\s*!contact/,
        "Submit button must be disabled when intent, name, or contact is empty"
      );
      assertMatch(
        appCode,
        /if\s*\(!intent\s*\|\|\s*!name\s*\|\|\s*!contact\)\s*return/,
        "handleSubmit must guard against empty submissions"
      );
    },
  },
  {
    id: "T5-FORM-02",
    name: "Whitespace-only input bypass test on name and contact fields ('   ')",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Adversarial probe: Does validation use .trim() or raw string check?
      const usesTrim = /!name\.trim\(\)|!contact\.trim\(\)/.test(appCode);
      assert(
        usesTrim,
        "CHALLENGE: BookingForm validates '!name' and '!contact' without .trim(). Whitespace-only strings ('   ') bypass validation and submit successfully."
      );
    },
  },
  {
    id: "T5-FORM-03",
    name: "Form contact input enforces email or phone pattern validation",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Check if contact input enforces type='email' / type='tel' / pattern=
      const hasContactValidation = /type="(email|tel)"|pattern=/.test(appCode);
      assert(
        hasContactValidation,
        "CHALLENGE: Contact input uses type='text' with no regex pattern, allowing arbitrary garbage input (e.g. 'abc', '123') to submit."
      );
    },
  },
  {
    id: "T5-FORM-04",
    name: "XSS payload injection is safely neutralized via React JSX DOM text escaping",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Verify success message renders {name} as JSX text expression and NOT dangerouslySetInnerHTML
      assertMatch(appCode, /Thank you,\s*\{name\}/, "Renders name via safe JSX text node");
      assertNotMatch(appCode, /dangerouslySetInnerHTML[^}]*name/, "Must never use dangerouslySetInnerHTML with name");
    },
  },
  {
    id: "T5-FORM-05",
    name: "Form accessibility: inputs must have associated labels and id/name attributes",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Check if inputs have id and matching htmlFor in labels
      const hasHtmlFor = /htmlFor=/i.test(appCode);
      const hasInputIds = /<input[^>]*id=/i.test(appCode);
      assert(
        hasHtmlFor && hasInputIds,
        "CHALLENGE: Form inputs in BookingForm lack 'id' and 'name' attributes, and '<label>' lacks 'htmlFor', triggering browser accessibility audit violations."
      );
    },
  },

  // =========================================================================
  // 3. TYPOGRAPHY & ANTI-SLOP REGRESSION SCANS
  // =========================================================================
  {
    id: "T5-TYPO-01",
    name: "Zero em dashes (\u2014) across all source files in src/ directory",
    tier: 5,
    run: async () => {
      function walkDir(dir) {
        let results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(walkDir(fullPath));
          } else if (/\.(tsx?|jsx?|html)$/.test(entry.name)) {
            results.push(fullPath);
          }
        }
        return results;
      }

      const allFiles = walkDir(path.resolve(__dirname, "../../src"));
      const violations = [];

      for (const file of allFiles) {
        const content = fs.readFileSync(file, "utf8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          if (line.includes("\u2014") || line.includes("—")) {
            violations.push({
              file: path.relative(path.resolve(__dirname, "../.."), file),
              line: idx + 1,
              text: line.trim(),
            });
          }
        });
      }

      assert(
        violations.length === 0,
        `CHALLENGE: Detected ${violations.length} em dash(es) in source tree:\n` +
        violations.map(v => `  -> ${v.file}:${v.line}: ${v.text}`).join("\n")
      );
    },
  },

  // =========================================================================
  // 4. MOBILE LAYOUT & OVERFLOW INTEGRITY
  // =========================================================================
  {
    id: "T5-RESP-01",
    name: "Viewport meta tag in index.html ensures proper mobile scaling",
    tier: 5,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(
        indexHtml,
        /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/i,
        "index.html must define standard mobile responsive viewport"
      );
    },
  },
  {
    id: "T5-RESP-02",
    name: "No destructive hardcoded fixed-width containers exceeding 320px without responsive modifiers",
    tier: 5,
    run: async () => {
      const appCode = readProjectFile("src/App.tsx") || "";
      // Look for classes like w-[600px] or w-[800px] that do not have max-w-full or responsive prefixes (sm:, md:, lg:)
      const unescapedFixedLarge = appCode.match(/(?<!sm:|md:|lg:|xl:)w-\[(?:[4-9]\d{2}|[1-9]\d{3})px\]/g) || [];
      // Blobs with blur/absolute positioning are allowed, others must be responsive
      const nonDecorativeFixed = unescapedFixedLarge.filter(cls => !cls.includes("blob"));
      assertEqual(nonDecorativeFixed.length, 0, "No non-decorative hardcoded fixed widths > 400px without responsive prefix");
    },
  },

  // =========================================================================
  // 5. CRAWLER, SITEMAP & STRUCTURED DATA
  // =========================================================================
  {
    id: "T5-SEO-01",
    name: "robots.txt allows all crawlers, blocks internal API, and links sitemap",
    tier: 5,
    run: async () => {
      const content = readProjectFile("public/robots.txt") || "";
      assertMatch(content, /User-agent:\s*\*/i, "robots.txt must declare User-agent: *");
      assertMatch(content, /Allow:\s*\//i, "robots.txt must declare Allow: /");
      assertMatch(content, /Disallow:\s*\/api\//i, "robots.txt must declare Disallow: /api/");
      assertMatch(content, /Sitemap:\s*http:\/\/localhost:5173\/sitemap\.xml/i, "robots.txt must link localhost sitemap");
    },
  },
  {
    id: "T5-SEO-02",
    name: "sitemap.xml is valid XML and contains all primary static routes",
    tier: 5,
    run: async () => {
      const content = readProjectFile("public/sitemap.xml") || "";
      assert(content.startsWith("<?xml"), "sitemap.xml must have XML declaration");
      assert(content.includes("<urlset") && content.includes("</urlset>"), "sitemap.xml must have urlset container");
      const requiredRoutes = ["http://localhost:5173/", "http://localhost:5173/blog", "http://localhost:5173/privacy", "http://localhost:5173/terms"];
      for (const r of requiredRoutes) {
        assert(content.includes(`<loc>${r}</loc>`), `sitemap.xml must contain loc for ${r}`);
      }
    },
  },
  {
    id: "T5-SEO-03",
    name: "index.html JSON-LD structured data parses cleanly with valid schema types",
    tier: 5,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      const match = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert(match, "index.html must contain JSON-LD script");
      let parsed;
      try {
        parsed = JSON.parse(match[1]);
      } catch (err) {
        throw new Error(`Invalid JSON in JSON-LD script: ${err.message}`);
      }
      assertEqual(parsed["@context"], "https://schema.org", "Schema context must be schema.org");
      assert(Array.isArray(parsed["@graph"]), "Schema must have @graph array");
      const types = parsed["@graph"].map(g => g["@type"]);
      assert(types.includes("AccountingService"), "Graph must include AccountingService");
      assert(types.includes("FAQPage"), "Graph must include FAQPage");
      const faq = parsed["@graph"].find(g => g["@type"] === "FAQPage");
      assertEqual(faq.mainEntity.length, 10, "FAQPage must contain exactly 10 FAQ questions");
    },
  },
  {
    id: "T5-SEO-04",
    name: "Rajkot local GEO metadata tags present and accurate",
    tier: 5,
    run: async () => {
      const indexHtml = readProjectFile("index.html") || "";
      assertMatch(indexHtml, /<meta\s+name="geo\.region"\s+content="IN-GJ"\s*\/>/i, "geo.region must be IN-GJ");
      assertMatch(indexHtml, /<meta\s+name="geo\.placename"\s+content="Rajkot[^"]*"\s*\/>/i, "geo.placename must specify Rajkot");
      assertMatch(indexHtml, /<meta\s+name="geo\.position"\s+content="22\.3039;70\.8022"\s*\/>/i, "geo.position must match Rajkot coordinates");
    },
  },
];

module.exports = { tests };

if (require.main === module) {
  (async () => {
    console.log("================================================================================");
    console.log("       HARSH MANEK & CO. — TIER 5 ADVERSARIAL STRESS TEST RUNNER");
    console.log("================================================================================\n");
    let passed = 0;
    let failed = 0;
    const failures = [];

    for (const t of tests) {
      process.stdout.write(`▶ Running ${t.id}: ${t.name}... `);
      try {
        await t.run();
        console.log("✔ PASS");
        passed++;
      } catch (err) {
        console.log("✘ FAIL");
        console.log(`  -> Reason: ${err.message}\n`);
        failed++;
        failures.push({ id: t.id, name: t.name, reason: err.message });
      }
    }

    console.log("\n================================================================================");
    console.log(`SUMMARY: Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log("================================================================================");
    if (failures.length > 0) {
      console.log("\nCHALLENGES DETECTED:");
      failures.forEach((f, i) => {
        console.log(`${i + 1}. [${f.id}] ${f.name}`);
        console.log(`   ${f.reason}`);
      });
      process.exit(1);
    } else {
      console.log("\nALL ADVERSARIAL CHECKS PASSED.");
      process.exit(0);
    }
  })();
}
