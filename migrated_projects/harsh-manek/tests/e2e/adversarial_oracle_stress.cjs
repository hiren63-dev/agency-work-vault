/**
 * Adversarial Oracle & Statutory Stress-Testing Harness
 * Harsh Manek & Co. Portfolio
 *
 * Authored by: Challenger 1 (teamwork_preview_challenger)
 */

const { statutoryOracles } = require("./helpers.cjs");

// Implementation logic extracted directly from src/App.tsx for exact 1:1 comparison
function appCalcTaxNew(grossSalary) {
  const stdDed = 75000;
  const taxable = Math.max(0, grossSalary - stdDed);
  let tax = 0;
  if (taxable > 300000) {
    tax += Math.min(taxable - 300000, 400000) * 0.05;
  }
  if (taxable > 700000) {
    tax += Math.min(taxable - 700000, 300000) * 0.10;
  }
  if (taxable > 1000000) {
    tax += Math.min(taxable - 1000000, 200000) * 0.15;
  }
  if (taxable > 1200000) {
    tax += Math.min(taxable - 1200000, 300000) * 0.20;
  }
  if (taxable > 1500000) {
    tax += (taxable - 1500000) * 0.30;
  }

  // Section 87A Full Rebate & Marginal Relief Proviso
  if (taxable <= 700000) {
    tax = 0;
  } else {
    const excessIncome = taxable - 700000;
    if (tax > excessIncome) {
      tax = excessIncome;
    }
  }
  const taxNew = Math.round(tax * 1.04);
  return { taxable, baseTax: tax, taxNew };
}

function appCalcTaxOld(grossSalary, customDed = 0) {
  const stdDedOld = 50000;
  const taxableOld = Math.max(0, grossSalary - stdDedOld - customDed);
  let tax = 0;
  if (taxableOld > 250000) {
    tax += Math.min(taxableOld - 250000, 250000) * 0.05;
  }
  if (taxableOld > 500000) {
    tax += Math.min(taxableOld - 500000, 500000) * 0.20;
  }
  if (taxableOld > 1000000) {
    tax += (taxableOld - 1000000) * 0.30;
  }
  if (taxableOld <= 500000) {
    tax = 0;
  }
  const taxOld = Math.round(tax * 1.04);
  return { taxableOld, baseTax: tax, taxOld };
}

function appCalcInvoice({ numInput, gstRate, isReverse, isInterState, hasTds }) {
  const rateDec = gstRate / 100;
  let base = 0;
  let gstAmt = 0;
  let totalInvoice = 0;

  if (isReverse) {
    totalInvoice = numInput;
    base = rateDec > 0 ? Math.round((totalInvoice / (1 + rateDec)) * 100) / 100 : totalInvoice;
    gstAmt = Math.round((totalInvoice - base) * 100) / 100;
  } else {
    base = numInput;
    gstAmt = Math.round((base * rateDec) * 100) / 100;
    totalInvoice = Math.round((base + gstAmt) * 100) / 100;
  }

  const tdsAmt = hasTds ? Math.round(base * 0.10 * 100) / 100 : 0;
  const clientPays = Math.round((totalInvoice - tdsAmt) * 100) / 100;
  const netCash = Math.round((clientPays - gstAmt) * 100) / 100;

  const cgst = isInterState ? 0 : Math.round((gstAmt / 2) * 100) / 100;
  const sgst = isInterState ? 0 : Math.round((gstAmt - cgst) * 100) / 100;
  const igst = isInterState ? gstAmt : 0;

  const eWayBillRequired = totalInvoice > 50000;

  return {
    base,
    gstAmt,
    totalInvoice,
    tdsAmt,
    clientPays,
    netCash,
    cgst,
    sgst,
    igst,
    eWayBillRequired,
  };
}

function appCalcPenalty({ penaltyMode, val, incomeAbove5L, unpaidItTax, isNilReturn, unpaidGstTax }) {
  const numUnpaidItTax = Math.max(0, parseInt(String(unpaidItTax).replace(/[^0-9]/g, "")) || 0);
  const fee234F = val > 0 ? (incomeAbove5L ? 5000 : 1000) : 0;
  const delayMonths = val > 0 ? Math.ceil(val / 30) : 0;
  const interest234A = val > 0 ? Math.round(numUnpaidItTax * 0.01 * delayMonths) : 0;
  const totalItPenalty = fee234F + interest234A;

  const numUnpaidGstTax = Math.max(0, parseInt(String(unpaidGstTax).replace(/[^0-9]/g, "")) || 0);
  const ratePerDay = isNilReturn ? 20 : 50;
  const feeSec47 = val > 0 ? val * ratePerDay : 0;
  const interestSec50 = val > 0 ? Math.round(numUnpaidGstTax * (0.18 / 365) * val * 100) / 100 : 0;
  const totalGstPenalty = Math.round((feeSec47 + interestSec50) * 100) / 100;

  return {
    fee234F,
    delayMonths,
    interest234A,
    totalItPenalty,
    feeSec47,
    interestSec50,
    totalGstPenalty,
    total: penaltyMode === "it" ? totalItPenalty : totalGstPenalty,
  };
}

