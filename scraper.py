import requests
from bs4 import BeautifulSoup
import json

BASE_URL = "https://ethglobal.com"
EVENT = "eventname"
PAGES = 20 

def scrape_projects():
    projects = []
    for page in range(1, PAGES + 1):
        url = f"{BASE_URL}/showcase/page/{page}?events={EVENT}"
        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            continue

        soup = BeautifulSoup(response.text, 'html.parser')
        project_cards = soup.find_all('a', class_='block border-2 border-black rounded overflow-hidden relative')

        for a in project_cards:
            try:
                name = a.find('h2', class_='text-2xl').text.strip()
                description = a.find('p', class_='text-sm mt-4 mb-4').text.strip()
                link = BASE_URL + a['href']
                image = a.find('img', alt='cover photo')['src']
                winner = a.find('img', alt='trophy') is not None
                
                projects.append({
                    "name": name,
                    "description": description,
                    "link": link,
                    "image": image,
                    "winner": winner
                })
            except AttributeError as e:
                print(f"Error parsing project card: {e}")
                continue

    print(f"Scraped {len(projects)} projects.")
    return projects

def save_projects_to_json(projects, filename='projects.json'):
    with open(filename, 'w') as f:
        json.dump(projects, f, indent=4)
    print(f"Saved {len(projects)} projects to {filename}")

if __name__ == "__main__":
    projects = scrape_projects()
    save_projects_to_json(projects)
