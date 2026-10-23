"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { SpotlightPortrait } from "@/components/motion/SpotlightPortrait";
import { TextReveal, BlockReveal } from "@/components/motion/TextReveal";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Parallax } from "@/components/motion/Parallax";

export function Associates() {
  return (
    <section id="about" className="py-24 px-6 relative max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Left: Associate Image */}
        <Parallax distance={36} className="relative w-full lg:w-5/12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111]"
          >
            <SpotlightPortrait
              src="/partner-portrait.jpeg"
              alt="CA Irfan Kadivar"
              className="h-full w-full"
            />
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
              <a 
                href="https://www.linkedin.com/in/ca-irfan-kadivar-0b7431190/" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                title="LinkedIn Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-gray-300">
                Rajkot HQ
              </div>
            </div>
          </motion.div>

        </Parallax>

        {/* Right: Content */}
        <div className="w-full lg:w-7/12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
            <ScrambleText
              text="Founder & Principal Partner"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400"
            />
          </div>

          <TextReveal
            text="CA Irfan Kadivar"
            as="h2"
            className="mb-2 block font-serif text-4xl italic tracking-tight md:text-6xl"
            display
          />
          <BlockReveal delay={0.1}>
            <p className="mb-3 font-sans text-xl font-medium text-[#e6ff00]">{siteConfig.partnerRole}</p>
          </BlockReveal>
          {siteConfig.icaiMembershipNo && <p className="text-sm font-mono text-gray-500 mb-6">ICAI Membership No: {siteConfig.icaiMembershipNo}</p>}

          <div className="space-y-6 text-gray-400 text-lg leading-relaxed text-balance">
            <p>
              CA Irfan Kadivar is a practicing Chartered Accountant with over 15 years of experience in direct tax litigation, GST compliance, and corporate financial advisory. He appears as an authorised representative before the Income Tax authorities and GST authorities.
            </p>
            <p>
              Based in Rajkot, Gujarat, his practice represents proprietorships, partnerships, and private limited companies across Gujarat in taxation matters, statutory audits, and regulatory compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a 
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-[#e6ff00]" />
              {siteConfig.phone}
            </a>
            <a 
              href={`https://wa.me/${siteConfig.phoneRaw.replace('+', '')}?text=Hello%20CA%20Irfan%20Kadivar`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#25D366] text-sm font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Direct
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10">
            {[
              { label: "Corporate Tax", value: "Practice Area" },
              { label: "Direct Tax & GST", value: "Litigation" },
              { label: "Statutory Audits", value: "Practice Area" },
              { label: "Experience", value: "15+ Years" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-white font-medium text-lg mb-1">{stat.value}</p>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
