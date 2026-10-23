import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("description: \"Kadivar & Associates is a firm of Chartered Accountants in Rajkot, Gujarat. We provide services in GST, statutory audit, and tax compliance.\",", "description: \"Kadivar & Associates is a firm of Chartered Accountants in Rajkot, Gujarat. We provide services in GST, statutory audit, and tax compliance.\",\n  alternates: { canonical: './' },")

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
