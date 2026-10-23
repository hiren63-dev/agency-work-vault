/**
 * E2E Test Suite Helpers & Statutory Oracles
 * Harsh Manek & Co. Portfolio
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../..");

class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = "AssertionError";
    this.expected = expected;
    this.actual = actual;
  }
}

function assert(condition, message, expected, actual) {
  if (!condition) {
    throw new AssertionError(
      message || "Assertion failed",
      expected,
      actual
    );
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
      expected,
      actual
    );
  }
}

function assertMatch(actual, pattern, message) {
  if (!pattern.test(actual)) {
    throw new AssertionError(
      message || `Value ${JSON.stringify(actual)} does not match pattern ${pattern}`,
      pattern.toString(),
      actual
    );
  }
}

function assertNotMatch(actual, pattern, message) {
  if (pattern.test(actual)) {
    throw new AssertionError(
      message || `Value ${JSON.stringify(actual)} unexpectedly matches pattern ${pattern}`,
      `NOT ${pattern.toString()}`,
      actual
    );
  }
}

/**
 * Fetch HTTP response from localhost:5173
 */
function httpGet(pathname = "/", options = {}) {
  return new Promise((resolve, reject) => {
    const port = options.port || 5173;
    const reqOptions = {
      hostname: "localhost",
      port: port,
      path: pathname,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: options.timeout || 3000,
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        statusCode: 0,
        headers: {},
        body: "",
        error: err.message,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        statusCode: 408,
        headers: {},
        body: "",
        error: "Request timed out",
      });
    });

    req.end();
  });
}

/**
 * Read file relative to project root
 */
function readProjectFile(relPath) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, "utf8");
}

function fileExists(relPath) {
  return fs.existsSync(path.resolve(ROOT_DIR, relPath));
}

/**
 * STATUTORY ORACLES
 */
const statutoryOracles = {
  /**
   * New Tax Regime (FY 2024-25 / AY 2025-26) with Budget 2024 updates
   * Standard Deduction: ₹75,000 for salaried individuals
   * Section 87A rebate: full rebate up to ₹7,00,000 taxable income (max ₹25,000)
   * Marginal relief for income between ₹7,00,001 and ~₹7,27,777
   */
  calculateNewRegimeTax(grossSalary) {
    const stdDeduction = 75000;
    const taxable = Math.max(0, grossSalary - stdDeduction);

    let tax = 0;
    // 0 - 3,00,000: Nil
    // 3,00,001 - 7,00,000: 5%
    if (taxable > 300000) {
      tax += Math.min(taxable - 300000, 400000) * 0.05;
    }
    // 7,00,001 - 10,00,000: 10%
    if (taxable > 700000) {
      tax += Math.min(taxable - 700000, 300000) * 0.10;
    }
    // 10,00,001 - 12,00,000: 15%
    if (taxable > 1000000) {
      tax += Math.min(taxable - 1000000, 200000) * 0.15;
    }
    // 12,00,001 - 15,00,000: 20%
    if (taxable > 1200000) {
      tax += Math.min(taxable - 1200000, 300000) * 0.20;
    }
    // Above 15,00,000: 30%
    if (taxable > 1500000) {
      tax += (taxable - 1500000) * 0.30;
    }

    // Section 87A Rebate & Marginal Relief
    if (taxable <= 700000) {
      tax = 0; // Full 87A rebate
    } else {
      // Marginal relief under Section 87A: tax cannot exceed excess income over 7,00,000
      const excessIncome = taxable - 700000;
      if (tax > excessIncome) {
        tax = excessIncome;
      }
    }

    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;

    return {
      grossSalary,
      stdDeduction,
      taxable,
      baseTax: tax,
      cess,
      totalTax,
    };
  },

  /**
   * Old Tax Regime Calculation
   * Standard Deduction: ₹50,000
   * 80C limit: ₹1,50,000, 80D limit: ₹25,000
   */
  calculateOldRegimeTax(grossSalary, deductions80C = 0, deductions80D = 0) {
    const stdDeduction = 50000;
    const capped80C = Math.min(deductions80C, 150000);
    const capped80D = Math.min(deductions80D, 25000);
    const taxable = Math.max(0, grossSalary - stdDeduction - capped80C - capped80D);

    let tax = 0;
    if (taxable > 250000) {
      tax += Math.min(taxable - 250000, 250000) * 0.05;
    }
    if (taxable > 500000) {
      tax += Math.min(taxable - 500000, 500000) * 0.20;
    }
    if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.30;
    }

    if (taxable <= 500000) {
      tax = 0; // Old regime 87A rebate up to ₹12,500
    }

    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;

    return {
      grossSalary,
      stdDeduction,
      deductions: capped80C + capped80D,
      taxable,
      baseTax: tax,
      cess,
      totalTax,
    };
  },

  /**
   * GST & Invoicing Oracle
   */
  calculateInvoice({ amount, isReverse = false, isInterState = false, rate = 0.18 }) {
    let baseAmount = 0;
    let totalTax = 0;
    let totalAmount = 0;

    if (isReverse) {
      totalAmount = amount;
      baseAmount = Math.round((amount / (1 + rate)) * 100) / 100;
      totalTax = Math.round((totalAmount - baseAmount) * 100) / 100;
    } else {
      baseAmount = amount;
      totalTax = Math.round(amount * rate * 100) / 100;
      totalAmount = Math.round((baseAmount + totalTax) * 100) / 100;
    }

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = totalTax;
    } else {
      cgst = Math.round((totalTax / 2) * 100) / 100;
      sgst = Math.round((totalTax - cgst) * 100) / 100;
    }

    const eWayBillThreshold = 50000;
    const eWayBillRequired = totalAmount > eWayBillThreshold;
    const eInvoicingThreshold = 50000000; // ₹5 Crore aggregate turnover

    return {
      baseAmount,
      totalTax,
      totalAmount,
      cgst,
      sgst,
      igst,
      sacCode: "9982",
      eWayBillRequired,
      eWayBillThreshold,
      eInvoicingThreshold,
    };
  },

  /**
   * Penalty & Interest Oracle
   */
  calculatePenaltyITR({ taxableIncome, delayMonths = 0, unpaidTax = 0 }) {
    // Section 234F Late Fee:
    // If total income <= 5L, fee is ₹1,000; if > 5L, fee is ₹5,000.
    let fee234F = 0;
    if (delayMonths > 0) {
      fee234F = taxableIncome <= 500000 ? 1000 : 5000;
    }

    // Section 234A Interest: 1% per month or part of a month on unpaid tax
    const interest234A = delayMonths > 0 ? Math.round(unpaidTax * 0.01 * delayMonths) : 0;

    return {
      fee234F,
      interest234A,
      totalLateCost: fee234F + interest234A,
    };
  },

  calculatePenaltyGST({ delayDays = 0, isNil = false, unpaidTax = 0 }) {
    // Section 47 Late Fee: ₹50/day (₹25 CGST + ₹25 SGST) or ₹20/day (nil return)
    const ratePerDay = isNil ? 20 : 50;
    const feeSec47 = delayDays * ratePerDay;

    // Section 50 Interest: 18% per annum on delayed tax payment
    const interestSec50 = delayDays > 0 ? Math.round(unpaidTax * (0.18 / 365) * delayDays * 100) / 100 : 0;

    return {
      feeSec47,
      interestSec50,
      totalLateCost: feeSec47 + interestSec50,
    };
  },
};

module.exports = {
  assert,
  assertEqual,
  assertMatch,
  assertNotMatch,
  httpGet,
  readProjectFile,
  fileExists,
  statutoryOracles,
  ROOT_DIR,
};
