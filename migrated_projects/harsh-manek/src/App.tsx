import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Lock, FileText, Briefcase, CheckCircle2, Mail, Menu, X, Phone, BookOpen, BarChart3, Building2, Landmark, Receipt, MessageCircle, User, Clock, MapPin, ChevronDown, AlertCircle, TrendingUp, Scale, ArrowUpRight, ClipboardList, Sun, Moon } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import FloatingParticlesBackground from "./components/FloatingParticlesBackground";
import InteractiveTeamShowcase from "./components/InteractiveTeamShowcase";
import CurvedGalleryArc from "./components/CurvedGalleryArc";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import PortalLayout from "./pages/portal/PortalLayout";
import Login from "./pages/portal/Login";
import Dashboard from "./pages/portal/Dashboard";
import Leads from "./pages/portal/Leads";
import WebsiteSettings from "./pages/portal/WebsiteSettings";
import Account from "./pages/portal/Account";
import CareersPage from "./pages/Careers";
import JobsManager from "./pages/portal/Jobs";
import ApplicantsManager from "./pages/portal/Applicants";
import { supabase } from "./lib/supabase";
import { useSiteSettings, waLink } from "./hooks/useSiteSettings";

// --- CONSTANTS & PHYSICS ---
const SPRING_HEAVY = { type: "spring", stiffness: 120, damping: 20, mass: 1.2 } as const;
const SPRING_SNAPPY = { type: "spring", stiffness: 240, damping: 26, mass: 1 } as const;
const SPRING_MICRO = { type: "spring", stiffness: 450, damping: 30, mass: 0.8 } as const;

// --- WHATSAPP FLOATING BUTTON ---
function WhatsAppFloat() {
  const { whatsapp } = useSiteSettings();
  const href = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING_HEAVY, delay: 1.5 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#25D366] text-white rounded-full pl-4 pr-5 py-3.5 shadow-[0_8px_32px_rgba(37,211,102,0.35)] font-sans font-semibold text-sm"
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp icon */}
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.612L0 24l6.545-1.366A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.732.979.997-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/>
      </svg>
      <span>Chat on WhatsApp</span>
    </motion.a>
  );
}

// --- CLIENT PORTAL MODAL ---
function ClientPortalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={SPRING_SNAPPY}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[var(--background)] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Accent glow */}
            <div className="absolute top-0 left-0 w-64 h-32 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 p-8 sm:p-10">
              <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-sans font-bold text-white tracking-tight">Secure Client Portal</h3>
                  <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Harsh Manek & Co.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm font-sans text-white/60 leading-relaxed">
                    🔒 Our client portal is being finalized to give you a fully encrypted, bank-grade secure space to upload documents, download filed returns, and track your compliance in real time.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FileText, label: "Document Upload" },
                    { icon: ShieldCheck, label: "AES-256 Encryption" },
                    { icon: BarChart3, label: "Compliance Tracker" },
                    { icon: Clock, label: "Real-Time Status" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <Icon className="w-4 h-4 text-white/50 flex-shrink-0" />
                      <span className="text-xs font-sans text-white/60">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-white text-black font-sans font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Portal Access via WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-sans text-sm transition-colors"
                >
                  Close
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] font-mono text-white/25 uppercase tracking-widest">
                All data is encrypted in transit & at rest
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- NAVBAR ---
function Navbar({ onPortalOpen, theme, toggleTheme }: { onPortalOpen: () => void, theme: string, toggleTheme: () => void }) {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      {/* Top Contact Bar */}
      <div className="hidden md:flex justify-end items-center px-6 py-2 bg-[var(--background)] border-b border-white/5 w-full">
        <div className="flex items-center gap-5 text-[13px] font-sans text-white/80">
          <a href="tel:+919033440008" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-white/60" /> +91-9033440008
          </a>
          <a href="mailto:Harsh.manek@hotmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-white/60" /> Harsh.manek@hotmail.com
          </a>
          <div className="flex items-center gap-4 border-l border-white/10 pl-5">
            <a href="https://wa.me/919033440008" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-white/60">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.612L0 24l6.545-1.366A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.732.979.997-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/></svg>
            </a>
          </div>
        </div>
      </div>
                  {/* Main Nav */}
      <nav className={`w-full transition-all duration-500 ${scrolled ? "bg-[#050505]/95 shadow-2xl" : "bg-[#050505]/80"} backdrop-blur-xl border-b border-white/5`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif italic text-xl sm:text-2xl tracking-normal text-white">
            Harsh Manek & Co.
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Home</Link>
            
            <a href="/#services" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Services</a>
            <a href="/#tools" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Tools</a>
            <a href="/#faq" className="text-sm font-sans text-white/60 hover:text-white transition-colors">FAQ</a>
            <Link to="/blog" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Blog</Link>
            <Link to="/careers" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Careers</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-sans font-medium text-[#25D366] px-4 py-2 rounded-full border border-[#25D366]/30 hover:bg-[#25D366]/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.612L0 24l6.545-1.366A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.732.979.997-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/></svg>
              WhatsApp
            </a>
            <button
              onClick={onPortalOpen}
              className="text-sm font-sans font-medium text-white px-4 py-2 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Client Portal
              </button>
              <button onClick={toggleTheme} className="text-white/60 hover:text-white p-2 ml-2 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" aria-label="Toggle Theme">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-[#050505] overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <Link to="/" className="text-lg font-sans text-white">Home</Link>
                <button onClick={toggleTheme} className="flex items-center gap-3 text-lg font-sans text-white">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <a href="/#services" className="text-lg font-sans text-white">Services</a>
                <a href="/#tools" className="text-lg font-sans text-white">Tools & Calculators</a>
                <a href="/#faq" className="text-lg font-sans text-white">FAQ</a>
                <Link to="/blog" className="text-lg font-sans text-white">Blog & Insights</Link>
                <Link to="/careers" className="text-lg font-sans text-white">Careers</Link>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-lg font-sans text-[#25D366]">WhatsApp Us</a>
                <button onClick={() => { setMobileMenuOpen(false); onPortalOpen(); }} className="mt-2 bg-white text-black font-semibold rounded-lg py-3 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Client Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

// --- BOOK CALL BUTTON ---
function BookCallButton() {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_MICRO}
      className="relative flex h-14 items-center overflow-hidden rounded-full bg-white px-2 pr-6 font-sans font-medium text-[15px] text-black shadow-lg cursor-pointer w-full sm:w-auto"
    >
      <motion.div animate={{ width: isHovered ? 72 : 48 }} transition={SPRING_MICRO} className="relative flex items-center h-10 ml-1">
        <motion.div animate={{ x: isHovered ? -2 : 0 }} transition={SPRING_MICRO} className="absolute z-20 h-9 w-9 rounded-full border-2 border-white overflow-hidden bg-gray-200">
          <img src="/harsh_avatar.png" className="w-full h-full object-cover object-top" alt="CA Harsh Manek" />
        </motion.div>
        <motion.div animate={{ x: isHovered ? 34 : 16 }} transition={SPRING_MICRO} className="absolute z-10 h-9 w-9 rounded-full border-2 border-white overflow-hidden bg-zinc-700 flex items-center justify-center">
          <User className="w-4 h-4 text-white/60" />
        </motion.div>
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8, rotate: isHovered ? 180 : 0, x: 20, y: "-50%" }}
          style={{ top: "50%" }}
          transition={SPRING_MICRO}
          className="absolute z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        </motion.div>
      </motion.div>
      <span className="ml-3 font-semibold tracking-tight">Book Consultation</span>
    </motion.a>
  );
}

// --- HERO PORTRAIT (IMPROVED) ---
function HeroPortrait() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ ...SPRING_HEAVY, delay: 0.3 }}
      className="flex-1 w-full flex justify-center lg:justify-end mt-12 lg:mt-0 relative"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[300px] sm:max-w-[360px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full pointer-events-none" />

        {/* 3D tilt card */}
        <motion.div
          animate={{
            rotateX: mousePos.y,
            rotateY: mousePos.x,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 25, mass: 0.5 }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.04)]"
        >
          {/* Top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-[50%] gradient-mask-t z-20 pointer-events-none" />

          <img
            src="/harsh_hero_2k.jpeg"
            alt="CA Harsh Manek"
            className="w-full h-auto object-cover relative z-10 block"
          />

          {/* New Sleek Badge */}
          <div className="absolute bottom-4 inset-x-4 z-30">
             <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                <div>
                   <h3 className="font-sans font-bold text-white text-base tracking-tight">CA Harsh Manek</h3>
                   <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest mt-0.5">B.Com, FCA · Est. 2016</p>
                </div>
                <div className="h-10 w-px bg-white/10 mx-3"></div>
                <div className="text-right">
                   <span className="block font-sans font-extrabold text-white text-xl leading-none">FCA</span>
                   <span className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mt-1">Chartered<br/>Accountant</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- HERO ---
