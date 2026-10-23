import re

with open('src/app/services/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the form HTML with the component
form_html = """<form className="space-y-6">
            <input type="hidden" name="service" value={service.title} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input type="text" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00]" required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00]" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Phone (Optional)</label>
              <input type="tel" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00]" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Message / Requirements</label>
              <textarea rows={4} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00]"></textarea>
            </div>
            <button type="submit" className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-gray-200 transition-colors">
              Submit Enquiry
            </button>
          </form>"""

content = content.replace(form_html, "<ServiceEnquiryForm serviceTitle={service.title} />")
content = content.replace('import { LeadGen } from "@/components/LeadGen";', 'import { LeadGen } from "@/components/LeadGen";\nimport { ServiceEnquiryForm } from "@/components/ServiceEnquiryForm";')

with open('src/app/services/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
