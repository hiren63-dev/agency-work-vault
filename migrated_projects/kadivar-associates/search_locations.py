import os

matches = []
for root, dirs, files in os.walk('src'):
    for file in files:
        filepath = os.path.join(root, file)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'morbi' in content.lower() or 'wankaner' in content.lower():
                    matches.append(filepath)
        except Exception as e:
            pass

print("Files containing Morbi or Wankaner:")
for m in matches:
    print(m)
