import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface PartnerProfile {
  id: string;
  name: string;
  role: string;
  credentials: string;
  specialty: string;
  summary: string;
  highlights: string[];
  popupTag: string;
  popupColor: string;
  image: string;
  activeBg: string;
  accentColor: string;
  badgeBg: string;
  whatsappMsg: string;
  linkedin?: string;
}

const PARTNERS: PartnerProfile[] = [
  {
    id: "harsh-manek",
    name: "CA Harsh Manek",
    role: "FOUNDER & MANAGING PARTNER",
    credentials: "B.Com, FCA, DISA (ICAI)",
    specialty: "Direct Taxation, Scrutiny Assessments & Project Finance",
    summary: "Fellow Chartered Accountant with 10+ years steering complex corporate tax litigations, business restructuring, and multi-crore CMA bank financing across Gujarat.",
    highlights: [
      "Direct Tax Scrutiny, Search & CIT Appeals Representation",
      "Corporate Advisory & Business Structuring since 2016",
      "Credit Monitoring Arrangement (CMA) Data for Working Capital Limits",
    ],
    popupTag: "Direct Tax & Corporate Strategist",
    popupColor: "bg-[#e11d48] text-white shadow-[0_8px_24px_rgba(225,29,72,0.45)]",
    image: "/harsh_hero_2k.jpeg",
    activeBg: "from-[#047857] via-[#065f46] to-[#022c22]",
    accentColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    whatsappMsg: "Hello CA Harsh, I'd like to consult regarding tax planning and corporate advisory.",
    linkedin: "https://www.linkedin.com/in/harshmanek/",
  },
  {
    id: "nilam-manek",
    name: "CA Nilam Manek",
    role: "PARTNER",
    credentials: "B.Com., FCA",
    specialty: "Bank Audits, Corporate Finance & Direct / Indirect Taxation",
    summary: "Fellow Chartered Accountant with vast leadership in corporate finance, accounts, audit, and comprehensive direct & indirect taxation, with specialized mastery in multi-bank audits.",
    highlights: [
      "Vast experience in Corporate Finance, Accounts, Audit and Direct & Indirect Taxation",
      "Conducted extensive Stock Audits of various commercial and cooperative banks",
      "Deep expertise in Statutory, Branch, Revenue, and Concurrent Bank Audits",
    ],
    popupTag: "Bank Audits & Corporate Finance",
    popupColor: "bg-[#d97706] text-white shadow-[0_8px_24px_rgba(217,119,6,0.45)]",
    image: "/nilammanek.jpg",
    activeBg: "from-[#b45309] via-[#92400e] to-[#451a03]",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    whatsappMsg: "Hello CA Nilam, I would like to consult regarding bank audit and corporate finance.",
  },
];

const SPRING_CARD = {
  type: "spring",
  stiffness: 450,
  damping: 30,
  mass: 0.8,
} as const;

