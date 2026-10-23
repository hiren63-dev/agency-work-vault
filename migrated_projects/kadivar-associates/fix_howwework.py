import re

with open('src/app/how-we-work/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { Methodology } from "@/components/Methodology";\n', '')
content = content.replace('<Methodology />', '')

with open('src/app/how-we-work/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
