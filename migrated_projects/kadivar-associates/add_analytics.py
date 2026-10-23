import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { Footer } from "@/components/Footer";', 'import { Footer } from "@/components/Footer";\nimport { Analytics } from "@vercel/analytics/react";')
content = content.replace('</body>', '  <Analytics />\n      </body>')

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
