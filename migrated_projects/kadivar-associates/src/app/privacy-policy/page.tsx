import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and DPDP Act 2023 compliance notice for Kadivar & Associates.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10">
      <Navbar />
      <article className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-400">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-12 text-white">Privacy Policy.</h1>
        
        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif italic text-white mb-4">Introduction</h2>
            <p>This Privacy Policy explains how Kadivar & Associates collects, uses, and protects your personal data in compliance with India's Digital Personal Data Protection (DPDP) Act, 2023.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif italic text-white mb-4">Data We Collect</h2>
            <p>We collect personal information necessary to provide professional accounting, tax, and audit services. This may include PAN, Aadhaar, financial records, bank statements, and contact details.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif italic text-white mb-4">Why We Collect Data</h2>
            <p>Your data is processed strictly for regulatory compliance, statutory filings (Income Tax, GST, ROC), and professional advisory as mandated by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif italic text-white mb-4">Data Retention</h2>
            <p>We retain client data for a minimum period of 8 years as required under the Income Tax Act, 1961 and the Companies Act, 2013, after which it is securely destroyed unless required for ongoing litigation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif italic text-white mb-4">Your Rights & Contact</h2>
            <p>Under the DPDP Act, you have the right to request access, correction, or erasure of your data (subject to statutory retention mandates). Contact our Data Protection Officer at info@kadivar.co for requests.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
