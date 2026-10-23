import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work",
  description: "Our standard 5-step client engagement process for accounting, statutory audit, and tax advisory services.",
};

export default function HowWeWorkPage() {
  return (
    <main className="min-h-screen selection:bg-white/10 bg-[#050505]">
      <Navbar />
      
      <article className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-400">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-white">How We Work.</h1>
        <p className="text-xl md:text-2xl font-sans tracking-tight leading-relaxed mb-16">
          Our standard engagement process for accounting, audit, and tax advisory services.
        </p>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {[
            {
              title: "1. Initial Consultation",
              desc: "We discuss your business structure, statutory requirements, and current financial processes to identify the scope of work."
            },
            {
              title: "2. Document Collection",
              desc: "We provide a secure checklist of required documents (PAN, bank statements, previous filings, etc.) and establish a timeline for submission."
            },
            {
              title: "3. Execution & Processing",
              desc: "Our team processes the financial data, computes liabilities, and prepares draft reports or returns in accordance with relevant acts (Income Tax Act, Companies Act, etc.)."
            },
            {
              title: "4. Review & Approval",
              desc: "We share draft computations and reports with you for review before any final submission is made to statutory authorities."
            },
            {
              title: "5. Filing & Reporting Cadence",
              desc: "Upon your approval, we file the returns/reports. For ongoing retainers, we establish a monthly or quarterly reporting cadence for management information."
            }
          ].map((step, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0a0a0a] text-[#e6ff00] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="font-mono text-sm">{i + 1}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
                <h3 className="font-medium text-white mb-3 text-xl">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
