import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

imports = """import { Navbar } from "@/components/Navbar";
import { LeadGen } from "@/components/LeadGen";
import { VirtualCFOSection } from "@/components/VirtualCFOSection";
import { StickyServices } from "@/components/StickyServices";
import { Methodology } from "@/components/Methodology";
import { InsightsGrid } from "@/components/InsightsGrid";
import { TrustAndTestimonials } from "@/components/TrustAndTestimonials";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";"""

content = re.sub(r'import \{ motion \}.*?import \{ VirtualCFOSection \} from "@/components/VirtualCFOSection";', imports, content, flags=re.DOTALL)

parts = content.split('</section>')
hero_section = parts[0] + '</section>'

footer = """      <LeadGen />
      
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12 px-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-sm text-gray-600 font-mono">
          <p>© {new Date().getFullYear()} Kadivar & Associates.</p>
          <p className="hidden md:block text-white/10">|</p>
          <p>Rajkot Headquarters</p>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-white transition-colors relative group">
            LinkedIn
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#" className="hover:text-white transition-colors relative group">
            Twitter
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </a>
        </div>
      </motion.footer>
    </main>
  );
}
"""

new_content = hero_section + """

      <Methodology />

      <StickyServices />

      <VirtualCFOSection />

      <TrustAndTestimonials />

      <InsightsGrid />

""" + footer

with open('src/app/page.tsx', 'w') as f:
    f.write(new_content)
print("page.tsx rewritten successfully")
