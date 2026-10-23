"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 26, mass: 1 }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        isScrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "bg-transparent border-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="font-serif italic text-2xl tracking-tight text-white">
          Kadivar & Associates
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight text-gray-400">
        <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link href="/how-we-work" className="hover:text-white transition-colors">How We Work</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
      </nav>

      <div className="flex items-center gap-4">
        <a 
          href={`https://wa.me/${siteConfig.phoneRaw.replace('+', '')}?text=Hello%20CA%20Irfan%20Kadivar`}
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#25D366] hover:text-white transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          WhatsApp
        </a>
        <Link 
          href="/client-portal"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 group relative overflow-hidden text-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 flex items-center gap-2">
            Client Portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>
    </motion.header>
  );
}
