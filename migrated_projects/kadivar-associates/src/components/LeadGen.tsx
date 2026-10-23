"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, CheckCircle2 } from "lucide-react";

export function LeadGen() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track("Contact Form Submitted");
    // Simulate submission delivery
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden" id="enquiry-form">
      <div className="absolute inset-0 bg-[#e6ff00]/5 mix-blend-overlay blur-3xl rounded-full translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl w-full">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-4 text-white">Start Your Strategy.</h2>
          <p className="text-gray-400 font-sans text-lg md:text-xl text-balance mb-8">
            Tell us what you need help with and we will reply within one working day.
          </p>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label htmlFor="name-leadgen" className="sr-only">Full Name</label>
                  <input id="name-leadgen" type="text" placeholder="Full Name" required className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors" />
                  
                  <label htmlFor="email-leadgen" className="sr-only">Email</label>
                  <input id="email-leadgen" type="email" placeholder="Email" required className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors" />
                </div>
                
                <label htmlFor="phone-leadgen" className="sr-only">Phone (Optional)</label>
                <input id="phone-leadgen" type="tel" placeholder="Phone (Optional)" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors" />
                
                <label htmlFor="message-leadgen" className="sr-only">Message</label>
                <textarea id="message-leadgen" rows={3} placeholder="How can we help you?" required className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors"></textarea>
                
                <button type="submit" className="w-full bg-[#e6ff00] text-black font-medium py-3 rounded-lg hover:bg-white transition-colors">
                  Submit Enquiry
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#050505] border border-[#e6ff00]/50 rounded-xl p-8 text-center flex flex-col items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-[#e6ff00] mb-4" />
                <h3 className="text-xl font-serif italic text-white mb-2">Message Received</h3>
                <p className="text-gray-400">Thank you for reaching out. One of our partners will review your requirements and respond within 24 working hours.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-t border-white/10 p-4 flex gap-4 shadow-2xl">
        <a href="tel:+919016284892" onClick={() => track("Call Click")} className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white rounded-lg py-3 font-medium text-sm">
          <Phone className="w-4 h-4" /> Call Us
        </a>
        <a href="https://wa.me/919016284892?text=Hello" onClick={() => track("WhatsApp Click")} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-black rounded-lg py-3 font-medium text-sm">
          <MessageSquare className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </section>
  );
}
