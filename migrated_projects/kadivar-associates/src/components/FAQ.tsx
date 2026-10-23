"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "What does working with the firm involve?",
    answer: "We begin with a consultation to understand your requirement, then confirm the scope of work and the fee in writing before anything starts. Once you accept, we collect the documents, carry out the work, and the partner reviews and signs off before filing. You are told what is happening at each stage."
  },
  {
    question: "Who do you work with?",
    answer: "Proprietorships, partnership firms, LLPs, private limited companies and individuals across Rajkot, Morbi, Wankaner and the wider Gujarat region. There is no minimum size — we handle single-proprietor businesses and individual tax matters alongside company audits."
  },
  {
    question: "I have received an income tax or GST notice. What happens next?",
    answer: "Send us the notice and we will tell you what it means and what the deadline is. Most notices are routine and are resolved by filing a response with supporting documents. Where a matter proceeds to assessment or appeal, we appear as your authorised representative before the Income Tax and GST authorities."
  },
  {
    question: "I am behind on my filings. Is it too late?",
    answer: "Usually not. Belated and updated returns can often still be filed, and overdue ROC filings can be brought up to date, though additional fees or interest may apply. Bring us what you have — the position is almost always better than people expect."
  },
  {
    question: "I already have an accountant. How does changing over work?",
    answer: "We collect your previous records and returns, and the professional communication with your existing accountant is standard practice and handled by us. Your filing history and continuity are preserved."
  },
  {
    question: "Do I need to visit the Rajkot office?",
    answer: "Not usually. Documents can be shared over email or WhatsApp and most matters are handled remotely. If a meeting helps, you are welcome at the Rajkot office, and consultations are available in Gujarati, Hindi and English."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-white/10 px-6 py-24"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-4xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif italic mb-4">Frequently Asked Questions.</h2>
        <p className="text-gray-400 text-lg">Common questions from business owners and individuals.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-medium text-lg text-white pr-8">{faq.question}</span>
              {openIndex === i ? (
                <Minus className="w-5 h-5 text-[#e6ff00] shrink-0" />
              ) : (
                <Plus className="w-5 h-5 text-gray-500 shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 pt-0 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      </div></div>
    </section>
  );
}
