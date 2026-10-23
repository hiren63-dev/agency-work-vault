"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SERVICES_DATA } from "@/lib/services-data";

export function StickyServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="services" className="relative z-20 py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-4">Core Competencies.</h2>
          <p className="text-gray-400 text-lg">What we handle for businesses and individuals across Gujarat.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start" ref={containerRef}>
          {/* Left: Sticky Display */}
          <div className="hidden lg:block lg:w-1/2 sticky top-40 h-[600px] bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505] flex items-center justify-center p-12">
               <div className="relative w-full h-full flex items-center justify-center">
                 {/* Abstract Geometry */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                   className="absolute w-[300px] h-[300px] border border-white/5 rounded-full"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                   className="absolute w-[200px] h-[200px] border border-white/10 rounded-full border-dashed"
                 />
                 <div className="absolute w-[100px] h-[100px] bg-[#e6ff00]/10 rounded-full blur-2xl" />
                 
                 <div className="z-10 text-center">
                    <p className="font-serif italic text-3xl text-gray-300">Precision.</p>
                    <p className="font-mono text-[10px] text-gray-500 tracking-widest mt-2 uppercase">Rajkot &amp; Gujarat</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right: Scrolling Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-12 pb-32">
            {SERVICES_DATA.map((service, i) => (
              <ServiceCard key={i} service={service} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className="bg-[#050505] border-b border-white/10 pb-12 group"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <Link href={`/services/${service.slug}`} className="flex items-center justify-between w-full group/link">
          <h3 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-white group-hover/link:text-[#e6ff00] transition-colors">{service.title}</h3>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/link:bg-white group-hover/link:border-white transition-all">
             <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover/link:text-black" />
          </div>
        </Link>
      </div>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">{service.desc}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
        {service.features.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 flex-shrink-0 group-hover:bg-[#e6ff00]/50 transition-colors" />
            <span className="text-sm font-mono text-gray-400">{feature}</span>
          </div>
        ))}
      </div>
      
      <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-[#e6ff00] hover:text-white transition-colors">
        See what&rsquo;s involved <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
