export interface HeroSlide {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  slug: string;
  badge?: string;
}

export interface SubService {
  title: string;
  desc: string;
  documents: string[];
  process: string[];
}

export interface PracticePillar {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  subServices: SubService[];
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  idealFor: string;
}

export interface OfficeBranch {
  city: string;
  badge: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  hours: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "ai-guide-2026",
    title: "The Complete Guide to Free AI Resources in 2026: AI Tools, APIs, Credits & Startup Benefits",
    category: "AI & Finance Tech",
    date: "August 2026",
    readTime: "8 min read",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200",
    summary: "Discover how finance leaders and businesses leverage free tier LLM APIs, cloud AI credits, and automation stacks to multiply productivity by 10x without capital expenditure.",
    slug: "/blog/1"
  },
  {
    id: "gujarat-minimum-wages-2026",
    title: "Gujarat Minimum Wages Revised (01 April 2026 to 30 September 2026): What Employers Must Do",
    category: "Regulatory Compliance",
    date: "July 2026",
    readTime: "6 min read",
    badge: "Mandatory Update",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    summary: "Comprehensive breakdown of revised basic pay and VDA rates across skilled, semi-skilled, and unskilled categories in Gujarat to ensure zero compliance defaults.",
    slug: "/blog/2"
  },
  {
    id: "mca-ccfs-2026",
    title: "MCA Compliance Relief Scheme (CCFS-2026): Complete Guide for Companies & Directors",
    category: "Corporate Advisory",
    date: "June 2026",
    readTime: "10 min read",
    badge: "Government Scheme",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    summary: "Everything Indian companies need to know about immunity from additional filing fees, active company status restoration, and immunity certificates under MCA's 2026 relief framework.",
    slug: "/blog/3"
  },
  {
    id: "vibe-coding-cas",
    title: "Vibe Coding: How CAs & Finance Leaders Build In-House Automation Tools Without Tech Experts",
    category: "Tech Transformation",
    date: "May 2026",
    readTime: "7 min read",
    badge: "Future of Accounting",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    summary: "How modern Chartered Accountants use AI coding assistants, prompt-driven script generation, and zero-code workflows to automate reconciliation, GST scraping, and MIS reports.",
    slug: "/blog/4"
  },
  {
    id: "tax-12-lakh-income",
    title: "Understanding Tax on ₹12 Lakh Income in India (Tax Year 2025-26): Old vs New Regime Breakdown",
    category: "Direct Tax",
    date: "April 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
    summary: "Side-by-side mathematical comparison of tax liability at ₹12L gross income under Section 115BAC versus Old Regime with 80C, 80D, 24(b) deductions.",
    slug: "/blog/5"
  },
  {
    id: "secondary-demat-tax",
    title: "Secondary Demat Account Strategy: A Legitimate Way to Lower Tax on Capital Gains",
    category: "Wealth & Tax",
    date: "March 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200",
    summary: "Learn how holding secondary Demat accounts optimizes short-term vs long-term capital gains tax computation and FIFO method tracking under Income Tax Section 45.",
    slug: "/blog/6"
  }
];

