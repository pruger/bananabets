import requests
from bs4 import BeautifulSoup
import json

BASE_URL = "https://ethglobal.com"
EVENT = "eventname"
FINALIST_IMAGE_PART = "ethglobal_square_padding.png"  
NEXT_IMAGE_BASE_URL = "https://ethglobal.com"

def scrape_projects():
    projects = []
    project_links = set()
    page = 1

    while True:
        url = f"{BASE_URL}/showcase/page/{page}?events={EVENT}"
        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        project_cards = soup.find_all('a', class_='block border-2 border-black rounded overflow-hidden relative')

        new_projects_found = False
        for a in project_cards:
            link = BASE_URL + a['href']
            if link in project_links:
                continue
            
            project_links.add(link)
            new_projects_found = True

            try:
                name = a.find('h2', class_='text-2xl').text.strip()
                description = a.find('p', class_='text-sm mt-4 mb-4').text.strip()
                image = a.find('img', alt='cover photo')['src']
                winner = a.find('img', alt='trophy') is not None

                trophy_images = [NEXT_IMAGE_BASE_URL + img['src'] for img in a.find_all('img', alt='trophy')]

                finalist = any(FINALIST_IMAGE_PART in img_url for img_url in trophy_images)
                
                projects.append({
                    "name": name,
                    "description": description,
                    "link": link,
                    "image": image,
                    "winner": winner,
                    "finalist": finalist,
                    "trophy_images": trophy_images
                })
            except AttributeError as e:
                print(f"Error parsing project card: {e}")
                continue
        
        if not new_projects_found:
            break

        page += 1

    print(f"Scraped {len(projects)} projects.")
    return projects

def save_projects_to_json(projects, filename='projects.json'):
    with open(filename, 'w') as f:
        json.dump(projects, f, indent=4)
    print(f"Saved {len(projects)} projects to {filename}")

if __name__ == "__main__":
    projects = scrape_projects()
    save_projects_to_json(projects)
