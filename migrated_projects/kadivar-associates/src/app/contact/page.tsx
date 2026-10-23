import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with CA Irfan Kadivar at Kadivar & Associates in Rajkot for statutory audit, direct tax litigation, and GST compliance.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10 flex flex-col">
      <Navbar />
      <div className="pt-40 pb-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Get in Touch.</h1>
          <p className="text-gray-400 text-lg">
            Schedule a consultation with our partners to discuss your accounting, audit, and tax requirements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Rajkot Office Details */}
          <div className="lg:col-span-5 space-y-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6ff00] block mb-2">Office Location</span>
              <h2 className="text-2xl font-serif italic text-white mb-4">Rajkot Headquarters</h2>
              
              <div className="flex items-start gap-3 text-gray-300 mb-6">
                <MapPin className="w-5 h-5 text-[#e6ff00] shrink-0 mt-1" />
                <div className="leading-relaxed text-sm">
                  <p className="font-medium text-white">{siteConfig.rajkotAddress.line1}</p>
                  <p>{siteConfig.rajkotAddress.line2}</p>
                  <p>{siteConfig.rajkotAddress.city} – {siteConfig.rajkotAddress.pincode}, {siteConfig.rajkotAddress.state}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Direct Inquiries</span>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#e6ff00] shrink-0" />
                <a href={`tel:${siteConfig.phoneRaw}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {siteConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#e6ff00] shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {siteConfig.email}
                </a>
              </div>

              <div className="pt-2">
                <a 
                  href={`https://wa.me/${siteConfig.phoneRaw.replace('+', '')}?text=Hello%20CA%20Irfan%20Kadivar`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" /> Message on WhatsApp
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-3">Office Timings</span>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-[#e6ff00] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p><strong className="text-gray-300">Mon – Fri:</strong> 10:00 AM – 7:00 PM</p>
                  <p><strong className="text-gray-300">Saturday:</strong> 10:00 AM – 5:00 PM</p>
                  <p className="text-gray-500">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-2xl font-serif italic text-white mb-2">Send an Enquiry</h2>
            <p className="text-gray-400 text-sm mb-8">Fill in your requirements and our team will get back to you within 24 working hours.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
