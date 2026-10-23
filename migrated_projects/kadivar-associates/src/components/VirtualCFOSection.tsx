"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, FileSpreadsheet, Landmark, ShieldCheck } from "lucide-react";

const SUPPORT_AREAS = [
  {
    icon: CalendarCheck,
    title: "Statutory calendar tracked for you",
    body: "GST returns, TDS payments, advance tax instalments and ROC filings are diarised against your entity type so deadlines are met without you having to remember them.",
  },
  {
    icon: FileSpreadsheet,
    title: "Monthly accounts and MIS",
    body: "Bookkeeping maintained in Tally or Zoho, with monthly management reports showing turnover, receivables, payables and tax position.",
  },
  {
    icon: Landmark,
    title: "Banking and finance documentation",
    body: "CMA data, projections and financial statements prepared for working capital limits, term loans and renewals with your bank.",
  },
  {
    icon: ShieldCheck,
    title: "Representation when required",
    body: "Where a notice, scrutiny or assessment arises on work we have handled, we appear as your authorised representative before the Income Tax and GST authorities.",
  },
];

export function VirtualCFOSection() {
  return (
    <section id="support" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            Ongoing Support
          </span>
          <h2 className="mt-4 font-serif text-4xl italic tracking-tight text-white md:text-5xl">
            Beyond the annual filing.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-400">
            Many businesses need a finance function but not a full-time finance
            team. We work alongside owners through the year rather than only at
            year end.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-2">
          {SUPPORT_AREAS.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-[#050505] p-8"
              >
                <Icon className="mb-5 h-5 w-5 text-[#e6ff00]" aria-hidden="true" />
                <h3 className="mb-3 text-lg font-medium text-white">{area.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{area.body}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/services/management-consultancy"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
          >
            See what&rsquo;s involved
          </Link>
        </div>
      </div>
    </section>
  );
}
