import { SERVICES_DATA } from "@/lib/services-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, FileText, Calendar, HelpCircle } from "lucide-react";
import Link from "next/link";
import { ServiceEnquiryForm } from "@/components/ServiceEnquiryForm";
import type { Metadata } from 'next';

export function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.title} in Rajkot`,
    description: service.desc,
  };
}

export default async function ServicePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen selection:bg-white/10 bg-[#050505]">
      <Navbar />
      
      <article className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <Link href="/#services" className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>

        <h1 className="text-5xl md:text-7xl font-serif italic mb-6">{service.title}</h1>
        <p className="text-xl md:text-2xl text-gray-400 font-sans tracking-tight leading-relaxed mb-6">
          {service.desc}
        </p>
        <p className="text-lg text-gray-500 mb-16">
          <strong className="text-gray-300">Applies to:</strong> {service.appliesTo}
        </p>

        {/* Requirements and Due Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
            <h3 className="flex items-center gap-2 font-serif italic text-2xl mb-6">
              <FileText className="text-[#e6ff00]" /> Documents Required
            </h3>
            <ul className="space-y-4">
              {service.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
            <h3 className="flex items-center gap-2 font-serif italic text-2xl mb-6">
              <Calendar className="text-[#e6ff00]" /> Statutory Due Dates
            </h3>
            <ul className="space-y-4">
              {service.dueDates.map((date, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e6ff00]/50 mt-2 shrink-0" />
                  {date}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="mb-24">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[#e6ff00] mb-8 pb-4 border-b border-white/10">Standard Process</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {service.sop.map((phase, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0a0a0a] text-[#e6ff00] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="font-mono text-sm">{i + 1}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="font-medium text-white mb-2">{phase.step}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{phase.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-24">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[#e6ff00] mb-8 pb-4 border-b border-white/10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {service.faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                <h4 className="flex items-start gap-3 font-medium text-white mb-3">
                  <HelpCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  {faq.question}
                </h4>
                <p className="text-gray-400 pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12" id="enquire">
          <h2 className="text-3xl font-serif italic mb-2">Service Enquiry</h2>
          <p className="text-gray-400 mb-8">Send us your details and we will reach out regarding {service.title}.</p>
          <ServiceEnquiryForm serviceTitle={service.title} />
        </div>
      </article>
    </main>
  );
}
