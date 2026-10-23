import { Navbar } from "@/components/Navbar";
import { Associates } from "@/components/Associates";
import { LeadGen } from "@/components/LeadGen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Firm",
  description: "Learn about Kadivar & Associates, founded by CA Irfan Kadivar, providing Chartered Accountancy and tax advisory in Rajkot, Gujarat.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10">
      <Navbar />
      <div className="pt-24">
        <Associates />
      </div>
      <LeadGen />
    </main>
  );
}
