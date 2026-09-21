import urllib.request
from bs4 import BeautifulSoup
import json
import re

url = 'https://en.wikipedia.org/wiki/List_of_colleges_affiliated_to_the_Dr._A._P._J._Abdul_Kalam_Technical_University,_Lucknow'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read()
    soup = BeautifulSoup(html, 'html.parser')
    colleges = []
    
    tables = soup.find_all('table', class_='wikitable')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cols = row.find_all(['td', 'th'])
            if len(cols) >= 2:
                name = cols[1].text.strip()
                name = re.sub(r'\[.*?\]', '', name)
                if name and 'Name' not in name:
                    colleges.append(name)
                    
    colleges = list(set(colleges))
    with open('aktu_colleges.json', 'w', encoding='utf-8') as f:
        json.dump(colleges, f, indent=2)
    print(f'Saved {len(colleges)} colleges to aktu_colleges.json')
except Exception as e:
    print(e)
