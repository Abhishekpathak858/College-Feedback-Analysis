import urllib.request
from bs4 import BeautifulSoup
import re
import json

url = 'https://en.wikipedia.org/wiki/List_of_colleges_affiliated_to_the_Dr._A._P._J._Abdul_Kalam_Technical_University,_Lucknow'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read()
soup = BeautifulSoup(html, 'html.parser')

colleges = []
for table in soup.find_all('table', class_='wikitable'):
    # find previous h3 or h4
    prev = table.find_previous(['h3', 'h4'])
    if prev:
        loc = prev.text.replace('[edit]', '').replace('district', '').strip()
    else:
        loc = ""
        
    for row in table.find_all('tr')[1:]:
        cols = row.find_all(['td', 'th'])
        if len(cols) >= 3:
            name = cols[2].text.strip()
            name = re.sub(r'\[.*?\]', '', name)
            if name and 'Name' not in name:
                # append loc if not already there
                if loc and loc not in name:
                    name = f'{name}, {loc}'
                colleges.append(name)
        elif len(cols) == 2:
             name = cols[1].text.strip()
             name = re.sub(r'\[.*?\]', '', name)
             if name and 'Name' not in name:
                 if loc and loc not in name:
                     name = f'{name}, {loc}'
                 colleges.append(name)

colleges = list(set(colleges))

with open('src/lib/categories.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_arr = 'export const AKTU_COLLEGES = [\n'
for c in sorted(colleges):
    c = c.replace('"', '\\"')
    new_arr += f'  "{c}",\n'
new_arr += '  "Other / Unlisted Affiliated College"\n]'

content = re.sub(r'export const AKTU_COLLEGES = \[\s*.*?\]', new_arr, content, flags=re.DOTALL)

with open('src/lib/categories.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Injected {len(colleges)} colleges with districts')