export const PRACTICE_PILLARS: PracticePillar[] = [
  {
    id: "governance-risk-compliance",
    num: "01",
    title: "Governance, Risk & Compliance (GRC)",
    subtitle: "Enterprise Controls & Internal Audits",
    iconName: "ShieldCheck",
    summary: "Strengthen enterprise integrity, prevent operational leakages, and satisfy institutional board governance with customized GRC frameworks, internal audits, and SOPs.",
    subServices: [
      {
        title: "Internal Audit & Process Reviews",
        desc: "Independent evaluation of key business cycles (Procure-to-Pay, Order-to-Cash, Payroll, Treasury) to identify control gaps, cost leakages, and operational inefficiencies.",
        documents: [
          "Organogram & delegation of authority matrix",
          "Standard operating procedure (SOP) manuals",
          "ERP user access rights & log reports",
          "Sample transaction vouchers across cycles",
          "Previous internal audit observations"
        ],
        process: [
          "Risk assessment & audit scope definition",
          "Walkthrough testing of business processes",
          "Substantive sample testing & gap identification",
          "Draft audit findings review with management",
          "Final GRC report & action plan tracking"
        ]
      },
      {
        title: "Standard Operating Procedures (SOP) Development",
        desc: "Design and implementation of step-by-step operational workflows and internal control manuals tailored to scalable business operations.",
        documents: [
          "Current process flowcharts & departmental policies",
          "Key performance indicators (KPIs) per role",
          "ERP system user role matrix",
          "Vendor & customer onboarding contracts"
        ],
        process: [
          "Stakeholder interviews & process mapping",
          "Control point identification & risk matrix drafting",
          "SOP manual & flow chart creation",
          "Team training & implementation support",
          "Periodic compliance reviews"
        ]
      },
      {
        title: "Internal Financial Controls (IFC / ICOFR)",
        desc: "Design, testing, and certification of Internal Financial Controls over Financial Reporting under Section 134(5)(e) of the Companies Act, 2013.",
        documents: [
          "Financial statement risk assessment document",
          "Process flowcharts for financial reporting",
          "Control Matrix (Risk Control Matrix - RCM)",
          "Management testing & evidence documentation"
        ],
        process: [
          "Scoping & materiality determination",
          "RCM development & gap analysis",
          "Design effectiveness & operating effectiveness testing",
          "Deficiency remediation advisory",
          "IFC compliance certificate issuance"
        ]
      }
    ]
  },
  {
    id: "audit-assurance",
    num: "02",
    title: "Audit & Assurance Services",
    subtitle: "Statutory, Tax & Concurrent Audits",
    iconName: "BookOpen",
    summary: "Independent financial reporting assurance built on international auditing standards (SAs) to establish stakeholder confidence with banks, investors, and tax authorities.",
    subServices: [
      {
        title: "Statutory Financial Audit",
        desc: "Comprehensive examination of financial statements under the Companies Act, 2013, LLP Act, or Partnership rules to deliver clean, audited financial reports.",
        documents: [
          "Trial balance, ledgers, and sub-ledgers",
          "Bank balance confirmation letters",
          "Fixed asset register & physical count sheets",
          "Inventory valuation certificates & stock sheets",
          "Loan agreements, bank sanction letters, & MOUs"
        ],
        process: [
          "Pre-audit planning & risk assessment",
          "Internal control evaluation & sampling strategy",
          "Substantive testing & third-party confirmations",
          "Management Representation Letter (MRL)",
          "Audit Report issuance with Notes to Accounts"
        ]
      },
      {
        title: "Tax Audit (Under Sec. 44AB of IT Act)",
        desc: "Specialized tax compliance audit verifying book profits, disallowed expenses, TDS defaults, and Form 3CA/3CB/3CD submission before statutory deadlines.",
        documents: [
          "Audited balance sheet & profit & loss account",
          "Form 26AS, AIS, and TIS statements",
          "GST return reconciliation (GSTR-9/3B vs Books)",
          "TDS deduction & deposit quarterly statements",
          "Related party transaction details (Sec 40A(2b))"
        ],
        process: [
          "Book profit & tax adjustment review",
          "Clause-by-clause verification of Form 3CD",
          "GST & TDS cross-reconciliation",
          "Tax auditor approval on Income Tax portal",
          "Final Form 3CA/3CB & 3CD e-filing"
        ]
      },
      {
        title: "Stock & Concurrent Bank Audits",
        desc: "Physical verification of raw materials, finished goods, and collateral stock for borrowing companies, bank branches, and financial institutions.",
        documents: [
          "Stock statements submitted to banks",
          "Insurance policies covering inventory & assets",
          "Inward/outward gate passes & stock register",
          "Bank sanction letter & drawing power calculations"
        ],
        process: [
          "Surprise physical inspection of warehouse",
          "Stock valuation & slow-moving stock identification",
          "Drawing Power (DP) re-computation",
          "Branch/Borrower concurrence report"
        ]
      }
    ]
  },
  {
    id: "taxation-regulatory",
    num: "03",
    title: "Taxation & Regulatory Advisory",
    subtitle: "Direct Tax, GST & International Tax",
    iconName: "Landmark",
    summary: "Proactive tax optimization strategies and end-to-end representation before ITD, GSTN, and appellate tribunals to defend your enterprise against unwarranted demands.",
    subServices: [
      {
        title: "Direct Tax & Corporate Income Tax",
        desc: "Proactive corporate tax planning, advance tax re-computation, scrutiny representation (Sec 143(3)), and appeal drafting before CIT(A) & ITAT.",
        documents: [
          "PAN & TAN certificates",
          "Computation of total income for past 3 years",
          "Income tax notices / E-proceedings orders",
          "Form 16/16A & advance tax challans",
          "Foreign remittance Form 15CA / 15CB copies"
        ],
        process: [
          "Tax strategy & deduction optimization",
          "Advance tax calculation & quarterly filing",
          "ITR 1 to 7 drafting & digital submission",
          "Notice response drafting on e-filing portal",
          "Appellate representation before CIT(A)"
        ]
      },
      {
        title: "Indirect Tax (GST Lifecycle & Litigation)",
        desc: "Complete GST management — registration, monthly GSTR-1 & 3B, annual GSTR-9/9C, Input Tax Credit (ITC) reconciliation, and GST audit defense.",
        documents: [
          "GST registration certificates & premises proof",
          "Monthly purchase register & GSTR-2B JSON files",
          "Sales invoices, debit/credit notes, & e-way bills",
          "Electronic credit & cash ledger statements"
        ],
        process: [
          "HSN & tax rate mapping for goods/services",
          "GSTR-1 & 3B filing with 2B ITC validation",
          "Annual GSTR-9 / 9C reconciliation report",
          "ASMT-10 notice reply & SCN representation"
        ]
      },
      {
        title: "International Taxation & Transfer Pricing",
        desc: "Cross-border transaction advisory, Form 15CA/15CB certification, Double Taxation Avoidance Agreement (DTAA) benefits, and Transfer Pricing Study (Sec 92E).",
        documents: [
          "Associated Enterprise (AE) agreements",
          "Tax Residency Certificate (TRC) of foreign entity",
          "Form 10F & foreign remittance invoices",
          "Transfer pricing study report & benchmarking data"
        ],
        process: [
          "DTAA eligibility & tax withholding analysis",
          "Form 15CA & 15CB CA certification",
          "Transfer pricing benchmarking study",
          "Form 3CEB audit filing on IT portal"
        ]
      }
    ]
  },
  {
    id: "business-support-advisory",
    num: "04",
    title: "Business Support & Advisory Services",
    subtitle: "Virtual CFO, Corporate Incorporation & Valuation",
    iconName: "Briefcase",
    summary: "Strategic financial leadership for fast-growing companies — from startup incorporation and fundraise readiness to Virtual CFO management and financial modeling.",
    subServices: [
      {
        title: "Virtual CFO Services",
        desc: "Part-time executive financial leadership providing financial strategy, cash flow management, budgeting, board presentations, and investor reporting.",
        documents: [
          "Monthly MIS reports & financial statements",
          "Annual budget & rolling cash flow forecast",
          "Cap table & investor debt/equity schedule",
          "Key SaaS metrics / unit economics data"
        ],
        process: [
          "Financial health audit & cash runway assessment",
          "Weekly cash flow control & budget variance tracking",
          "Monthly MIS dashboard & board pitch deck review",
          "Vendor & customer credit term optimization",
          "Capital structure & debt financing guidance"
        ]
      },
      {
        title: "Business Setup & Corporate Advisory",
        desc: "End-to-end incorporation of Private Limited Companies, LLPs, OPCs, Section 8 Non-Profits, along with ROC annual filings, DIN, and Secretarial compliance.",
        documents: [
          "Identity & address proofs of proposed directors",
          "Registered office premises ownership / NOC",
          "Proposed business activity description",
          "Digital Signature Certificates (DSC) of directors"
        ],
        process: [
          "Name reservation via RUN / SPICe+ Part A",
          "MOA / AOA drafting & SPICe+ Part B submission",
          "PAN, TAN, EPFO, ESIC, & GST auto-generation",
          "First Board Meeting minutes & INC-20A filing",
          "Annual ROC filings (MGT-7, AOC-4)"
        ]
      },
      {
        title: "Financial Modeling & Business Valuation",
        desc: "DCF (Discounted Cash Flow) and NAV valuation reports by Registered Valuer / CA for startup fundraising, ESOPs, M&A, and Sec 56(2)(viib) tax compliance.",
        documents: [
          "5-year projected financial statements",
          "Historical audited financial statements",
          "Cap table & previous investment agreements",
          "Industry benchmark & growth assumptions"
        ],
        process: [
          "Business model & revenue driver analysis",
          "DCF / Relative valuation modeling",
          "WACC & discount rate determination",
          "Draft valuation report for management review",
          "Final Rule 11UA / Valuation Certificate issuance"
        ]
      }
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "individual",
    name: "Individual & NRI Tax",
    tagline: "For salaried professionals, traders & NRIs",
    price: "₹1,499",
    period: "per filing",
    idealFor: "Salaried individuals, freelance consultants, & capital market traders needing zero-error ITR filing.",
    features: [
      "Regime analysis (Old vs New 115BAC comparison)",
      "Form 16, 26AS, AIS & TIS cross-verification",
      "Capital gains computation (Stocks, Mutual Funds, Crypto)",
      "Advance Tax guidance & 80C/80D optimization",
      "Digital filing acknowledgment & PDF report"
    ],
    ctaText: "File Your ITR Now"
  },
  {
    id: "startup",
    name: "Startup & SME Compliance",
    tagline: "Essential compliance for Pvt Ltd & LLPs",
    price: "₹4,999",
    period: "per month",
    popular: true,
    idealFor: "Growing businesses seeking error-free GST, bookkeeping, payroll, and statutory filing.",
    features: [
      "Monthly GSTR-1 & 3B return filing",
      "Cloud bookkeeping & monthly ledger closing",
      "Quarterly TDS return computation & Form 16A",
      "Annual ROC return filing (AOC-4 & MGT-7)",
      "Dedicated CA relationship manager & WhatsApp support"
    ],
    ctaText: "Start SME Retainer"
  },
  {
    id: "enterprise-grc",
    name: "Enterprise Audit & GRC",
    tagline: "For established corporate entities",
    price: "Custom",
    period: "annual engagement",
    idealFor: "Medium to large enterprises requiring statutory audits, tax audits, GRC, and IFC certification.",
    features: [
      "Statutory Audit & Tax Audit under Sec. 44AB",
      "Internal Financial Control (IFC) testing & certification",
      "GRC risk framework & internal process reviews",
      "Transfer pricing study & Form 3CEB audit",
      "Direct representation before ITD & GST appellate authorities"
    ],
    ctaText: "Request Proposal"
  },
  {
    id: "virtual-cfo",
    name: "Virtual CFO Retainer",
    tagline: "Strategic financial leadership on demand",
    price: "₹19,999",
    period: "per month",
    idealFor: "Funded startups & high-growth companies needing strategic financial direction.",
    features: [
      "Weekly cash flow management & 13-week forecast",
      "Monthly MIS reporting & Board deck preparation",
      "Budget vs Actual variance analysis & unit economics",
      "Fundraising pitch deck financial modeling & DCF valuation",
      "Investor updates & cap table management"
    ],
    ctaText: "Schedule CFO Call"
  }
];

export const OFFICE_BRANCHES: OfficeBranch[] = [
  {
    city: "Rajkot (Head Office)",
    badge: "Headquarters",
    address: "309, 3rd Floor, Time Square II, Ayodhya Chowk, 150 Feet Ring Road, Rajkot, Gujarat – 360005",
    phone: "+91-9033440008",
    email: "Harsh.manek@hotmail.com",
    mapUrl: "https://maps.google.com/?q=Time+Square+2+Ayodhya+Chowk+Rajkot",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM IST"
  },
  {
    city: "Ahmedabad (Branch Office)",
    badge: "Advisory Branch",
    address: "7, A Square Complex, Shilaj Circle, Near Kaveri Sangam, S P Ring Road, Ahmedabad, Gujarat – 380058",
    phone: "+91-8209105955",
    email: "mayursinh@csmllp.in",
    mapUrl: "https://maps.google.com/?q=Shilaj+Circle+Ahmedabad",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM IST"
  }
];
