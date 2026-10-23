import re

def fix_location(file_path, city):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('import { Navbar } from "@/components/Navbar";', 'import { Navbar } from "@/components/Navbar";\nimport { siteConfig } from "@/lib/config";')
    
    address_search = f"Address Line 1,<br />\n            Address Line 2,<br />\n            {city} [PIN]"
    address_replace = f"{{siteConfig.{city.lower()}Address ? siteConfig.{city.lower()}Address : '{city} Office'}}"
    
    content = content.replace(address_search, address_replace)
    content = content.replace('<p className="mb-2"><strong className="text-gray-300">Phone:</strong> +91 [TODO]</p>', f"{{siteConfig.{city.lower()}Phone && <p className=\"mb-2\"><strong className=\"text-gray-300\">Phone:</strong> {{siteConfig.{city.lower()}Phone}}</p>}}")
    
    # Add map placeholder and hours
    map_html = """
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-serif italic text-white mb-6">Location Map</h2>
          <div className="aspect-video w-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <p className="text-gray-500 font-mono text-sm">[Map Embed Placeholder - Please provide Google Maps link]</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-serif italic text-white mb-6">Office Hours</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex justify-between"><span>Monday - Friday</span> <span>10:00 AM - 7:00 PM</span></li>
            <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 5:00 PM</span></li>
            <li className="flex justify-between text-gray-500"><span>Sunday</span> <span>Closed</span></li>
          </ul>
        </div>
"""
    
    content = content.replace('</article>', map_html + '</article>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_location('src/app/locations/morbi/page.tsx', 'Morbi')
fix_location('src/app/locations/wankaner/page.tsx', 'Wankaner')
print("done")
