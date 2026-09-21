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
    # Check headers
    headers = [th.text.strip().lower() for th in table.find_all('th')]
    if 'name of college' not in headers and 'name of the college' not in headers:
        # Check if the first row contains it instead
        first_row = [td.text.strip().lower() for td in table.find_all('td')]
        if not any('name of college' in x for x in first_row):
            continue
            
    # Find district
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
            if name and not name.isdigit():
                if loc and loc not in name:
                    name = f'{name}, {loc}'
                colleges.append(name)

colleges = list(set(colleges))
valid_colleges = [c for c in colleges if len(c) > 5 and not c.isdigit()]

with open('src/lib/categories.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_arr = 'export const AKTU_COLLEGES = [\n'
for c in sorted(valid_colleges):
    c = c.replace('"', '\\"')
    new_arr += f'  "{c}",\n'
new_arr += '  "Other / Unlisted Affiliated College"\n]'

content = re.sub(r'export const AKTU_COLLEGES = \[\s*.*?\]', new_arr, content, flags=re.DOTALL)

with open('src/lib/categories.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Injected {len(valid_colleges)} valid colleges with districts')