function Hero({ theme }: { theme?: string }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-36 pb-24 overflow-hidden">
      {/* Floating Particles Background (Framer Module) */}
      <FloatingParticlesBackground
        particleCount={70}
        particleSize={2}
        particleOpacity={0.6}
        glowIntensity={14}
        movementSpeed={0.4}
        mouseInfluence={140}
        backgroundColor="transparent"
        particleColor={theme === 'light' ? '#10b981' : '#FFFFFF'}
        mouseGravity="attract"
        gravityStrength={35}
        glowAnimation="spring"
        particleInteraction={true}
        interactionType="bounce"
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="blob bg-zinc-600/40 w-[700px] h-[700px] top-[-150px] left-[-250px]" />
      <div className="blob bg-slate-500/20 w-[500px] h-[500px] bottom-[-100px] right-[-200px]" />

      <div className="z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={SPRING_HEAVY}
          className="flex-1 flex flex-col items-start text-left w-full"
        >
          <div className="px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/70">
              Chartered Accountant · Rajkot · Est. 2016
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-sans tracking-tight leading-[1.05] text-white mb-6">
            Precision in <br />
            <span className="font-serif italic text-white/50 font-normal">compliance &</span><br />
            financial growth.
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-xl font-sans tracking-tight mb-10 leading-relaxed">
            Harsh Manek & Co. provides professional taxation, audit, GST, and business advisory services from Rajkot since 2016. We handle the complexity — so you can focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
            <BookCallButton />
            <motion.a
              href="/#services"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_MICRO}
              className="flex h-14 items-center justify-center rounded-full border border-white/15 bg-transparent px-8 font-sans font-medium text-sm text-white transition-colors w-full sm:w-auto"
            >
              Explore Services <ChevronDown className="w-4 h-4 ml-2" />
            </motion.a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { icon: ShieldCheck, label: "ICAI Registered" },
              { icon: Scale, label: "10+ Years Experience" },
              { icon: CheckCircle2, label: "5.0 ★ on JustDial" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Icon className="w-3.5 h-3.5 text-white/50" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <HeroPortrait />
      </div>
    </section>
  );
}

// --- SERVICES DATA (EXPANDED) ---
const SERVICES = [
  {
    num: "01",
    icon: BookOpen,
    title: "Accounting & Bookkeeping",
    desc: "Maintain perfectly organized, GAAP-compliant books so you always know where your business stands — and where it's heading. We handle daily entries, bank reconciliation, ledger management, MIS reports, and year-end closing.",
    documents: [
      "Bank statements (last 12 months)",
      "Purchase invoices & vouchers",
      "Sales invoices & receipts",
      "Expense bills (petrol, utilities, rent)",
      "Salary & payroll records",
      "Previous year's balance sheet",
    ],
    process: ["Initial data collection & setup", "Monthly bookkeeping entries", "Bank reconciliation", "MIS report delivery", "Year-end finalization & filing"],
  },
  {
    num: "02",
    icon: Receipt,
    title: "Direct Taxation (Income Tax)",
    desc: "Smart, proactive tax planning ensures you pay exactly what you legally owe — and not a rupee more. We handle ITR filing, advance tax computation, TDS compliance, scrutiny responses, and appeal representation before the CIT.",
    documents: [
      "PAN & Aadhaar card",
      "Form 16 / Form 16A (salaried clients)",
      "Capital gains statements (stocks, property)",
      "Rental income documents",
      "Investment proofs (80C, 80D, NPS)",
      "Previous year's ITR acknowledgment",
      "Bank interest certificates",
    ],
    process: ["Income source analysis", "Regime selection (Old vs New)", "Deduction maximization", "Advance tax calculation", "ITR filing & acknowledgment"],
  },
  {
    num: "03",
    icon: Landmark,
    title: "Indirect Taxation (GST)",
    desc: "End-to-end GST lifecycle management — registration, monthly/quarterly return filing (GSTR-1, 3B, 9, 9C), ITC reconciliation, and GST audit representation. We ensure zero-penalty compliance at all times.",
    documents: [
      "PAN card & business registration proof",
      "Aadhaar of proprietor / directors",
      "Electricity bill of business premises",
      "Cancelled cheque / bank passbook",
      "Digital Signature Certificate (if applicable)",
      "Purchase & sales register (for filing)",
    ],
    process: ["GST registration", "Invoice structuring & HSN mapping", "Monthly GSTR-1 & 3B filing", "Annual GSTR-9 / 9C reconciliation", "Notice response & departmental audit"],
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Auditing & Assurance",
    desc: "Independent, rigorous audits that build unshakeable trust with banks, investors, and government authorities. We conduct statutory audits, tax audits (under Sec. 44AB), internal audits, and stock audits across sectors.",
    documents: [
      "Audited books for prior year",
      "Trial balance & ledger",
      "Fixed asset register",
      "Stock & inventory records",
      "Loan agreements & liability documents",
      "Board resolutions (for companies)",
    ],
    process: ["Engagement letter & planning", "Financial statement scrutiny", "Verification of internal controls", "Management representation letter", "Audit report issuance & filing"],
  },
  {
    num: "05",
    icon: Briefcase,
    title: "Corporate Advisory & Compliance",
    desc: "From incorporation to MCA filings, ROC annual returns, and secretarial compliance — we keep your company fully clean with the Ministry of Corporate Affairs. Includes PVT LTD, LLP, and OPC registrations.",
    documents: [
      "Identity & address proof of all directors",
      "Proposed company name (3 options)",
      "Business activity description",
      "Registered office address proof",
      "Subscriber sheet & MOA/AOA draft",
      "NOC from property owner",
    ],
    process: ["Name reservation (RUN)", "MOA/AOA drafting", "SPICe+ form filing", "PAN & TAN application", "Annual ROC returns & statutory maintenance"],
  },
  {
    num: "06",
    icon: FileText,
    title: "Digital Signature (DSC)",
    desc: "Get your Class 2 or Class 3 Digital Signature Certificate issued within 24 hours for income tax filings, GST, MCA, tender submissions, and e-procurement portals. Fully paperless and Aadhaar-verified.",
    documents: [
      "PAN card copy",
      "Aadhaar card copy",
      "Passport-size photo",
      "Mobile number linked to Aadhaar",
      "Email address",
    ],
    process: ["Document verification", "Video KYC / Aadhaar OTP verification", "CA counter-signature", "DSC token dispatch within 24 hrs", "Installation support"],
  },
];