// Adversarial Test Runner
const findings = [];
let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    findings.push({ name, error: err.message, stack: err.stack });
    console.log(`  [CHALLENGE] ${name}`);
    console.log(`              -> ${err.message}`);
  }
}

console.log("\n================================================================================");
console.log("     ADVERSARIAL STRESS HARNESS: STATUTORY ORACLES & EDGE CASES");
console.log("================================================================================\n");

// SECTION 1: TAX SANDBOX STRESS TESTS
console.log("--- 1. Tax Sandbox Stress Tests ---");

runTest("TaxSandbox: Gross Salary = ₹0 (Zero income boundary)", () => {
  const appRes = appCalcTaxNew(0);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(0);
  if (appRes.taxNew !== 0) throw new Error(`Expected ₹0 tax for ₹0 salary, got ₹${appRes.taxNew}`);
  if (appRes.taxNew !== oracleRes.totalTax) {
    throw new Error(`Mismatch between App (₹${appRes.taxNew}) and Oracle (₹${oracleRes.totalTax})`);
  }
});

runTest("TaxSandbox: Gross Salary = ₹3,00,000 (Nil slab ceiling)", () => {
  const appRes = appCalcTaxNew(300000);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(300000);
  if (appRes.taxNew !== 0) throw new Error(`Expected ₹0 tax, got ₹${appRes.taxNew}`);
  if (appRes.taxNew !== oracleRes.totalTax) throw new Error(`App / Oracle mismatch: ${appRes.taxNew} vs ${oracleRes.totalTax}`);
});

runTest("TaxSandbox: Gross Salary = ₹7,00,000 (Section 87A full rebate)", () => {
  const appRes = appCalcTaxNew(700000);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(700000);
  // Taxable is 700000 - 75000 = 625000 <= 700000 -> tax = 0
  if (appRes.taxNew !== 0) throw new Error(`Expected ₹0 tax, got ₹${appRes.taxNew}`);
  if (oracleRes.totalTax !== 0) throw new Error(`Expected oracle ₹0 tax, got ₹${oracleRes.totalTax}`);
});

runTest("TaxSandbox: Gross Salary = ₹7,75,000 (Taxable exactly ₹7,00,000 rebate cliff)", () => {
  const appRes = appCalcTaxNew(775000);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(775000);
  if (appRes.taxable !== 700000) throw new Error(`Expected taxable ₹7,00,000, got ₹${appRes.taxable}`);
  if (appRes.taxNew !== 0) throw new Error(`Expected ₹0 tax under 87A rebate, got ₹${appRes.taxNew}`);
  if (oracleRes.totalTax !== 0) throw new Error(`Oracle tax expected 0, got ${oracleRes.totalTax}`);
});

runTest("TaxSandbox: Gross Salary = ₹7,75,001 (Taxable ₹7,00,001 Sec 87A marginal relief)", () => {
  const appRes = appCalcTaxNew(775001);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(775001);
  // Without marginal relief: tax on 7,00,001 = 20,000.10.
  // With marginal relief: capped at excess over 7,00,000 = ₹1.
  // Cess: Math.round(1 * 1.04) = 1.
  if (appRes.baseTax !== 1) throw new Error(`Expected base tax ₹1 under marginal relief, got ₹${appRes.baseTax}`);
  if (appRes.taxNew !== 1) throw new Error(`Expected total tax ₹1 (with cess), got ₹${appRes.taxNew}`);
  if (oracleRes.baseTax !== 1) throw new Error(`Expected oracle base tax 1, got ${oracleRes.baseTax}`);
  if (oracleRes.totalTax !== 1) throw new Error(`Expected oracle total tax 1, got ${oracleRes.totalTax}`);
});

