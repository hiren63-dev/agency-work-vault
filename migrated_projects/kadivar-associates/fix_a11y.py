import re

def fix_form(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find label + input pairs and add ids/htmlFors
    fields = ['Full Name', 'Name', 'Email', 'Phone (Optional)', 'Subject', 'Message / Requirements']
    
    for field in fields:
        field_id = field.lower().replace(' ', '-').replace('/', '').replace('(', '').replace(')', '').replace('--', '-')
        
        # Replace label
        content = content.replace(
            f'<label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{field}</label>',
            f'<label htmlFor="{field_id}" className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{field}</label>'
        )
        
        # We need to find the next input/select/textarea and add id={field_id}
        # A bit tricky with regex, let's just do it manually for the known ones:
        
    content = content.replace('type="text" className="w-full', 'type="text" id="name" className="w-full')
    content = content.replace('type="email" className="w-full', 'type="email" id="email" className="w-full')
    content = content.replace('type="tel" className="w-full', 'type="tel" id="phone-optional" className="w-full')
    content = content.replace('<select className="w-full', '<select id="subject" className="w-full')
    content = content.replace('<textarea rows={4} className="w-full', '<textarea id="message-requirements" rows={4} className="w-full')
    content = content.replace('<textarea rows={3} placeholder="How can we help you?"', '<textarea id="message-requirements" rows={3} placeholder="How can we help you?"')

    # Add focus states: focus-visible:ring-2 focus-visible:ring-[#e6ff00] focus-visible:outline-none
    content = content.replace('focus:outline-none focus:border-[#e6ff00]', 'focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00]')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_form('src/components/ServiceEnquiryForm.tsx')
fix_form('src/components/ContactForm.tsx')
fix_form('src/components/LeadGen.tsx')
print("done")