export default function InteractiveTeamShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Active person is the hovered card if hovered, otherwise the selected card
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activePartner = PARTNERS[activeIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? PARTNERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === PARTNERS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="team" className="py-28 px-6 max-w-6xl mx-auto relative overflow-hidden border-t border-white/5">
      {/* Dynamic ambient color glow matching hovered/active partner */}
      <motion.div
        key={`ambient-${activePartner.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] blur-[150px] pointer-events-none rounded-full"
        style={{
          background: activeIndex === 0 ? "#059669" : "#d97706",
        }}
      />

      {/* Header Row with Eyebrow, Title & Prev/Next Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 relative z-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400">
              Behind The Firm
            </span>
            {/* Decorative wavy flourish */}
            <svg
              className="w-12 h-2 text-emerald-400/60"
              viewBox="0 0 48 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4C5 1 7 7 11 4C15 1 17 7 21 4C25 1 27 7 31 4C35 1 37 7 41 4C45 1 47 7 47 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Poppins'] font-extrabold text-white tracking-tight">
            Partners in Leadership
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handlePrev}
            aria-label="Previous partner"
            className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next partner"
            className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dynamic Profile Information Area (Updates smoothly on Hover or Click) */}
      <div className="min-h-[160px] md:min-h-[140px] mb-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePartner.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[var(--background)] border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`font-mono text-xs uppercase tracking-widest font-bold ${activePartner.accentColor}`}>
                  {activePartner.role}
                </span>
                <span className="text-white/30 text-xs">·</span>
                <span className="font-mono text-xs text-white/70 font-semibold">{activePartner.credentials}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-['Poppins'] font-bold text-white mb-3 tracking-tight">
                {activePartner.name}
              </h3>
              <p className="text-white/80 text-sm sm:text-[15px] font-sans max-w-3xl leading-relaxed mb-4">
                {activePartner.summary}
              </p>

              {/* Exact Credentials List from Prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                {activePartner.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-white/75 font-sans">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${activePartner.accentColor}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Connect Action Link */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 flex-shrink-0 pt-2">
              <a
                href={`https://wa.me/919033440008?text=${encodeURIComponent(activePartner.whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
              >
                Consult on WhatsApp <ArrowUpRight className="w-4 h-4" />
              </a>
              {activePartner.linkedin && (
                <a
                  href={activePartner.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  LinkedIn Profile <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2-Partner Interactive Cards with Video-Style Colourful Popup on Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {PARTNERS.map((partner, index) => {
          const isCurrentActive = activeIndex === index;

          return (
            <motion.div
              key={partner.id}
              layout
              transition={SPRING_CARD}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
              className={`relative cursor-pointer rounded-[32px] overflow-hidden border transition-all duration-500 h-[480px] sm:h-[520px] select-none flex flex-col justify-end group ${
                isCurrentActive
                  ? "border-white/30 shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-2 ring-white/15"
                  : "border-white/10 bg-[var(--background)] hover:border-white/30"
              }`}
            >
              {/* Vibrant Colored Background Layer (Activates instantly on Hover / Active like in the video) */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${partner.activeBg} transition-opacity duration-500 ${
                  isCurrentActive ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Portrait Image (Desaturated by default, pops into crisp radiant full color on Hover) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505]">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className={`w-full h-full object-cover object-top transition-all duration-700 ${
                    isCurrentActive
                      ? "grayscale-0 scale-100 opacity-100"
                      : "grayscale contrast-125 scale-105 opacity-80 group-hover:opacity-90"
                  }`}
                />
              </div>

              {/* Ambient Vignette Gradients */}
              <div className="absolute inset-0 gradient-mask-t-team pointer-events-none" />

              {/* COLOURFUL POPUP BADGE WHEN HOVERING (Video signature interaction: bright colourful pop pill) */}
              <div className="absolute top-6 left-6 right-6 z-30 flex justify-start pointer-events-none">
                <AnimatePresence>
                  {isCurrentActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`px-4 py-2.5 rounded-full flex items-center gap-2.5 font-sans font-bold text-xs tracking-wide ${partner.popupColor}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span className="drop-shadow-sm">{partner.popupTag}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Identification Banner */}
              <div className="relative z-20 p-6 sm:p-8 gradient-mask-t-team">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className={`font-mono text-[11px] uppercase tracking-widest font-semibold ${isCurrentActive ? partner.accentColor : "text-white/40"}`}>
                        {partner.role}
                      </p>
                      <span className="text-white/20 text-xs">·</span>
                      <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                        {partner.credentials}
                      </p>
                    </div>
                    <h4 className="font-['Poppins'] font-extrabold text-white text-2xl sm:text-3xl tracking-tight">
                      {partner.name}
                    </h4>
                    <p className="text-white/60 text-xs sm:text-sm font-sans mt-1">
                      {partner.specialty}
                    </p>
                  </div>

                  {/* Active Indicator Pip */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrentActive
                        ? "bg-white text-black scale-100 shadow-lg"
                        : "border border-white/20 text-white/30 scale-90"
                    }`}
                  >
                    {isCurrentActive ? (
                      <CheckCircle2 className="w-5 h-5 text-black fill-white" />
                    ) : (
                      <span className="text-xs font-mono">{index + 1}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Subtext */}
      <div className="mt-8 flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest relative z-10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Hover or click to inspect partner credentials
        </span>
        <span>{activeIndex + 1} of {PARTNERS.length} Partners</span>
      </div>
    </section>
  );
}
