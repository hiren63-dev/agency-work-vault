import re

with open('src/app/sitemap.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const baseUrl = 'https://kadivar-redesign.vercel.app'",
    "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kadivar-redesign.vercel.app'"
)

with open('src/app/sitemap.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