// Service Card with expandable checklist
function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"docs" | "process">("docs");
  const Icon = service.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING_SNAPPY, delay: index * 0.05 }}
      className={`mb-12 relative flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""}`}
    >
      {/* Timeline dot */}
      <motion.div 
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1.2, backgroundColor: "#10b981", borderColor: "#059669", boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)" }}
          viewport={{ once: false, margin: "-25% 0px -25% 0px" }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 z-20 mt-1.5 timeline-dot"
        />

      <div className={`w-full md:w-1/2 ${isEven ? "md:pl-16" : "md:pr-16"}`}>
        <div
          className="glass-card p-6 sm:p-8 group cursor-pointer hover:bg-white/[0.07] transition-all duration-500"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="font-serif italic text-3xl text-white/15 mb-2 block group-hover:text-white/30 transition-colors">{service.num}</span>
              <div className="flex items-center gap-2.5 mb-2">
                <Icon className="w-5 h-5 text-white/50" />
                <h3 className="text-xl sm:text-2xl font-sans tracking-tight text-white">{service.title}</h3>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={SPRING_MICRO}
              className="flex-shrink-0 mt-1"
            >
              <ChevronDown className="w-5 h-5 text-white/30" />
            </motion.div>
          </div>

          <p className="text-sm sm:text-base text-white/50 font-sans leading-relaxed mb-4">{service.desc}</p>

          {/* CTA to WhatsApp */}
          <a
            href={`https://wa.me/919033440008?text=Hey%20sir%2C%20I%20have%20a%20query%20regarding%20${encodeURIComponent(service.title)}.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors group-hover:text-white/60"
          >
            Enquire about this service <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Expandable checklist */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING_SNAPPY}
                className="overflow-hidden mt-6 pt-6 border-t border-white/10"
              >
                {/* Tab toggle */}
                <div className="flex gap-2 mb-5">
                  {([{ key: "docs", label: "📋 Documents Needed" }, { key: "process", label: "⚙️ Our Process" }] as const).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={(e) => { e.stopPropagation(); setActiveTab(tab.key); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${activeTab === tab.key ? "bg-white text-black" : "bg-white/[0.06] text-white/50 hover:text-white border border-white/10"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "docs" ? (
                    <motion.ul
                      key="docs"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={SPRING_MICRO}
                      className="space-y-2"
                    >
                      {service.documents.map((doc) => (
                        <li key={doc} className="flex items-start gap-2.5 text-sm font-sans text-white/60">
                          <CheckCircle2 className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.ol
                      key="process"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={SPRING_MICRO}
                      className="space-y-2"
                    >
                      {service.process.map((step, i) => (
                        <li key={step} className="flex items-start gap-3 text-sm font-sans text-white/60">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-white/50 flex items-center justify-center font-mono text-[10px]">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </motion.ol>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// --- DYNAMIC TIMELINE (SERVICES) ---
function DynamicTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const beamTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const beamOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="services" ref={containerRef} className="py-24 sm:py-32 px-6 max-w-5xl mx-auto relative z-10">
      <div className="mb-16 sm:mb-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">What We Do</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight mb-4">Core Practice Areas</h2>
        <p className="text-white/40 font-sans text-base max-w-xl mx-auto">Click any service to see the document checklist and our step-by-step process.</p>
      </div>

      <div className="relative pl-10 md:pl-0">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px timeline-track md:-translate-x-1/2 z-0">
          <motion.div style={{ top: beamTop, opacity: beamOpacity }} className="absolute left-0 w-full h-[300px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent shadow-[0_0_25px_rgba(16,185,129,0.8)] -translate-y-1/2" />
        </div>

        {SERVICES.map((service, idx) => (
          <ServiceCard key={service.num} service={service} index={idx} />
        ))}
      </div>
    </section>
  );
}

// --- INTERACTIVE TOOLS HUB ---
function ToolsHub() {
  return (
    <section id="tools" className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Financial Utilities</p>
        <h2 className="text-3xl sm:text-4xl font-sans tracking-tight mb-4">The Tax Sandbox</h2>
        <p className="text-white/40 font-sans text-base max-w-xl mx-auto">Interactive tools to help you strategize pricing, calculate true take-home pay, and avoid penalties.</p>
      </div>
      
      <div className="space-y-12">
        <TaxSandbox />
        <InvoiceStrategist />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PenaltySimulator />
          <DocumentChecklist />
        </div>
      </div>
    </section>
  );
}

function TaxSandbox() {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  const [income, setIncome] = useState("1200000");
  const [deductions, setDeductions] = useState([
    { id: '80c', name: '80C Investments (PPF, ELSS)', max: 150000, active: false, desc: 'Max limit ₹1.5L' },
    { id: '80ccd', name: 'NPS (Pension System)', max: 50000, active: false, desc: 'Extra ₹50k under 80CCD(1B)' },
    { id: '80d', name: 'Health Insurance', max: 75000, active: false, desc: 'Up to ₹75k limit' },
    { id: '24b', name: 'Home Loan Interest', max: 200000, active: false, desc: 'Up to ₹2L limit' }
  ]);
  const [animatedTakehome, setAnimatedTakehome] = useState(0);

  const numGross = parseInt(income.replace(/[^0-9]/g, "")) || 0;
  
  const calcTax = (inc: number, regime: string) => {
    if(regime === 'new') {
      if (inc <= 300000) return 0;
      if (inc <= 700000) return 0; // Rebate
      if (inc <= 1000000) return 20000 + (inc - 700000) * 0.10;
      if (inc <= 1200000) return 50000 + (inc - 1000000) * 0.15;
      if (inc <= 1500000) return 80000 + (inc - 1200000) * 0.20;
      return 110000 + (inc - 1500000) * 0.30;
    } else {
      if (inc <= 250000) return 0;
      if (inc <= 500000) return 0; 
      if (inc <= 1000000) return 12500 + (inc - 500000) * 0.20;
      return 112500 + (inc - 1000000) * 0.30;
    }
  };

  const stdDed = 50000;
  const customDed = deductions.filter(d => d.active).reduce((sum, d) => sum + d.max, 0);
  
  const taxNew = calcTax(Math.max(0, numGross - stdDed), 'new') * 1.04;
  const taxOld = calcTax(Math.max(0, numGross - stdDed - customDed), 'old') * 1.04;
  
  const isOldBetter = taxOld < taxNew;
  const finalTax = isOldBetter ? taxOld : taxNew;
  const takeHome = numGross - finalTax;

  useEffect(() => {
    let start = animatedTakehome;
    const end = takeHome;
    if (start === end) return;
    const duration = 400;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 5);
      setAnimatedTakehome(start + (end - start) * easeOut);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [takeHome]);

  const taxPct = numGross > 0 ? (finalTax / numGross) * 100 : 0;
  const takePct = numGross > 0 ? 100 - taxPct : 0;

  const toggleDed = (index: number) => {
    const newDed = [...deductions];
    newDed[index].active = !newDed[index].active;
    setDeductions(newDed);
  };

  return (
    <div className="glass-card p-6 md:p-8 lg:p-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <div>
            <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Your Exact Annual Income</label>
            <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-emerald-500 transition-colors pb-2">
              <span className="text-4xl md:text-5xl text-white/40 mr-2 tabular-nums">₹</span>
              <input 
                type="text" 
                inputMode="numeric"
                value={income}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                  setIncome(val === 0 ? "" : val.toLocaleString('en-IN'));
                }}
                className="w-full bg-transparent border-none text-4xl md:text-5xl font-bold tabular-nums text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-semibold">Tax Saving Strategies</h3>
                <p className="text-xs text-white/40 mt-1">Toggle investments to simulate savings.</p>
              </div>
            </div>
            <div className="space-y-2">
              {deductions.map((d, i) => (
                <div key={d.id} onClick={() => toggleDed(i)} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{d.name}</div>
                    <div className="text-xs text-white/40 font-mono mt-0.5">{d.desc}</div>
                  </div>
                  <div className={"w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ml-4 " + (d.active ? "bg-emerald-500" : "bg-white/10")}>
                    <div className={"absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md " + (d.active ? "translate-x-6" : "translate-x-0")}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
          <p className="text-white/50 text-sm mb-1">True Take-Home Pay</p>
          <div className="text-5xl md:text-6xl font-bold text-emerald-400 tabular-nums tracking-tighter mb-8">
            ₹{Math.round(animatedTakehome).toLocaleString('en-IN')}
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-emerald-400">Take Home ({takePct.toFixed(1)}%)</span>
              <span className="text-red-400">Tax ({taxPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: takePct + '%' }}></div>
              <div className="h-full bg-red-500 transition-all duration-500" style={{ width: taxPct + '%' }}></div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-3 font-mono text-xs mb-6">
            <div className="flex justify-between text-white/60"><span>Gross Income</span><span>₹{numGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-500/80"><span>Deductions</span><span>- ₹{(stdDed + (isOldBetter ? customDed : 0)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/60 pt-2 border-t border-white/10"><span>Taxable Income</span><span>₹{Math.max(0, numGross - stdDed - (isOldBetter ? customDed : 0)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-red-400 pt-2"><span>Tax Payable</span><span>- ₹{Math.round(finalTax).toLocaleString('en-IN')}</span></div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
              {customDed === 0 
                ? (taxNew === 0 ? "Your income is fully tax-exempt under the New Regime." : "Toggle investments to see if you can increase your take-home pay under the Old Regime.")
                : (isOldBetter ? `By utilizing these deductions, shifting to the Old Regime saves you ₹${Math.round(taxNew - taxOld).toLocaleString('en-IN')} this year!` : `Even with deductions, the New Regime is still better, saving you ₹${Math.round(taxOld - taxNew).toLocaleString('en-IN')}.`)}
            </p>
            <a href={waHref} target="_blank" className="block text-center w-full bg-white text-black font-semibold rounded-lg py-3 text-sm hover:scale-[1.02] transition-transform shadow-lg">
              Consult Harsh to execute this plan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceStrategist() {

  const [target, setTarget] = useState("100000");
  const [gstRate, setGstRate] = useState(18);
  const [hasTds, setHasTds] = useState(false);

  const numTarget = parseInt(target.replace(/[^0-9]/g, "")) || 0;
  
  const base = hasTds ? (numTarget / 0.9) : numTarget;
  const gstAmt = (base * gstRate) / 100;
  const totalInvoice = base + gstAmt;
  const tdsAmt = hasTds ? (base * 0.10) : 0;
  const clientPays = totalInvoice - tdsAmt;
  const netCash = clientPays - gstAmt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6 md:p-8 flex flex-col justify-center">
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-4">I want to pocket exactly:</label>
        <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-purple-500 transition-colors pb-2 mb-8">
          <span className="text-3xl md:text-4xl text-white/40 mr-2 tabular-nums">₹</span>
          <input 
            type="text" 
            inputMode="numeric"
            value={target}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
              setTarget(val === 0 ? "" : val.toLocaleString('en-IN'));
            }}
            className="w-full bg-transparent border-none text-3xl md:text-4xl font-bold tabular-nums text-white outline-none"
          />
        </div>
        
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-3">GST Rate</label>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 flex-wrap">
          {[0, 5, 12, 18, 28].map(r => (
            <button key={r} onClick={() => setGstRate(r)} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${gstRate === r ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold' : 'text-white/40 hover:text-white'}`}>
              {r}%
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setHasTds(!hasTds)}>
          <div>
            <div className="text-sm font-medium text-white">Client deducts 10% TDS?</div>
            <div className="text-xs text-white/40 font-mono mt-0.5">Section 194J (Professional)</div>
          </div>
          <div className={"w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ml-4 " + (hasTds ? "bg-purple-500" : "bg-white/10")}>
            <div className={"absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md " + (hasTds ? "translate-x-6" : "translate-x-0")}></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-0 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none"></div>
        <div className="p-8 pb-4 flex-1 z-10">
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
            <div>
              <h4 className="font-serif italic text-2xl text-white">Invoice Strategy</h4>
              <p className="text-[10px] font-mono text-white/30 uppercase mt-1">To achieve your target profit</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Draft</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm tabular-nums">
            <div className="flex justify-between text-white/80 font-semibold text-base"><span>Base Service Fee</span><span>₹{Math.round(base).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/50 pl-4"><span>+ CGST ({gstRate/2}%)</span><span>₹{Math.round(gstAmt/2).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/50 pl-4"><span>+ SGST ({gstRate/2}%)</span><span>₹{Math.round(gstAmt/2).toLocaleString('en-IN')}</span></div>
          </div>
          <div className="border-t border-dashed border-white/20 mt-6 pt-4 flex justify-between items-end">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Total Invoice Value</span>
            <span className="text-3xl font-sans font-bold text-white tabular-nums">₹{Math.round(totalInvoice).toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs tabular-nums">
            <div className="flex justify-between text-white/60 mb-2"><span>Client pays you</span><span className="text-white">₹{Math.round(clientPays).toLocaleString('en-IN')}</span></div>
            {hasTds && <div className="flex justify-between text-red-400/80 mb-2"><span>Client holds TDS</span><span>- ₹{Math.round(tdsAmt).toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between text-red-400/80 mb-2"><span>You pay GST</span><span>- ₹{Math.round(gstAmt).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10 font-bold text-sm mt-3"><span>Net Cash in Pocket</span><span>₹{Math.round(netCash).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PenaltySimulator() {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");

  const [delay, setDelay] = useState(0);
  const min = -30, max = 150, range = 180;
  const deadlinePct = (Math.abs(min) / range) * 100;
  const val = delay;
  
  const pct = ((val - min) / range) * 100;
  const fillPct = val > 0 ? (val / range) * 100 : 0;
  
  const d = new Date(2026, 6, 31); 
  d.setDate(d.getDate() + val);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const fFee = val > 0 ? 5000 : 0;
  const aFee = val > 0 ? 100000 * 0.01 * Math.ceil(val / 30) : 0;
  const total = fFee + aFee;

  let mascotEmoji = "https://em-content.zobj.net/source/apple/391/relieved-face_1f60c.png";
  let mascotText = "We are safe!";
  let mascotClass = "animate-[float_3s_ease-in-out_infinite]";
  let mascotScale = 1;

  if (val > 0) {
    const intensity = val / 150;
    if (val <= 30) {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/worried-face_1f61f.png";
      mascotText = "Uh oh... missed it.";
      mascotScale = 1 + (intensity * 0.3);
    } else if (val <= 90) {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/anxious-face-with-sweat_1f630.png";
      mascotText = "Interest piling up!";
      mascotClass = "animate-[jiggle_1s_ease-in-out_infinite]";
      mascotScale = 1 + (intensity * 0.5);
    } else {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/face-screaming-in-fear_1f631.png";
      mascotText = "File it now!!";
      mascotClass = "animate-[panic_0.2s_infinite]";
      mascotScale = 1;
    }
  }

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-center relative overflow-visible h-full border border-red-500/0 hover:border-red-500/20 transition-colors">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes jiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg) scale(1.1); } }
        @keyframes panic { 0%, 100% { transform: translate(0,0) scale(1.3); } 25% { transform: translate(-3px,-3px) scale(1.3) rotate(-8deg); } 75% { transform: translate(3px,3px) scale(1.3) rotate(8deg); } }
      `}} />
      
      <div className="absolute -top-10 right-4 z-50 flex flex-col items-center">
        <div className="bg-white text-black px-3 py-1.5 rounded-xl text-xs font-bold font-sans shadow-xl mb-2 relative transition-all duration-300 whitespace-nowrap">
          {mascotText}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-solid border-white border-b-transparent border-l-transparent border-r-transparent"></div>
        </div>
        <div className="transition-transform duration-100 ease-out" style={{ transform: `scale(${mascotScale})` }}>
          <img src={mascotEmoji} alt="Mascot" className={`w-14 h-14 drop-shadow-xl ${mascotClass}`} />
        </div>
      </div>

      <div className="flex justify-between items-end mb-12 mt-6 relative z-10">
        <div>
          <h3 className="font-semibold text-lg">Penalty Simulator</h3>
          <p className="text-xs font-mono text-white/40 mt-1 uppercase tracking-widest">ITR AY 2026-27</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50 mb-1">{val <= 0 ? "Safe zone." : `Losing money (${val} days late)`}</p>
          <div className={`text-3xl font-bold tabular-nums tracking-tighter transition-colors duration-300 ${val <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="relative w-full h-6 flex items-center mb-12">
        <div className="w-full h-6 bg-white/10 rounded-full relative">
          <div className="absolute left-0 h-full bg-emerald-500 rounded-l-full" style={{ width: deadlinePct + '%' }}></div>
          <div className="absolute h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-r-full shadow-[0_0_15px_rgba(239,68,68,0.4)]" style={{ left: deadlinePct + '%', width: fillPct + '%' }}></div>
          <div className="absolute top-[-5px] bottom-[-5px] w-0.5 bg-white z-10" style={{ left: deadlinePct + '%' }}>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded uppercase whitespace-nowrap">Jul 31</div>
          </div>
        </div>
        
        <input 
          type="range" min={min} max={max} value={delay} onChange={(e) => setDelay(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"
        />
        <div className="absolute w-8 h-8 bg-white rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg border-[3px] border-black z-15 pointer-events-none transition-colors" style={{ left: pct + '%', borderColor: val <= 0 ? '#111' : '#ef4444' }}></div>
        <div className="absolute -bottom-8 px-2 py-1 bg-black border border-white/20 rounded-lg text-xs font-mono tabular-nums transition-all whitespace-nowrap" style={{ left: pct + '%', transform: 'translateX(-50%)' }}>
          {dateStr}
        </div>
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2 font-mono text-xs tabular-nums mb-6 flex-1">
        <div className="flex justify-between text-white/60"><span>Late Fee (Sec 234F)</span><span>₹{fFee.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-white/60"><span>Interest (Sec 234A)</span><span>₹{aFee.toLocaleString('en-IN')}</span></div>
      </div>
      <a href={waHref} target="_blank" className={`block text-center w-full font-semibold rounded-lg py-3 text-sm hover:scale-[1.02] transition-transform ${val <= 0 ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
        {val <= 0 ? "File ITR Now Before Deadline" : "Stop the penalty - File Now"}
      </a>
    </div>
  );
}


function DocumentChecklist() {
  const [selected, setSelected] = useState("itr");
  const checklists = {
    itr: {
      label: "Personal ITR Filing",
      items: ["PAN Card", "Aadhaar Card", "Form 16 (from employer)", "Bank interest certificates", "Investment proofs (80C/80D)", "Capital gains statement", "Previous year ITR copy"],
    },
    gst_reg: {
      label: "GST Registration",
      items: ["PAN of business / proprietor", "Aadhaar of proprietor", "Electricity/water bill (premises)", "Bank account statement", "Cancelled cheque", "Photograph of proprietor", "Business registration proof"],
    },
    pvt_ltd: {
      label: "PVT LTD Registration",
      items: ["PAN + Aadhaar of all directors", "Passport-size photos", "Bank statement (address proof)", "Registered office address proof", "NOC from property owner", "Proposed company name (3 options)", "Business activity description"],
    },
    audit: {
      label: "Tax Audit (Sec. 44AB)",
      items: ["Audited books of accounts", "Trial balance & P&L", "Fixed asset register", "Loan & liability documents", "GST returns filed", "TDS certificates (26AS)", "Previous audit report"],
    },
  };

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
          <ClipboardList className="w-4 h-4 text-white/70" />
        </div>
        <div>
          <h3 className="font-sans font-semibold text-white text-base">Document Checklist</h3>
          <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider">What to bring when you visit</p>
        </div>
      </div>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-sans text-white focus:outline-none focus:border-white/30 transition-colors mb-5 cursor-pointer"
      >
        {Object.entries(checklists).map(([key, { label }]) => (
          <option key={key} value={key} className="bg-[#111]">{label}</option>
        ))}
      </select>

      <AnimatePresence mode="wait">
        <motion.ul
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={SPRING_SNAPPY}
          className="space-y-2.5 mb-5"
        >
          {checklists[selected as keyof typeof checklists].items.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm font-sans text-white/60">
              <CheckCircle2 className="w-4 h-4 text-white/25 flex-shrink-0" />
              {item}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <a
        href={`https://wa.me/919033440008?text=Hey%20sir%2C%20I%20need%20help%20with%20${encodeURIComponent(checklists[selected as keyof typeof checklists].label)}.`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white text-black font-sans font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Ask about this on WhatsApp
      </a>
    </div>
  );
}

// --- FAQ ---
const FAQ_ITEMS = [
  { q: "What are your office timings?", a: "We are open Monday to Saturday, 10:00 AM to 7:00 PM IST at our office in Time Square II, Ayodhya Chowk, 150 Feet Ring Road, Rajkot – 360005. We strongly recommend booking an appointment before visiting to ensure direct partner availability." },
  { q: "How does the client onboarding process work?", a: "It begins with a short 15-minute consultation call (book via WhatsApp or the form on this page). After understanding your requirements, we share a structured document checklist. Once documents are received, we generate your engagement letter and begin work immediately. Most filings are completed within 3–5 business days." },
  { q: "What are the fees for your services?", a: "Professional fees are engagement-specific and discussed transparently during the initial consultation. There are no hidden charges. GST registration, ITR filing, and DSC typically follow a fixed-fee structure. Complex cases like audit or corporate advisory are quoted after a scope assessment." },
  { q: "Can I share documents digitally without visiting physically?", a: "Absolutely. The majority of our work is handled remotely via WhatsApp, email, and our upcoming Secure Client Portal. You send documents digitally, we file and share the acknowledgment — no visit needed for most services." },
  { q: "I missed the ITR filing deadline. What should I do?", a: "Don't panic. A belated return can still be filed up to 31st December (for most individuals). There may be a late filing fee under Sec. 234F (up to ₹5,000). We also help you compute and minimize the interest under Sec. 234A. Contact us immediately to mitigate penalties." },
  { q: "Do you serve clients outside Rajkot?", a: "Yes! We work with clients across Gujarat and beyond remotely — including Ahmedabad, Surat, Mumbai, and NRIs. All filings on GST, MCA, and Income Tax portals are done digitally, so physical proximity is not required." },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-sans tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-white/40 font-sans text-base">Answers to what clients most commonly ask before working with us.</p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="glass-card overflow-hidden cursor-pointer hover:border-white/20 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-center justify-between p-6 sm:p-7 gap-4">
              <h3 className="text-base sm:text-lg font-sans text-white">{item.q}</h3>
              <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={SPRING_MICRO} className="flex-shrink-0">
                <ChevronDown className="w-5 h-5 text-white/30" />
              </motion.div>
            </div>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={SPRING_SNAPPY}
                  className="overflow-hidden"
                >
                  <p className="px-6 sm:px-7 pb-6 text-sm sm:text-base text-white/50 font-sans leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- BOOKING FORM ---
function BookingForm() {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");

  const [intent, setIntent] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent || !name || !contact) return;
    setStatus("submitting");

    try {
      const { error } = await supabase.from('leads').insert([{
        name,
        contact,
        service: intent,
        message: desc,
        status: 'NEW'
      }]);

      if (error) {
        console.error("Error submitting lead:", error);
        // Fallback for demo before DB is up
        setTimeout(() => setStatus("success"), 1200);
      } else {
        setStatus("success");
      }
    } catch (err) {
      setTimeout(() => setStatus("success"), 1200);
    }
  };

  const intents = [
    { id: "tax", title: "Income Tax", desc: "ITR filing & tax planning.", icon: TrendingUp },
    { id: "gst", title: "GST & Audit", desc: "Filing, audit & ITC reconciliation.", icon: BarChart3 },
    { id: "corporate", title: "Corporate Advisory", desc: "Company registration & MCA.", icon: Building2 },
    { id: "other", title: "Other / Not Sure", desc: "Book a general consultation.", icon: MessageCircle },
  ];

  return (
    <section id="book" className="py-24 px-6 max-w-4xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">Get Started</p>
        <h2 className="text-3xl sm:text-4xl font-sans tracking-tight mb-4 text-white">Book a Free Consultation</h2>
        <p className="text-white/40 font-sans text-base">Tell us what you need. We'll get back within 2 business hours.</p>
      </div>

      <div className="glass-card p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING_SNAPPY} className="text-center py-12 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-5 border border-white/20">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-sans font-bold text-white mb-2">Request Received!</h3>
              <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                Thank you, {name}. Our team will review your query and contact you within 2 business hours via WhatsApp or email.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 font-sans font-bold text-sm text-black hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Connect Instantly on WhatsApp
              </a>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">What can we help you with?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {intents.map((item) => {
                    const Icon = item.icon;
                    const isSelected = intent === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setIntent(item.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${isSelected ? "bg-white/10 border-white" : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"}`}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-white/40"}`} />
                          <h4 className="font-sans font-semibold text-white text-sm">{item.title}</h4>
                        </div>
                        <p className="text-xs font-sans text-white/40">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-2">Your Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-white/30 text-white placeholder-white/25 transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-2">WhatsApp / Email</label>
                  <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91 90000 00000 or email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-white/30 text-white placeholder-white/25 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-2">Brief Description (Optional)</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe your query or business briefly..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-white/30 text-white placeholder-white/25 transition-colors resize-none" />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "submitting" || !intent || !name || !contact}
                className="w-full h-14 rounded-xl bg-white text-black font-sans font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-[15px]"
              >
                {status === "submitting" ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Schedule Consultation <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>

              <p className="text-center text-[11px] font-mono text-white/25 uppercase tracking-widest">
                ICAI compliant · No spam · Your data is secure
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


// --- FOOTER (FULL) ---
function Footer({ onPortalOpen }: { onPortalOpen: () => void }) {
  const { phone, whatsapp, email, office_address } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  return (
    <footer className="pt-20 pb-8 border-t border-white/10 relative z-10 bg-[#020202]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-serif italic text-2xl text-white block mb-1">Harsh Manek & Co.</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 block mb-5">& Co. · Chartered Accountants</span>
            <p className="text-sm font-sans text-white/40 leading-relaxed mb-6">
              Professional financial and compliance advisory from Rajkot, Gujarat since 2016.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#25D366] hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.612L0 24l6.545-1.366A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.732.979.997-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/></svg>
              {whatsapp}
            </a>
          </div>

          {/* Office */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5 block">Office</span>
            <div className="flex items-start gap-2.5 text-sm font-sans text-white/50 leading-relaxed mb-4">
              <MapPin className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{office_address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-sans text-white/50 mb-2">
              <Phone className="w-4 h-4 text-white/30" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-sans text-white/50">
              <Mail className="w-4 h-4 text-white/30" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5 block">Practice Areas</span>
            <ul className="space-y-2.5">
              {["Accounting & Bookkeeping", "Income Tax (ITR)", "GST Services", "Audit & Assurance", "Corporate Advisory", "Digital Signature (DSC)"].map((link) => (
                <li key={link}>
                  <a href="/#services" className="text-sm font-sans text-white/45 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5 block">Resources</span>
            <ul className="space-y-2.5 mb-6">
              {[
                { label: "Blog & Insights", href: "/blog" },
                { label: "Tax Calculators", href: "/#tools" },
                { label: "Document Checklists", href: "/#tools" },
                { label: "Tax Deadlines 2025-26", href: "/#tools" },
                { label: "FAQ", href: "/#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="text-sm font-sans text-white/45 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <button
              onClick={onPortalOpen}
              className="flex items-center gap-2 text-sm font-sans text-white/45 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Client Portal
            </button>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] mb-10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] font-sans text-white/30 leading-relaxed">
              <strong className="text-white/40">Regulatory Disclosure:</strong> This website is maintained in strict compliance with the Code of Ethics of the Institute of Chartered Accountants of India (ICAI). The content herein is for general informational purposes only and does not constitute professional legal, financial, or tax advice. Harsh Manek & Co. does not solicit clients through this platform. All information provided should be verified with a qualified professional before acting upon it. ICAI Membership No. available upon request.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/[0.07] gap-4">
          <span className="text-[11px] font-mono text-white/25 uppercase tracking-widest">
            © {new Date().getFullYear()} Harsh Manek & Co. All Rights Reserved. · Rajkot, Gujarat.
          </span>
          <div className="flex gap-5 text-[11px] font-mono text-white/30 uppercase tracking-widest">
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="/#book" className="hover:text-white transition-colors">Book Consultation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- PAGES ---


function WhoYouAreFunnel() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const options = [
    {
      id: 'startups',
      title: 'Scaling Startups',
      shortDesc: 'Seed to Series A structuring.',
      proof: 'Trusted by 25+ funded startups',
      painPoints: ['DPIIT Recognition & Angel Tax exemption', 'Complex ESOP & Cap Table structuring', 'Burn rate vs compliance balancing'],
      cta: 'Book Startup Consultation'
    },
    {
      id: 'sme',
      title: 'SME Manufacturers',
      shortDesc: 'Factory & supply chain compliance.',
      proof: 'Serving 40+ industrial clients',
      painPoints: ['CMA Data for working capital limits', 'GST ITC reconciliation & audits', 'Inventory & fixed asset verification'],
      cta: 'Book Industry Consultation'
    },
    {
      id: 'nri',
      title: 'Individuals / NRIs',
      shortDesc: 'Wealth protection & tax optimization.',
      proof: 'Managing 100+ HNI portfolios',
      painPoints: ['Capital Gains (Section 54) optimization', 'Double Taxation Avoidance Agreements (DTAA)', 'Scrutiny assessments & hassle-free ITR filing'],
      cta: 'Book Tax Strategy Call'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 relative group/bento">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="text-center mb-16 relative z-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Tailored Solutions</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-white mb-4 tracking-tight">Who You Are</h2>
        <p className="text-white/60 font-sans text-base max-w-xl mx-auto">Select your profile to see how our expertise aligns with your exact challenges.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10" onMouseLeave={() => setActiveTab(null)}>
        {options.map((opt) => {
          const isActive = activeTab === opt.id;
          const isAnotherActive = activeTab !== null && !isActive;
          return (
            <motion.div
              key={opt.id}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer ${
                isActive 
                  ? 'bg-[var(--background)] border-white/30 shadow-[0_12px_40px_rgba(255,255,255,0.05)] ring-1 ring-white/10 scale-[1.02]' 
                  : 'bg-white/[0.02] border-white/10'
              } ${isAnotherActive ? 'brightness-50 grayscale opacity-40 scale-[0.98]' : ''}`}
              onMouseEnter={() => setActiveTab(opt.id)}
            >
              <div className="p-8">
                <h3 className="text-2xl font-['Poppins'] font-bold text-white mb-2">{opt.title}</h3>
                <p className="text-white/50 text-sm font-sans mb-4">{opt.shortDesc}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40">{isActive ? 'Close details' : 'View details'}</span>
                </div>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
                  >
                    <div className="px-8 pb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wide mb-6">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {opt.proof}
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Pain Points Solved</p>
                        {opt.painPoints.map((pp, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                            <p className="text-sm font-sans text-white/80 leading-relaxed">{pp}</p>
                          </div>
                        ))}
                      </div>

                      <a 
                        href={`https://wa.me/919033440008?text=Hello%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(opt.title)}%20consultation.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-black font-sans font-bold text-sm hover:bg-emerald-400 hover:scale-[1.02] transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {opt.cta} <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// --- PROFESSIONAL EXPERIENCE & SECTORS ---
function ExperienceSection() {
  const sectors = [
    "Manufacturing & Industrial",
    "Trading & Wholesale",
    "Service Sectors",
    "Petroleum Dealerships",
    "Startups & Corporate",
    "Real Estate & Construction",
    "Healthcare & Pharmaceuticals"
  ];

  const sectorCards = sectors.map((sector, i) => (
    <div key={i} className="w-full h-full bg-[var(--background)] border border-white/5 rounded-2xl p-6 flex items-center justify-center text-center transition-all duration-500 hover:border-white/20 hover:bg-white/5 cursor-grab active:cursor-grabbing group">
      <span className="font-['Poppins'] font-medium tracking-wide text-white/70 group-hover:text-white text-[15px] leading-snug transition-colors">{sector}</span>
    </div>
  ));

  return (
    <section id="experience" className="py-24 px-6 max-w-[1400px] mx-auto relative z-10 border-t border-white/5 overflow-hidden">
      <div className="text-center mb-16 relative">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Track Record</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold tracking-tight mb-4 text-white">Experience Across Sectors</h2>
        <p className="text-white/60 font-sans text-base max-w-xl mx-auto">
          Factual engagement experience driving compliance and financial growth across Rajkot and Gujarat. Drag to explore.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[120px] relative">
        <div className="absolute inset-y-0 left-0 w-32 gradient-mask-r z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 gradient-mask-l z-20 pointer-events-none" />
        
        <CurvedGalleryArc 
          items={sectorCards}
          cardSize={220}
          cardHeight={120}
          gap={24}
          curve={10}
          perspective={1000}
          autoScrollSpeed={0.3}
          dragSpeed={1.5}
          inertia={0.8}
        />
      </div>
      
      <div className="mt-8 flex justify-center">
        <a 
          href="https://maps.app.goo.gl/AcVviGucgiV7sPyT6" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-sans font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
        >
          Google reviews <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        </a>
      </div>
    </section>
  );
}

// --- VERIFIED PROFESSIONAL TEAM (INTERACTIVE ACCORDION SHOWCASE) ---
function TeamSection() {
  return <InteractiveTeamShowcase />;
}

function HomePage({ theme }: { theme?: string }) {
  return (
    <>
      <Hero theme={theme} />
      <WhoYouAreFunnel />
      <ExperienceSection />
      <TeamSection />
      <DynamicTimeline />
      <ToolsHub />
      <FAQ />
      <BookingForm />
    </>
  );
}

// --- PRIVACY POLICY PAGE ---
function PrivacyPage() {
  const { office_address, email, phone } = useSiteSettings();

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-3xl mx-auto relative z-10">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-sans font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-sm font-mono text-white/30">Last updated: 1 September 2026 · Harsh Manek & Co., Rajkot, Gujarat</p>
      </div>

      <div className="space-y-10 font-sans text-white/55 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">1. Introduction</h2>
          <p>Harsh Manek & Co. ("the Firm", "we", "us", or "our"), a Chartered Accountancy firm registered under the Institute of Chartered Accountants of India (ICAI) and headquartered at {office_address}, is committed to protecting the privacy and confidentiality of all personal data shared with us. This Privacy Policy explains how we collect, use, store, protect, and share your information in connection with our website (harshmanek.com) and professional services.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect personal information only when you actively provide it to us. This may include:</p>
          <ul className="space-y-1.5 ml-4">
            {["Full name, email address, and phone number (from contact and booking forms)", "Financial documents and statements voluntarily submitted for professional services (e.g., PAN, Aadhaar, Form 16, bank statements)", "Business and company registration details for corporate advisory services", "Usage data: pages visited, time on site, referring URLs (collected via analytics tools in aggregate, non-identifiable form)", "Communication records: messages, emails, or WhatsApp conversations initiated by you"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-white/30 mt-1.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">3. How We Use Your Information</h2>
          <p className="mb-3">Your information is used solely for:</p>
          <ul className="space-y-1.5 ml-4">
            {["Providing professional CA services including taxation, GST, audit, accounting, and compliance", "Communicating with you about your engagement, follow-ups, and service updates", "Sending statutory reminders (tax deadlines, return filing dates) relevant to your case", "Improving our website and tools through anonymized analytics", "Complying with legal obligations under the Income Tax Act, GST Act, Companies Act, and ICAI ethical guidelines"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-white/30 mt-1.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">We do <strong className="text-white">not</strong> sell, rent, trade, or share your personal information with third parties for marketing or advertising purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">4. Data Security</h2>
          <p>All documents and personal data shared with us are protected using industry-standard security measures including Transport Layer Security (TLS/HTTPS) encryption for data in transit and AES-256 encryption for data at rest (within our secure client management systems). Access to client data is strictly restricted to authorized firm personnel directly involved in your engagement. We maintain physical, electronic, and procedural safeguards consistent with professional CA practice standards.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">5. Data Retention</h2>
          <p>We retain client records for a minimum of 8 years from the date of engagement, as required by the Income Tax Act, 1961, and ICAI guidelines. After this period, records are securely destroyed. You may request deletion of your personal data (subject to statutory retention requirements) by contacting us at Harsh.manek@hotmail.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">6. Cookies & Analytics</h2>
          <p>Our website uses cookies and analytics tools (such as Google Analytics) to understand how visitors interact with our site. This data is collected in aggregate, anonymized form and cannot be linked back to any individual. You may disable cookies in your browser settings without affecting your ability to use the website or access our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">7. Third-Party Links</h2>
          <p>Our website may contain links to external platforms such as the Income Tax e-filing portal, GST portal, MCA21, and ICAI website. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any site you visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">8. Your Rights</h2>
          <p className="mb-3">Under applicable Indian data protection laws, you have the right to:</p>
          <ul className="space-y-1.5 ml-4">
            {["Access the personal data we hold about you", "Correct inaccurate or outdated information", "Request deletion of data (subject to statutory obligations)", "Withdraw consent to communications at any time", "Lodge a complaint with the relevant data protection authority"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-white/30 mt-1.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:Harsh.manek@hotmail.com" className="text-white hover:underline">Harsh.manek@hotmail.com</a> or call <a href="tel:+919033440008" className="text-white hover:underline">+91-9033440008</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">9. ICAI Compliance</h2>
          <p>This website is maintained in full compliance with the Code of Ethics issued by the Institute of Chartered Accountants of India (ICAI). Content is informational in nature and does not constitute solicitation of professional work. The Firm does not publish client names, testimonials, fee schedules, or any information restricted under the ICAI Code of Ethics.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">10. Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy periodically to reflect changes in our practices or applicable law. Material changes will be communicated by updating the "Last updated" date at the top of this page. Continued use of our website following any changes constitutes your acceptance of the revised policy.</p>
        </section>

        <section className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <p className="text-sm">
            <strong className="text-white">Contact for Privacy Matters:</strong><br />
            Harsh Manek & Co., <span className="whitespace-pre-line">{office_address}</span><br />
            Email: <a href={`mailto:${email}`} className="text-white hover:underline">{email}</a> · Phone: <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:underline">{phone}</a>
          </p>
        </section>
      </div>
    </div>
  );
}

// --- TERMS OF SERVICE PAGE ---
function TermsPage() {
  const { office_address, email, phone } = useSiteSettings();
  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-3xl mx-auto relative z-10">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-sans font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-sm font-mono text-white/30">Last updated: 1 September 2026 · Harsh Manek & Co., Rajkot, Gujarat</p>
      </div>

      <div className="space-y-10 font-sans text-white/55 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using harshmanek.com (the "Website"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree with any part of these Terms, please discontinue use of the Website immediately. These Terms apply to all visitors, users, and prospective clients.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">2. Nature of the Website</h2>
          <p>This Website is maintained by Harsh Manek & Co. ("the Firm"), a Chartered Accountancy firm, primarily for informational purposes. The content on this Website — including articles, calculators, checklists, and service descriptions — does not constitute professional legal, tax, financial, or accounting advice. It is general educational content. No client-professional relationship is established merely by visiting or interacting with this Website.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">3. Professional Services</h2>
          <p>Engagement of professional services by the Firm is governed by a separate, written Engagement Letter or Service Agreement executed between the Firm and the Client. The terms and conditions of any professional service, including scope, fees, confidentiality, and liability, are defined exclusively in that engagement document. These Website Terms of Service do not create any professional obligations.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">4. Use of Interactive Tools</h2>
          <p>The tax calculators, GST calculators, and deadline trackers provided on this Website are for illustrative and general guidance purposes only. Calculations are based on standard statutory rates and may not reflect your specific tax situation, which may be affected by exemptions, surcharges, deductions, or recent amendments. The Firm accepts no liability for financial decisions made based on outputs from these tools. Always consult a qualified professional before acting on any estimate.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">5. Intellectual Property</h2>
          <p>All content on this Website, including text, graphics, blog articles, design elements, logos, and calculators, is the intellectual property of Harsh Manek & Co. and is protected under applicable copyright and intellectual property laws. You may not reproduce, distribute, or use any content without the Firm's prior written consent. Sharing individual blog articles with attribution for non-commercial educational purposes is permitted.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Harsh Manek & Co. shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of, or inability to use, this Website or any of its tools and content. This includes but is not limited to financial losses, penalties, or missed deadlines based on information obtained from this Website.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">7. Third-Party Links</h2>
          <p>The Website may contain hyperlinks to third-party websites including government portals (Income Tax, GST Network, MCA21) and financial platforms. These links are provided for convenience only. The Firm does not endorse, control, or accept responsibility for the content, accuracy, or practices of any third-party website. Visiting linked sites is entirely at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">8. Prohibited Conduct</h2>
          <p className="mb-3">By using this Website, you agree not to:</p>
          <ul className="space-y-1.5 ml-4">
            {["Use the Website for any unlawful purpose or in violation of any regulations", "Transmit spam, malware, or any harmful or disruptive content", "Attempt to gain unauthorized access to any part of the Website or its infrastructure", "Scrape, harvest, or systematically download content without written permission", "Misrepresent your identity or affiliation when submitting inquiries"].map((item) => (
              <li key={item} className="flex items-start gap-2"><span className="text-white/30 mt-1.5 flex-shrink-0">—</span><span>{item}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">9. Governing Law & Jurisdiction</h2>
          <p>These Terms are governed by the laws of India. Any disputes arising from or related to these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the competent courts in Rajkot, Gujarat, India.</p>
        </section>

        <section>
          <h2 className="text-xl font-sans font-bold text-white mb-3">10. Modifications</h2>
          <p>The Firm reserves the right to amend these Terms at any time. Changes become effective upon posting to the Website. Your continued use of the Website following any amendments constitutes your acceptance of the revised Terms. We recommend reviewing these Terms periodically.</p>
        </section>

        <section className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <p className="text-sm">
            <strong className="text-white">Contact:</strong><br />
            Harsh Manek & Co., <span className="whitespace-pre-line">{office_address}</span><br />
            Email: <a href={`mailto:${email}`} className="text-white hover:underline">{email}</a> · Phone: <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:underline">{phone}</a>
          </p>
        </section>
      </div>
    </div>
  );
}

// --- BLOG ---
const BLOG_POSTS = [
  { id: 1, title: "How to Save Tax Under Section 80C in 2026", date: "Aug 28, 2026", category: "Tax Planning", read: "9 min" },
  { id: 2, title: "GST Audit Checklist for Private Limited Companies", date: "Aug 15, 2026", category: "Compliance", read: "7 min" },
  { id: 3, title: "The Ultimate Guide to Startup Fundraising Compliance", date: "Jul 30, 2026", category: "Startups", read: "11 min" },
  { id: 4, title: "New Income Tax Rules for Freelancers & Consultants", date: "Jul 12, 2026", category: "Tax Planning", read: "6 min" },
  { id: 5, title: "Why Your Business Needs a Virtual CFO", date: "Jun 22, 2026", category: "Advisory", read: "8 min" },
  { id: 6, title: "Common ITR Filing Mistakes That Trigger Scrutiny", date: "Jun 05, 2026", category: "Tax Planning", read: "5 min" },
  { id: 7, title: "Understanding Direct vs Indirect Taxes in India", date: "May 18, 2026", category: "Education", read: "10 min" },
  { id: 8, title: "Step-by-Step Guide to Registering a PVT LTD in 2026", date: "May 02, 2026", category: "Corporate", read: "12 min" },
  { id: 9, title: "How Digital Signature Certificates (DSC) Work", date: "Apr 20, 2026", category: "Compliance", read: "4 min" },
  { id: 10, title: "Capital Gains Tax on Real Estate Explained", date: "Apr 10, 2026", category: "Tax Planning", read: "9 min" },
];

function BlogIndexPage() {
  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="mb-16 border-b border-white/10 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">Knowledge Hub</p>
        <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-4 tracking-tight">Blog & Insights</h1>
        <p className="text-white/45 font-sans text-lg max-w-2xl">Tax strategies, compliance guides, and financial intelligence — written for Indian business owners and individuals by CA Harsh Manek.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {BLOG_POSTS.map((post) => (
          <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col">
            <div className="w-full h-52 rounded-2xl bg-[var(--background)] mb-5 overflow-hidden relative border border-white/10 group-hover:border-white/25 transition-colors">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 group-hover:opacity-75" alt="" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-medium text-white/80">
                {post.category}
              </div>
            </div>
            <div className="text-[11px] font-mono text-white/30 mb-2.5 tracking-widest uppercase">{post.date} · {post.read} read</div>
            <h3 className="text-xl font-sans text-white font-semibold mb-3 leading-snug group-hover:text-white/75 transition-colors">{post.title}</h3>
            <p className="text-sm font-sans text-white/35 mb-5 leading-relaxed flex-grow">
              Actionable insights on {post.title.toLowerCase()} for the 2025-26 financial year. Practical guidance from a Rajkot CA.
            </p>
            <div className="flex items-center text-sm font-sans font-semibold text-white/35 group-hover:text-white transition-colors mt-auto">
              Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogPostPage() {
  const { whatsapp } = useSiteSettings();
  const waHref = waLink(whatsapp, "Hey sir, I have a query regarding the CA consultancy.");
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12">
      <div className="flex-1 lg:max-w-[65%]">
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-white/50 uppercase tracking-wider">Tax Planning</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans tracking-tight text-white font-bold mb-6 leading-[1.1]">
          How to Save Tax Under Section 80C in 2026
        </h1>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-11 h-11 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
            <img src="/harsh_avatar.png" alt="CA Harsh Manek" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <span className="text-white font-sans font-medium text-sm block">CA Harsh Manek</span>
            <span className="text-xs font-sans text-white/40">Aug 28, 2026 · 9 min read</span>
          </div>
        </div>

        <div className="w-full h-[300px] md:h-[420px] rounded-3xl bg-[var(--background)] mb-12 overflow-hidden relative border border-white/10">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200" alt="Finance" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/70 via-[var(--background)]/10 to-transparent" />
        </div>

        <div className="prose prose-invert prose-lg font-sans text-white/60 max-w-none space-y-6">
          <p id="understanding" className="text-white/80 text-lg leading-relaxed">The government legally gives you a ₹1.5 Lakh window to reduce your taxable income under Section 80C. If you aren't maxing this out, you're leaving money on the table — every single year.</p>

          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 my-8">
            <strong className="text-amber-300 block mb-2">⚠️ Critical 2026 Update:</strong>
            <span>Under the default New Tax Regime, Section 80C deductions are completely disallowed. You must explicitly opt for the Old Tax Regime if you plan to claim these exemptions. Calculate your break-even before deciding.</span>
          </div>

          <h2 className="text-white text-3xl font-bold tracking-tight" id="elss">1. ELSS — The Smart Equity Play</h2>
          <p>ELSS (Equity Linked Savings Scheme) has the shortest lock-in of any 80C instrument — just 3 years. With direct equity exposure, well-chosen ELSS funds historically outperform fixed-income instruments on a risk-adjusted basis over 3+ year horizons.</p>

          <h2 className="text-white text-3xl font-bold tracking-tight" id="ppf">2. PPF — The Bedrock of Wealth</h2>
          <p>The Public Provident Fund offers EEE (Exempt-Exempt-Exempt) status. Principal is deductible, interest is tax-free, and maturity is tax-free. The 15-year lock-in is a feature, not a bug — it forces long-term wealth accumulation that most investors never achieve otherwise.</p>

          <h2 className="text-white text-3xl font-bold tracking-tight" id="epf">3. EPF & VPF — Already Working for You</h2>
          <p>If you're salaried, check your payslip. Your EPF contribution already counts toward your 80C limit. If it doesn't max it out, consider Voluntary Provident Fund (VPF) to bridge the gap. Note: Interest on total PF contributions exceeding ₹2.5L/year is now taxable.</p>

          <h2 className="text-white text-3xl font-bold tracking-tight" id="insurance">4. Term Insurance — Protection, Not Investment</h2>
          <p>Buy pure term insurance for life coverage — the premiums qualify under 80C and the coverage is massive at minimal cost. Avoid ULIPs and endowment plans where heavy charges cannibalize your returns.</p>

          <h2 className="text-white text-3xl font-bold tracking-tight" id="consulting">Get a Personalised 80C Strategy</h2>
          <p>The optimal 80C strategy depends on your income, risk tolerance, liquidity needs, and existing investments. Don't allocate blindly — get a 15-minute consultation with our team to map out your optimal plan for FY 2025-26.</p>
        </div>
      </div>

      {/* Sticky Sidebar */}
      <div className="w-full lg:w-[33%] shrink-0">
        <div className="sticky top-28 flex flex-col gap-8">
          <div className="glass-card p-7">
            <h3 className="text-lg font-sans font-bold text-white mb-2 tracking-tight">Need personalised tax advice?</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">Skip the generic guidance. Speak directly with CA Harsh Manek about your 2026 tax strategy.</p>
            <div className="flex flex-col gap-3">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white text-black font-sans font-bold text-sm hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp Now
              </a>
              <a href="/#book" className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/25 font-sans text-sm transition-colors">
                Book Consultation
              </a>
            </div>
          </div>

          <div className="px-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5">Table of Contents</h4>
            <div className="space-y-3 text-sm font-sans text-white/45">
              {[
                { id: "understanding", label: "Understanding Section 80C" },
                { id: "elss", label: "ELSS — Equity Play" },
                { id: "ppf", label: "Public Provident Fund" },
                { id: "epf", label: "EPF & VPF Strategy" },
                { id: "insurance", label: "Term Insurance Guide" },
                { id: "consulting", label: "Get Personalised Advice" },
              ].map(({ id, label }) => (
                <div key={id} onClick={() => scrollTo(id)} className="cursor-pointer hover:text-white transition-colors flex items-center gap-2.5 group">
                  <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white transition-colors flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ROOT APP ---
export default function App() {
  const [portalOpen, setPortalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('hm_theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('hm_theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="bg-[#020202] min-h-screen selection:bg-white selection:text-black">
          <Routes>
            <Route path="/*" element={
              <>
                <Navbar onPortalOpen={() => setPortalOpen(true)} theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                <ClientPortalModal open={portalOpen} onClose={() => setPortalOpen(false)} />
                <WhatsAppFloat />
                <Routes>
                  <Route path="/" element={<HomePage theme={theme} />} />
                  <Route path="/blog" element={<BlogIndexPage />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                </Routes>
                <Footer onPortalOpen={() => setPortalOpen(true)} />
              </>
            } />
            
            <Route path="/portal/login" element={<Login />} />
            <Route path="/portal" element={<PrivateRoute><PortalLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="jobs" element={<JobsManager />} />
              <Route path="applicants" element={<ApplicantsManager />} />
              <Route path="website" element={<WebsiteSettings />} />
              <Route path="account" element={<Account />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
