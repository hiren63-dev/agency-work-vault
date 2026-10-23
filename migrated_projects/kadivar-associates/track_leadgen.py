import re

with open('src/components/LeadGen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { track } from "@vercel/analytics";')

content = content.replace('setSubmitted(true);', 'setSubmitted(true);\n      track("Contact Form Submitted");')
content = content.replace('href="tel:+919016284892"', 'href="tel:+919016284892" onClick={() => track("Call Click")}')
content = content.replace('href="https://wa.me/919016284892?text=Hello"', 'href="https://wa.me/919016284892?text=Hello" onClick={() => track("WhatsApp Click")}')

with open('src/components/LeadGen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
