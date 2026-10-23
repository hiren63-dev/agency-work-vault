import Link from "next/link";
import { SERVICES_DATA } from "@/lib/services-data";
import { siteConfig } from "@/lib/config";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="font-serif italic text-2xl tracking-tight block mb-4">
            Kadivar <span className="font-sans font-medium text-gray-400 not-italic text-lg">& Associates</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Chartered Accountants · Rajkot, Gujarat<br />
            {siteConfig.firmRegistrationNo && <>ICAI Firm Registration No: {siteConfig.firmRegistrationNo}<br /></>}
            {siteConfig.icaiMembershipNo && <>CA Irfan Kadivar Membership No: {siteConfig.icaiMembershipNo}</>}
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a 
              href="https://www.linkedin.com/in/ca-irfan-kadivar-0b7431190/" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-mono uppercase tracking-widest text-white mb-6">Practice Areas</h4>
          <ul className="space-y-3">
            {SERVICES_DATA.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-mono uppercase tracking-widest text-white mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About the Firm</Link></li>
            <li><Link href="/how-we-work" className="text-gray-400 hover:text-white transition-colors text-sm">How We Work</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
          </ul>
          
          <h4 className="text-sm font-mono uppercase tracking-widest text-white mb-6 mt-8">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors text-sm">Disclaimer</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-mono uppercase tracking-widest text-white mb-6">Headquarters</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#e6ff00] shrink-0 mt-0.5" />
              <div className="text-gray-300 text-sm leading-relaxed">
                <p className="font-medium text-white mb-1">Rajkot Office</p>
                <p>{siteConfig.rajkotAddress.line1},</p>
                <p>{siteConfig.rajkotAddress.line2},</p>
                <p>{siteConfig.rajkotAddress.city} – {siteConfig.rajkotAddress.pincode}, {siteConfig.rajkotAddress.state}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <Phone className="w-4 h-4 text-[#e6ff00] shrink-0" />
              <a href={`tel:${siteConfig.phoneRaw}`} className="text-gray-300 hover:text-[#e6ff00] transition-colors text-sm">
                {siteConfig.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#e6ff00] shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="text-gray-300 hover:text-[#e6ff00] transition-colors text-sm">
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
        <p>© {new Date().getFullYear()} Kadivar & Associates. All rights reserved.</p>
        <p>Information provided in compliance with ICAI guidelines.</p>
      </div>
    </footer>
  );
}
