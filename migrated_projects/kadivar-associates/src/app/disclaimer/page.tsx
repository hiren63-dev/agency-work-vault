import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer & ICAI Notice",
  description: "ICAI non-solicitation disclaimer and regulatory compliance notice for Kadivar & Associates.",
};

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10">
      <Navbar />
      <article className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-400">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-12 text-white">Disclaimer.</h1>
        <div className="space-y-8 leading-relaxed">
          <p>The rules of the Institute of Chartered Accountants of India (ICAI) prohibit chartered accountants from soliciting work or advertising in any manner.</p>
          <p>By accessing or navigating this website, you acknowledge that you are seeking factual information about Kadivar & Associates of your own accord and that there has been no form of solicitation, advertisement, or inducement by the firm or its partners.</p>
          <p>The information provided on this website is for educational and informational purposes only and does not constitute formal accounting, tax, legal, or financial advice. Kadivar & Associates accepts no liability for any action taken based on the general information published herein.</p>
        </div>
      </article>
    </main>
  );
}
