import re

with open('src/app/contact/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

form_start = content.find('<form className="space-y-6">')
form_end = content.find('</form>') + len('</form>')

content = content[:form_start] + "<ContactForm />" + content[form_end:]
content = content.replace('import { Navbar } from "@/components/Navbar";', 'import { Navbar } from "@/components/Navbar";\nimport { ContactForm } from "@/components/ContactForm";')

with open('src/app/contact/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
