import re

def add_track_to_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'import { track } from "@vercel/analytics";' not in content:
        # Add client directive if not present
        if '"use client"' not in content:
            content = '"use client";\n' + content
        
        # Add import
        content = content.replace('import { Navbar }', 'import { track } from "@vercel/analytics";\nimport { Navbar }')
        
    # Replace <form className="space-y-6"> with onSubmit handler
    content = content.replace('<form className="space-y-6">', '<form className="space-y-6" onSubmit={(e) => { e.preventDefault(); track("Contact Form Submitted"); alert("Enquiry submitted successfully."); }}>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

add_track_to_file('src/app/services/[slug]/page.tsx')
add_track_to_file('src/app/contact/page.tsx')
print("done")
