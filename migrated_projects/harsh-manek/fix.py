import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove REVIEWS up to Testimonials
content = re.sub(r'const REVIEWS = \[.*?function Testimonials\(\) \{.*?\n}\n', '', content, flags=re.DOTALL)

# 2. Remove ConversionVault section
content = re.sub(r'function ConversionVault\(\) \{.*?\n}\n', '', content, flags=re.DOTALL)

# 3. Remove them from HomePage
content = content.replace('      <Testimonials />\n', '')
content = content.replace('      <ConversionVault />\n', '')

# 4. Fix laudatory language
content = content.replace('7+ Years of Elite Client Handling', '7+ Years of Professional Experience')
content = content.replace('Let me solve <br />\n            <span className="font-serif italic text-muted font-normal">all your</span> finance problems.', 'Professional <br />\n            <span className="font-serif italic text-muted font-normal">financial & tax</span> advisory services.')
content = content.replace('Learn how top founders are maneuvering this space.', 'Learn how founders are maneuvering this space.')
content = content.replace('ELSS is fundamentally your best option.', 'ELSS is fundamentally a strong option.')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
