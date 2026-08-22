import requests
from bs4 import BeautifulSoup

def get_message(google_doc):
    response = requests.get(google_doc)
    response.raise_for_status()
    s = BeautifulSoup(response.text, "html.parser")
    table = s.find("table")
    if table is None:
        raise ValueError("Table not in Google Doc")

    rows = table.find_all("tr")
    entries = []
    max_x = 0
    max_y = 0
    for r in rows[1:]:
        cells = r.find_all("td")
        if len(cells) < 3:
            continue
        x = int(cells[0].get_text())
        char = cells[1].get_text()
        y = int(cells[2].get_text())
        if char == "":
            char = " "
        entries.append((x, char, y))
        max_x = max(max_x, x)
        max_y = max(max_y, y)

    grid = [[" " for _ in range(max_x + 1)] for _ in range(max_y + 1)]
    for x, char, y in entries:
        grid[y][x] = char

    for row in grid:
        print("".join(row))

if __name__ == "__main__":
    url = "https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub"
    get_message(url)