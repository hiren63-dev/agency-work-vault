import re

with open('src/components/VirtualCFOSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace metrics with placeholders
content = content.replace('metric: "$2.4M"', 'metric: "₹ [XX.X] Cr"')
content = content.replace('metric: "18.5%"', 'metric: "[XX]%"')
content = content.replace('metric: "4.2x"', 'metric: "[X.X]x"')

# Remove dollar sign rendering
content = content.replace("""{activeData.id === 'cash-flow' && <span className="text-3xl md:text-5xl text-gray-500 mt-2">$</span>}""", "")
content = content.replace("""{activeData.metric.replace('$', '')}""", "{activeData.metric}")

with open('src/components/VirtualCFOSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