runTest("TaxSandbox: Gross Salary = ₹7,97,222 (Upper boundary of Sec 87A marginal relief)", () => {
  const appRes = appCalcTaxNew(797222);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(797222);
  // Taxable = 722222. Excess = 22222.
  // Slab tax: 20000 + (22222 * 0.10) = 22222.20 > excess (22222) -> relief applies, baseTax = 22222
  if (appRes.baseTax !== 22222) throw new Error(`Expected base tax ₹22,222, got ₹${appRes.baseTax}`);
  if (appRes.taxNew !== 23111) throw new Error(`Expected total tax ₹23,111, got ₹${appRes.taxNew}`);
  if (oracleRes.baseTax !== 22222) throw new Error(`Oracle base tax mismatch: ${oracleRes.baseTax}`);
});

runTest("TaxSandbox: Gross Salary = ₹7,97,223 (First rupee past marginal relief)", () => {
  const appRes = appCalcTaxNew(797223);
  const oracleRes = statutoryOracles.calculateNewRegimeTax(797223);
  // Taxable = 722223. Excess = 22223.
  // Slab tax: 20000 + (22223 * 0.10) = 22222.30.
  // Since 22222.30 < excess (22223), marginal relief does NOT apply. Base tax is 22222.30.
  // App rounds: Math.round(22222.30 * 1.04) = 23111.
  // BUT helpers.cjs leaves baseTax as 22222.3 and totalTax as 22222.3 + 889 = 23111.3!
  if (oracleRes.totalTax !== Math.round(oracleRes.totalTax)) {
    throw new Error(`Oracle totalTax is unrounded float (${oracleRes.totalTax}), diverging from statutory integer/currency standard`);
  }
});

runTest("TaxSandbox: High Income Slabs (₹12L, ₹15L, ₹50L, ₹1Cr, ₹10Cr)", () => {
  const salaries = [1200000, 1500000, 5000000, 10000000, 100000000];
  for (const sal of salaries) {
    const appRes = appCalcTaxNew(sal);
    const oracleRes = statutoryOracles.calculateNewRegimeTax(sal);
    if (Math.abs(appRes.taxNew - Math.round(oracleRes.totalTax)) > 1) {
      throw new Error(`Divergence at ₹${sal}: App ₹${appRes.taxNew} vs Oracle ₹${oracleRes.totalTax}`);
    }
  }
});

runTest("TaxSandbox: Deduction Permutations (16 combinations of 80C, 80CCD, 80D, 24b)", () => {
  const deds = [
    { id: '80c', max: 150000 },
    { id: '80ccd', max: 50000 },
    { id: '80d', max: 75000 },
    { id: '24b', max: 200000 }
  ];
  for (let mask = 0; mask < 16; mask++) {
    let customSum = 0;
    for (let i = 0; i < 4; i++) {
      if ((mask & (1 << i)) !== 0) customSum += deds[i].max;
    }
    const res = appCalcTaxOld(1200000, customSum);
    if (res.taxableOld < 0) throw new Error(`Negative taxable income at mask ${mask}`);
    if (res.taxOld < 0) throw new Error(`Negative tax at mask ${mask}`);
  }
});


// SECTION 2: INVOICE STRATEGIST STRESS TESTS
console.log("\n--- 2. Invoice Strategist Stress Tests ---");

runTest("InvoiceStrategist: Zero Amount Input (₹0 boundary)", () => {
  const fwd = appCalcInvoice({ numInput: 0, gstRate: 18, isReverse: false, isInterState: false, hasTds: false });
  const rev = appCalcInvoice({ numInput: 0, gstRate: 18, isReverse: true, isInterState: false, hasTds: false });
  if (isNaN(fwd.totalInvoice) || isNaN(rev.totalInvoice)) throw new Error("NaN produced on zero amount");
  if (fwd.totalInvoice !== 0 || rev.totalInvoice !== 0) throw new Error("Expected ₹0 invoice on ₹0 input");
  if (fwd.eWayBillRequired || rev.eWayBillRequired) throw new Error("E-Way bill unexpectedly required on ₹0");
});

runTest("InvoiceStrategist: E-Way Bill Exact Threshold Boundaries (₹49,999 vs ₹50,000 vs ₹50,001)", () => {
  const at49k = appCalcInvoice({ numInput: 49999, gstRate: 0, isReverse: true, isInterState: false, hasTds: false });
  const at50k = appCalcInvoice({ numInput: 50000, gstRate: 0, isReverse: true, isInterState: false, hasTds: false });
  const at50k1 = appCalcInvoice({ numInput: 50001, gstRate: 0, isReverse: true, isInterState: false, hasTds: false });

  if (at49k.eWayBillRequired !== false) throw new Error("₹49,999 must NOT require E-Way bill");
  // Statutory Rule 138: "exceeding fifty thousand rupees"
  if (at50k.eWayBillRequired !== false) throw new Error("₹50,000 must NOT require E-Way bill (threshold is > ₹50,000)");
  if (at50k1.eWayBillRequired !== true) throw new Error("₹50,001 MUST require E-Way bill");
});

