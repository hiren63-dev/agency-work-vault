import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and engagement governing Kadivar & Associates website and client agreements.",
};

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10">
      <Navbar />
      <article className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-400">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-12 text-white">Terms of Service.</h1>
        <div className="space-y-8 leading-relaxed">
          <p>By accessing this website, you acknowledge and agree to these Terms of Service.</p>
          <p>This website is not intended to solicit clients or advertise services, in strict compliance with the guidelines of the Institute of Chartered Accountants of India (ICAI).</p>
          <p>Any engagement of professional services will be governed solely by a separate written Letter of Engagement detailing the scope, responsibilities, and terms of the professional relationship.</p>
        </div>
      </article>
    </main>
  );
}
