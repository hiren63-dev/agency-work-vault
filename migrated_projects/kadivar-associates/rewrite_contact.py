import re

with open('src/app/contact/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Corporate Email', 'Email')
content = content.replace('<div>\n              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Subject</label>', '<div>\n              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Phone (Optional)</label>\n              <input type="tel" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] transition-colors" />\n            </div>\n            <div>\n              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Subject</label>')

with open('src/app/contact/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