runTest("InvoiceStrategist: All GST Slabs (0%, 5%, 12%, 18%, 28%) Forward & Reverse", () => {
  const rates = [0, 5, 12, 18, 28];
  for (const r of rates) {
    const fwd = appCalcInvoice({ numInput: 100000, gstRate: r, isReverse: false, isInterState: false, hasTds: true });
    const rev = appCalcInvoice({ numInput: 100000, gstRate: r, isReverse: true, isInterState: false, hasTds: true });

    if (isNaN(fwd.netCash) || isNaN(rev.netCash)) throw new Error(`NaN encountered at GST rate ${r}%`);

    // In forward: total = 100000 * (1 + r/100)
    const expFwdGst = Math.round(100000 * (r / 100) * 100) / 100;
    if (Math.abs(fwd.gstAmt - expFwdGst) > 0.01) {
      throw new Error(`Forward GST calculation mismatch at ${r}%: expected ${expFwdGst}, got ${fwd.gstAmt}`);
    }

    // In reverse: base + gst = totalInvoice
    if (Math.abs((rev.base + rev.gstAmt) - rev.totalInvoice) > 0.02) {
      throw new Error(`Reverse reconciliation error at ${r}%: base ${rev.base} + gst ${rev.gstAmt} != total ${rev.totalInvoice}`);
    }

    // Tax parity: cgst + sgst must equal gstAmt
    if (Math.abs((fwd.cgst + fwd.sgst) - fwd.gstAmt) > 0.01) {
      throw new Error(`Intra-state split parity error: cgst ${fwd.cgst} + sgst ${fwd.sgst} != gst ${fwd.gstAmt}`);
    }
  }
});

runTest("InvoiceStrategist: High Value Consultation (₹10 Crore TDS & Cash Flow)", () => {
  const res = appCalcInvoice({ numInput: 100000000, gstRate: 18, isReverse: false, isInterState: true, hasTds: true });
  // Base = 10Cr. TDS = 1Cr. GST = 1.8Cr. Total = 11.8Cr. Client pays = 10.8Cr. Net cash = 9Cr.
  if (res.base !== 100000000) throw new Error(`Expected base 10Cr, got ${res.base}`);
  if (res.tdsAmt !== 10000000) throw new Error(`Expected TDS 1Cr, got ${res.tdsAmt}`);
  if (res.igst !== 18000000) throw new Error(`Expected IGST 1.8Cr, got ${res.igst}`);
  if (res.totalInvoice !== 118000000) throw new Error(`Expected Total 11.8Cr, got ${res.totalInvoice}`);
  if (res.netCash !== 90000000) throw new Error(`Expected Net Cash 9Cr, got ${res.netCash}`);
});


// SECTION 3: PENALTY SIMULATOR STRESS TESTS
console.log("\n--- 3. Penalty Simulator Stress Tests ---");

runTest("PenaltySimulator: Negative Delay (-30 to -1 days, Filing on time)", () => {
  const negativeDays = [-30, -15, -5, -1];
  for (const d of negativeDays) {
    const appRes = appCalcPenalty({
      penaltyMode: "gst",
      val: d,
      incomeAbove5L: true,
      unpaidItTax: 100000,
      isNilReturn: false,
      unpaidGstTax: 20000,
    });
    if (appRes.feeSec47 !== 0 || appRes.interestSec50 !== 0 || appRes.totalGstPenalty !== 0) {
      throw new Error(`App failed to zero penalties on negative delay ${d}: fee ${appRes.feeSec47}, interest ${appRes.interestSec50}`);
    }
  }
});

runTest("PenaltySimulator Oracle Flaw: Negative Days in statutoryOracles.calculatePenaltyGST", () => {
  // Directly test helpers.cjs statutoryOracles.calculatePenaltyGST with negative delayDays (-10 days)
  const oracleRes = statutoryOracles.calculatePenaltyGST({ delayDays: -10, isNil: false, unpaidTax: 20000 });
  if (oracleRes.feeSec47 < 0 || oracleRes.totalLateCost < 0) {
    throw new Error(
      `CRITICAL ORACLE DEFECT in helpers.cjs calculatePenaltyGST: negative delayDays (-10) generates negative late fee ₹${oracleRes.feeSec47} and negative totalLateCost ₹${oracleRes.totalLateCost}. Section 47 fee must be guarded by delayDays > 0.`
    );
  }
});

