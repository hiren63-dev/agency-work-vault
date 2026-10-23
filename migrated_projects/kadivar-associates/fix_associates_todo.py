import re

with open('src/components/Associates.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import Image from "next/image";',
    'import Image from "next/image";\nimport { siteConfig } from "@/lib/config";'
)

content = content.replace(
    '<p className="text-sm font-mono text-gray-500 mb-8">ICAI Membership No: [TODO]</p>',
    '{siteConfig.icaiMembershipNo && <p className="text-sm font-mono text-gray-500 mb-8">ICAI Membership No: {siteConfig.icaiMembershipNo}</p>}'
)

with open('src/components/Associates.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
