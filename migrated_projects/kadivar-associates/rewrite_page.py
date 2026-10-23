import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace imports
imports = """import { Navbar } from "@/components/Navbar";
import { LeadGen } from "@/components/LeadGen";
import { VirtualCFOSection } from "@/components/VirtualCFOSection";
import { StickyServices } from "@/components/StickyServices";
import { Associates } from "@/components/Associates";
import { FAQ } from "@/components/FAQ";
import { ArrowUpRight, Calculator } from "lucide-react";
import { motion } from "framer-motion";"""

content = re.sub(r'import \{ Navbar \}.*?import \{ motion \} from "framer-motion";', imports, content, flags=re.DOTALL)

# Replace the Hero section
hero_start = content.find('{/* Hero Section */}')
hero_end = content.find('</section>', hero_start) + len('</section>')

new_hero = """{/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 md:pt-52 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen motion-safe:animate-pulse" />
        
        <div className="max-w-4xl flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <Calculator className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-300">Firm Registration No. [TODO]</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif italic mb-6 leading-[1.1] tracking-tight text-white">
            Chartered Accountants<br />
            <span className="font-sans font-medium not-italic text-4xl md:text-6xl text-gray-400">in Rajkot, Gujarat.</span>
          </h1>
          
          <p className="text-gray-400 font-sans text-lg md:text-xl max-w-2xl text-balance mb-10 leading-relaxed">
            Kadivar & Associates provides statutory audit, tax compliance, and corporate advisory services to businesses and individuals.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="/#services" className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-tight hover:bg-gray-200 transition-colors flex items-center gap-2">
              View Services <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href="/about" className="text-gray-400 hover:text-white px-8 py-4 font-medium tracking-tight transition-colors">
              About the Firm
            </a>
          </div>
        </div>
      </section>"""

content = content[:hero_start] + new_hero + content[hero_end:]

# Remove components
content = content.replace("<Methodology />", "")
content = content.replace("<TrustAndTestimonials />", "")
content = content.replace("<InsightsGrid />", "")

# Remove empty lines that were left behind
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