runTest("PenaltySimulator: Income Tax Sec 234F Threshold (<= ₹5L vs > ₹5L)", () => {
  const atOrBelow5L = appCalcPenalty({
    penaltyMode: "it",
    val: 10,
    incomeAbove5L: false,
    unpaidItTax: 0,
    isNilReturn: false,
    unpaidGstTax: 0,
  });
  const above5L = appCalcPenalty({
    penaltyMode: "it",
    val: 10,
    incomeAbove5L: true,
    unpaidItTax: 0,
    isNilReturn: false,
    unpaidGstTax: 0,
  });

  if (atOrBelow5L.fee234F !== 1000) throw new Error(`Expected ₹1,000 for income <= 5L, got ₹${atOrBelow5L.fee234F}`);
  if (above5L.fee234F !== 5000) throw new Error(`Expected ₹5,000 for income > 5L, got ₹${above5L.fee234F}`);
});

runTest("PenaltySimulator: Nil Return vs Regular GST Late Fee (₹20 vs ₹50 / day)", () => {
  const nil = appCalcPenalty({
    penaltyMode: "gst",
    val: 10,
    incomeAbove5L: true,
    unpaidItTax: 0,
    isNilReturn: true,
    unpaidGstTax: 0,
  });
  const reg = appCalcPenalty({
    penaltyMode: "gst",
    val: 10,
    incomeAbove5L: true,
    unpaidItTax: 0,
    isNilReturn: false,
    unpaidGstTax: 0,
  });

  if (nil.feeSec47 !== 200) throw new Error(`Expected Nil fee ₹200 (10*20), got ₹${nil.feeSec47}`);
  if (reg.feeSec47 !== 500) throw new Error(`Expected Regular fee ₹500 (10*50), got ₹${reg.feeSec47}`);
});

runTest("PenaltySimulator: Section 234A Monthly Stepping (1 day vs 30 days vs 31 days)", () => {
  const day1 = appCalcPenalty({ penaltyMode: "it", val: 1, incomeAbove5L: true, unpaidItTax: 100000, isNilReturn: false, unpaidGstTax: 0 });
  const day30 = appCalcPenalty({ penaltyMode: "it", val: 30, incomeAbove5L: true, unpaidItTax: 100000, isNilReturn: false, unpaidGstTax: 0 });
  const day31 = appCalcPenalty({ penaltyMode: "it", val: 31, incomeAbove5L: true, unpaidItTax: 100000, isNilReturn: false, unpaidGstTax: 0 });

  // 1 day delay = 1 month of 234A interest (1% of 1,00,000 = 1,000)
  if (day1.interest234A !== 1000) throw new Error(`Day 1: expected 1 month interest (₹1,000), got ₹${day1.interest234A}`);
  // 30 days delay = 1 month of 234A interest (1,000)
  if (day30.interest234A !== 1000) throw new Error(`Day 30: expected 1 month interest (₹1,000), got ₹${day30.interest234A}`);
  // 31 days delay = 2 months of 234A interest (2% of 1,00,000 = 2,000)
  if (day31.interest234A !== 2000) throw new Error(`Day 31: expected 2 months interest (₹2,000), got ₹${day31.interest234A}`);
});

runTest("PenaltySimulator: Extreme Delays (> 180 days up to 365 days)", () => {
  // Test 200 days and 365 days
  const day200 = appCalcPenalty({ penaltyMode: "gst", val: 200, incomeAbove5L: true, unpaidItTax: 0, isNilReturn: false, unpaidGstTax: 50000 });
  const day365 = appCalcPenalty({ penaltyMode: "gst", val: 365, incomeAbove5L: true, unpaidItTax: 0, isNilReturn: false, unpaidGstTax: 50000 });

  if (day200.feeSec47 !== 10000) throw new Error(`Day 200 fee: expected 10,000, got ${day200.feeSec47}`);
  // In uncapped statutory calculation:
  // Sec 47 fee at 365 days: 365 * 50 = 18,250
  // Note: statutory limit under Section 47 unamended is ₹10,000, but simulator does uncapped linear multiplication.
  if (day365.feeSec47 !== 18250) throw new Error(`Day 365 fee: expected 18,250, got ${day365.feeSec47}`);
});

console.log("\n================================================================================");
console.log(`Execution Summary: Total Tests: ${totalTests} | Passed: ${passedTests} | Findings/Challenges: ${findings.length}`);
console.log("================================================================================\n");

if (findings.length > 0) {
  console.log("CHALLENGES DETECTED:");
  findings.forEach((f, i) => {
    console.log(`${i + 1}. [${f.name}]: ${f.error}`);
  });
}
