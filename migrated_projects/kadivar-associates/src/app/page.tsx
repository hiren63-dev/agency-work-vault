"use client";

import { Navbar } from "@/components/Navbar";
import { LeadGen } from "@/components/LeadGen";
import { VirtualCFOSection } from "@/components/VirtualCFOSection";
import { StickyServices } from "@/components/StickyServices";
import { Associates } from "@/components/Associates";
import { FAQ } from "@/components/FAQ";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TextReveal, BlockReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { LedgerBackdrop } from "@/components/motion/LedgerBackdrop";
import { DeadlineTicker } from "@/components/DeadlineTicker";
import { ScrollRail } from "@/components/motion/ScrollRail";
import { EASE_OUT } from "@/lib/motion";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-white/10">
      <Navbar />
      <ScrollRail />

      {/* Hero Section */}
      <section
        id="top"
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-40 text-center md:pb-32 md:pt-52"
      >
        <LedgerBackdrop />

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          <DeadlineTicker />

          <h1 className="mb-6 text-6xl font-sans font-medium leading-[1.02] tracking-[-0.03em] text-white md:text-8xl">
            <TextReveal text="Audit. Tax. GST." as="span" className="block" display />
            <TextReveal
              text="Handled."
              as="span"
              className="block font-serif italic text-[#e6ff00]"
              display
              delay={0.14}
            />
          </h1>

          <BlockReveal delay={0.34} className="mb-10">
            <p className="max-w-2xl text-balance font-sans text-lg leading-relaxed text-gray-400 md:text-xl">
              Kadivar &amp; Associates are Chartered Accountants handling statutory
              audit, tax compliance and corporate advisory for businesses and
              individuals across India — from our offices in Rajkot, Morbi and Wankaner.
            </p>
          </BlockReveal>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.55 }}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <MagneticButton
              href="/#services"
              cursorLabel="Browse"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium tracking-tight text-black transition-colors hover:bg-[#e6ff00]"
            >
              <span className="flex items-center gap-2">
                View Services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </MagneticButton>
            <MagneticButton
              href="/about"
              cursorLabel="Read"
              className="link-underline px-8 py-4 font-medium tracking-tight text-gray-400 transition-colors hover:text-white"
            >
              About the Firm
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Associates />

      <StickyServices />

      <VirtualCFOSection />

      <FAQ />

      <LeadGen />
    </main>
  );
}
