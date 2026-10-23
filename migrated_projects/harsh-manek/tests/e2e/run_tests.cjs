#!/usr/bin/env node
/**
 * Master E2E Automated Test Runner
 * Harsh Manek & Co. Portfolio
 *
 * Usage:
 *   node tests/e2e/run_tests.cjs
 *   cmd /c "node tests/e2e/run_tests.cjs"
 */

const path = require("path");
const fs = require("fs");

const { tests: tier1Tests } = require("./tier1_feature.cjs");
const { tests: tier2Tests } = require("./tier2_boundary.cjs");
const { tests: tier3Tests } = require("./tier3_pairwise.cjs");
const { tests: tier4Tests } = require("./tier4_scenarios.cjs");

const isVerbose = process.argv.includes("--verbose") || process.argv.includes("-v");
const isSummaryOnly = process.argv.includes("--summary-only");
const allowTddFailures = process.argv.includes("--allow-tdd-failures");
const isJson = process.argv.includes("--json");

async function runTestSuite() {
  const startTime = Date.now();
  console.log("\n================================================================================");
  console.log("       HARSH MANEK & CO. — E2E OPAQUE-BOX AUTOMATED TEST HARNESS");
  console.log("================================================================================");
  console.log(`Environment: Localhost (http://localhost:5173/) | Total Test Cases: ${tier1Tests.length + tier2Tests.length + tier3Tests.length + tier4Tests.length}`);
  console.log("--------------------------------------------------------------------------------\n");

  const suites = [
    { name: "Tier 1: Feature Coverage (F01–F12)", tier: 1, tests: tier1Tests },
    { name: "Tier 2: Boundary & Corner Cases (F01–F12)", tier: 2, tests: tier2Tests },
    { name: "Tier 3: Pairwise Combinations", tier: 3, tests: tier3Tests },
    { name: "Tier 4: Real-World Application Scenarios", tier: 4, tests: tier4Tests },
  ];

  const results = {
    tier1: { total: 0, passed: 0, failed: 0, failures: [] },
    tier2: { total: 0, passed: 0, failed: 0, failures: [] },
    tier3: { total: 0, passed: 0, failed: 0, failures: [] },
    tier4: { total: 0, passed: 0, failed: 0, failures: [] },
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
  };

  for (const suite of suites) {
    console.log(`\n▶ Running ${suite.name} (${suite.tests.length} test cases)...`);
    const tierKey = `tier${suite.tier}`;

    for (const test of suite.tests) {
      results[tierKey].total++;
      results.total++;

      const testStart = Date.now();
      let testPassed = false;
      let errorMsg = null;

      try {
        await test.run();
        testPassed = true;
      } catch (err) {
        testPassed = false;
        errorMsg = err.message || String(err);
      }

      const duration = Date.now() - testStart;

      if (testPassed) {
        results[tierKey].passed++;
        results.passed++;
        if (isVerbose) {
          console.log(`  [PASS] ${test.id}: ${test.name} (${duration}ms)`);
        }
      } else {
        results[tierKey].failed++;
        results.failed++;
        const failureRecord = {
          id: test.id,
          name: test.name,
          tier: suite.tier,
          feature: test.feature || (test.features ? test.features.join("+") : "General"),
          error: errorMsg,
          duration,
        };
        results[tierKey].failures.push(failureRecord);
        results.failures.push(failureRecord);
        if (!isSummaryOnly) {
          console.log(`  [FAIL] ${test.id}: ${test.name}`);
          console.log(`         -> ${errorMsg}`);
        }
      }
    }

    const tierPassed = results[tierKey].passed;
    const tierTotal = results[tierKey].total;
    const tierRate = ((tierPassed / tierTotal) * 100).toFixed(1);
    console.log(`✔ Finished ${suite.name}: ${tierPassed}/${tierTotal} passed (${tierRate}%)\n`);
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Markdown Summary Table
  console.log("\n================================================================================");
  console.log("                           EXECUTION SUMMARY REPORT");
  console.log("================================================================================\n");

  const rows = [
    {
      tier: "Tier 1",
      desc: "Feature Coverage (F01–F12)",
      total: results.tier1.total,
      passed: results.tier1.passed,
      failed: results.tier1.failed,
    },
    {
      tier: "Tier 2",
      desc: "Boundary & Corner Cases (F01–F12)",
      total: results.tier2.total,
      passed: results.tier2.passed,
      failed: results.tier2.failed,
    },
    {
      tier: "Tier 3",
      desc: "Pairwise Combinations",
      total: results.tier3.total,
      passed: results.tier3.passed,
      failed: results.tier3.failed,
    },
    {
      tier: "Tier 4",
      desc: "Real-World Application Scenarios",
      total: results.tier4.total,
      passed: results.tier4.passed,
      failed: results.tier4.failed,
    },
  ];

  console.log("| Tier | Description | Total | Passed | Failed | Pass Rate | Status |");
  console.log("|---|---|:---:|:---:|:---:|:---:|:---:|");

  for (const r of rows) {
    const rate = ((r.passed / r.total) * 100).toFixed(1);
    const status = r.failed === 0 ? "PASSED" : "PENDING_FIX";
    console.log(
      `| ${r.tier} | ${r.desc} | ${r.total} | ${r.passed} | ${r.failed} | ${rate}% | ${status} |`
    );
  }

  const overallRate = ((results.passed / results.total) * 100).toFixed(1);
  const overallStatus = results.failed === 0 ? "ALL PASSED" : "FAILURES DETECTED";
  console.log(
    `| **Total** | **All Verification Tiers** | **${results.total}** | **${results.passed}** | **${results.failed}** | **${overallRate}%** | **${overallStatus}** |`
  );

  console.log(`\nExecution time: ${totalDuration}s | Total Tests: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed}`);

  if (results.failed > 0) {
    console.log(`\nNote: ${results.failed} tests are currently pending milestone completion by worker agents.`);
    console.log("This is expected behavior in Test-Driven Development (TDD) prior to full milestone convergence.\n");
  }

  if (isJson) {
    const jsonPath = path.resolve(__dirname, "../../test_results.json");
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf8");
    console.log(`Saved JSON results to ${jsonPath}`);
  }

  // If running with --allow-tdd-failures flag or in CI/verification mode:
  // Normal test runner convention: exit 0 only if results.failed === 0.
  // During TDD, workers inspect failed tests to guide implementation.
  if (results.failed === 0 || allowTddFailures) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(2);
});
