import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { ArrowUpRight, Calculator } from "lucide-react";',
    'import { ArrowUpRight, Calculator } from "lucide-react";\nimport { siteConfig } from "@/lib/config";'
)

content = content.replace(
    '<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">\n            <Calculator className="w-4 h-4 text-gray-400" />\n            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-300">Firm Registration No. [TODO]</span>\n          </div>',
    '{siteConfig.firmRegistrationNo && (<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">\n            <Calculator className="w-4 h-4 text-gray-400" />\n            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-300">Firm Registration No. {siteConfig.firmRegistrationNo}</span>\n          </div>)}'
)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
