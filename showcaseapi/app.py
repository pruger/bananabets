import requests
from bs4 import BeautifulSoup
import json
from web3 import Web3
import os

from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache

BASE_URL = "https://ethglobal.com"
EVENT = "eventname"
FINALIST_IMAGE_PART = "ethglobal_square_padding.png"  # Finalist trophy
NEXT_IMAGE_BASE_URL = "https://ethglobal.com"  # Base URL for the next/image srcset URLs

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

        soup = BeautifulSoup(response.text, "html.parser")
        project_cards = soup.find_all(
            "a", class_="block border-2 border-black rounded overflow-hidden relative"
        )

        new_projects_found = False
        for a in project_cards:
            link = BASE_URL + a["href"]
            if link in project_links:
                continue

            project_links.add(link)
            new_projects_found = True

            try:
                name = a.find("h2", class_="text-2xl").text.strip()
                description = a.find("p", class_="text-sm mt-4 mb-4").text.strip()
                image = a.find("img", alt="cover photo")["src"]
                winner = a.find("img", alt="trophy") is not None

                # Extract and sanitize all trophy images
                trophy_images = []
                for img in a.find_all("img", alt="trophy"):
                    img_src = img["src"]
                    if img_src.startswith("http"):
                        trophy_images.append(img_src)
                    else:
                        trophy_images.append(NEXT_IMAGE_BASE_URL + img_src)

                # Check for finalist trophy image URL pattern matching
                finalist = any(
                    FINALIST_IMAGE_PART in img_url for img_url in trophy_images
                )

                projects.append(
                    {
                        "name": name,
                        "description": description,
                        "link": link,
                        "image": image,
                        "winner": winner,
                        "finalist": finalist,
                        "trophy_images": trophy_images,
                    }
                )
            except AttributeError as e:
                print(f"Error parsing project card: {e}")
                continue

        if not new_projects_found:
            break

        page += 1

    print(f"Scraped {len(projects)} projects.")
    return projects


@cache(expire=300)  # Cache for 5 minutes
async def get_projects():
    try:
        projects = scrape_projects()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error scraping projects")
    return projects


@app.get("/")
def rindex():
    return {"message": "API Up and running"}


@app.get("/projects")
async def read_projects():
    projects = await get_projects()
    return JSONResponse(content=projects)


@app.on_event("startup")
async def on_startup():
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")


w3 = Web3(Web3.HTTPProvider("https://jenkins.rpc.caldera.xyz/http"))
if not w3.is_connected(show_traceback=True):
    raise Exception("couldnt connect rpc")
pk = os.environ.get("PRIVATE_KEY")
if not pk:
    raise Exception("please provide a PRIVATE_KEY")
account = w3.eth.account.from_key(pk)
with open("ape-abi.json", "r") as f:
    abi = f.read()
contractAddress = os.environ.get("CONTRACT_ADDRESS")
if not contractAddress:
    raise Exception("please provide a CONTRACT_ADDRESS")


@app.post("/send-transaction")
async def send_transaction(v: int, r: str, s: str, hash: str, votes: str):
    bytes_votes = bytes.fromhex(votes)
    voteContract = w3.eth.contract(abi=abi, address=contractAddress)
    transaction = voteContract.functions.submitVote(
        v, r, s, hash, bytes_votes
    ).build_transaction(
        {
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address),
        }
    )
    signed_transaction = account.sign_transaction(transaction)

    tx_hash = w3.eth.send_raw_transaction(signed_transaction.rawTransaction)
    print(tx_hash)
    projects = await get_projects()
    return JSONResponse(content=projects)


# @app.post("/submit-projects")
# async def vote():
#     pass

# @app.post("/finish-voting")
# async def send_transaction(secret: str, asd: int):
#     if secret != "deadbeef1337qqqwe":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Forbidden: Your password is wrong you monkey"
#         )
#     return JSONResponse()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
