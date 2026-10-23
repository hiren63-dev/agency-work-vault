export const SERVICES_DATA = [
  { 
    slug: "tax-planning-compliance",
    title: "Tax Planning & Compliance", 
    desc: "We ensure your business meets all Income Tax obligations accurately and on time, helping you structure transactions to minimize tax liability legally.", 
    appliesTo: "Individuals, Proprietorships, Partnership Firms, LLPs, and Private Limited Companies.",
    documents: ["PAN and Aadhaar", "Bank statements for the financial year", "Details of investments (80C, 80D, etc.)", "Previous year's ITR", "TDS certificates (Form 16/16A)"],
    dueDates: ["July 31 for Non-Audit cases", "October 31 for Audit cases"],
    features: ["Income Tax Return Filing", "Advance Tax Calculation", "TDS Returns", "Tax Assessment Representation"],
    sop: [
      { step: "Initial Review", detail: "We review your financial data and previous filings." },
      { step: "Tax Computation", detail: "We calculate your total tax liability and identify applicable deductions." },
      { step: "Filing", detail: "We prepare and submit your Income Tax Return on the portal." },
      { step: "Follow-up", detail: "We track the processing of your return and handle any notices." }
    ],
    faqs: [
      { question: "Do I need to pay advance tax?", answer: "If your estimated tax liability exceeds ₹10,000 for the year, you must pay advance tax in installments." },
      { question: "What happens if I miss the due date?", answer: "Late filing attracts penalties and interest under section 234A, 234B, and 234C." },
      { question: "Can you help if I receive an Income Tax notice?", answer: "Yes, we represent clients and draft responses for various types of assessments and notices." }
    ]
  },
  { 
    slug: "statutory-audit",
    title: "Statutory & Tax Audit", 
    desc: "Independent verification of your financial statements to ensure compliance with the Companies Act and Income Tax Act.", 
    appliesTo: "Private Limited Companies, LLPs, and businesses crossing statutory turnover thresholds.",
    documents: ["Trial Balance and General Ledger", "Sales and Purchase Registers", "Bank Reconciliation Statements", "Inventory Valuation Records", "Statutory Dues Payment Receipts"],
    dueDates: ["September 30 for Tax Audit", "September 30 for Company Statutory Audit"],
    features: ["Company Audit", "Tax Audit u/s 44AB", "Internal Control Checks"],
    sop: [
      { step: "Planning", detail: "We understand your business processes and set an audit timeline." },
      { step: "Vouching & Verification", detail: "We check transactions, bills, and balances." },
      { step: "Reporting", detail: "We prepare the draft financial statements and audit report." },
      { step: "Finalization", detail: "We sign and issue the final audit report for statutory filing." }
    ],
    faqs: [
      { question: "Who is liable for a Tax Audit?", answer: "Generally, businesses with turnover exceeding ₹1 Crore (₹10 Crore for mostly digital transactions) and professionals with receipts over ₹50 Lakhs." },
      { question: "How long does the audit take?", answer: "Depending on the volume of transactions, it usually takes 1 to 3 weeks." },
      { question: "Do we need an audit if we have zero revenue?", answer: "Private Limited Companies must file an audit report regardless of turnover." }
    ]
  },
  { 
    slug: "gst-and-indirect-taxes",
    title: "GST Compliance & Advisory", 
    desc: "Complete handling of your Goods and Services Tax (GST) requirements, from monthly returns to yearly audits and refunds.", 
    appliesTo: "Proprietorships, Partnerships, LLPs, and Companies providing taxable goods or services.",
    documents: ["Sales Invoices (B2B and B2C)", "Purchase Invoices for Input Tax Credit", "E-way bill details", "Bank statements"],
    dueDates: ["11th for GSTR-1", "20th for GSTR-3B", "December 31 for Annual Return (GSTR-9)"],
    features: ["GST Registration", "Monthly/Quarterly Return Filing", "ITC Reconciliation (GSTR-2B)", "GST Refund Claims"],
    sop: [
      { step: "Data Collection", detail: "You provide sales and purchase data at the end of the month." },
      { step: "Reconciliation", detail: "We match your purchases with GSTR-2B to ensure you get full Input Tax Credit." },
      { step: "Return Filing", detail: "We prepare the challan, confirm the tax payable, and file GSTR-1 and 3B." },
      { step: "Annual Compliance", detail: "We conduct the year-end reconciliation and file the annual return." }
    ],
    faqs: [
      { question: "Is GST registration mandatory?", answer: "It is mandatory if your turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs for services) or if you make inter-state supplies." },
      { question: "Why is ITC reconciliation important?", answer: "If your suppliers don't file their returns, you cannot claim the Input Tax Credit, leading to higher tax cash outflow." },
      { question: "Can you help cancel my GST registration?", answer: "Yes, we handle the entire cancellation and final return (GSTR-10) process." }
    ]
  },
  { 
    slug: "corporate-finance",
    title: "Project Finance & Banking", 
    desc: "We assist businesses in preparing project reports and financial projections to secure bank loans and working capital.", 
    appliesTo: "Manufacturing units, Traders, and Service Providers seeking expansion capital.",
    documents: ["Last 3 years audited financials", "Provisional financials for current year", "Quotations for machinery/assets", "Details of existing loans"],
    dueDates: ["As per banking requirements"],
    features: ["CMA Data Preparation", "Project Reports", "Working Capital Limits (CC/OD)", "Term Loans"],
    sop: [
      { step: "Assessment", detail: "We assess your funding requirements and eligibility." },
      { step: "Documentation", detail: "We prepare CMA data and projected financial statements." },
      { step: "Bank Liaison", detail: "We coordinate with banking officials to answer financial queries." },
      { step: "Sanction", detail: "We assist until the loan is sanctioned and disbursed." }
    ],
    faqs: [
      { question: "What is CMA Data?", answer: "Credit Monitoring Arrangement (CMA) data is a detailed financial report required by banks to assess your working capital needs." },
      { question: "Can you guarantee a loan approval?", answer: "No. Loan sanction is strictly at the discretion of the bank based on your credit profile." }
    ]
  },
  { 
    slug: "management-consultancy",
    title: "Accounting & Compliance Outsourcing", 
    desc: "End-to-end accounting services where we act as your external finance team, handling bookkeeping, payroll, and compliance.", 
    appliesTo: "Startups, SMEs, and Foreign Subsidiaries.",
    documents: ["Bank statements", "Purchase and sales invoices", "Expense vouchers", "Employee attendance for payroll"],
    dueDates: ["Monthly accounting cycle (typically 1st to 10th)"],
    features: ["Bookkeeping (Tally/Zoho)", "Payroll Processing", "TDS & PF/ESI Compliance", "Monthly MIS Reports"],
    sop: [
      { step: "Onboarding", detail: "We set up your chart of accounts and accounting software." },
      { step: "Data Processing", detail: "We record all transactions on a weekly or monthly basis." },
      { step: "Reconciliation", detail: "We reconcile bank accounts, debtors, and creditors." },
      { step: "Reporting", detail: "We provide you with monthly profit and loss statements." }
    ],
    faqs: [
      { question: "Do you provide software?", answer: "We work on industry standards like Tally Prime, Zoho Books, or QuickBooks depending on your preference." },
      { question: "Is our financial data secure?", answer: "Yes, we maintain strict confidentiality and use secure local and cloud environments." }
    ]
  },
  { 
    slug: "investment-wealth",
    title: "Company Formation & ROC Compliance", 
    desc: "We help you register your business entity and ensure all annual filings with the Ministry of Corporate Affairs are up to date.", 
    appliesTo: "New Entrepreneurs and existing Private Limited Companies / LLPs.",
    documents: ["PAN and Aadhaar of Directors", "Passport size photos", "Address proof (Electricity bill)", "Rent agreement for registered office"],
    dueDates: ["AOC-4 & MGT-7 within 30-60 days of AGM", "DIR-3 KYC by September 30"],
    features: ["Company/LLP Incorporation", "Annual ROC Filings", "Change in Directors", "Increase in Authorized Capital"],
    sop: [
      { step: "Name Approval", detail: "We apply for your desired company name through the RUN/SPICe+ portal." },
      { step: "Incorporation", detail: "We draft the MOA and AOA and submit the incorporation forms." },
      { step: "Certificate", detail: "You receive the Certificate of Incorporation, PAN, and TAN." },
      { step: "Annual Filings", detail: "We handle your yearly mandatory ROC filings." }
    ],
    faqs: [
      { question: "How long does it take to register a company?", answer: "Usually 7 to 10 working days, subject to government processing times." },
      { question: "What is the minimum capital required?", answer: "There is no minimum capital requirement for a Private Limited Company anymore." }
    ]
  }
];
