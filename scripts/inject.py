import json
import re

with open('aktu_colleges.json', 'r', encoding='utf-8') as f:
    colleges = json.load(f)

with open('src/lib/categories.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_arr = 'export const AKTU_COLLEGES = [\n'
for c in sorted(colleges):
    # Escape quotes
    c = c.replace('"', '\\"')
    new_arr += f'  "{c}",\n'
new_arr += '  "Other / Unlisted Affiliated College"\n]'

content = re.sub(r'export const AKTU_COLLEGES = \[\s*.*?\]', new_arr, content, flags=re.DOTALL)

with open('src/lib/categories.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Injected {len(colleges)} colleges')
