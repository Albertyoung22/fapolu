import os
import re
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_URL = "https://fapolu.com.tw/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

visited = set()
pages_data = []

def clean_text(text):
    if not text:
        return ""
    lines = [line.strip() for line in text.split("\n")]
    return "\n".join([line for line in lines if line])

def get_links_from_page(soup, current_url):
    links = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        full_url = urljoin(current_url, href)
        parsed = urlparse(full_url)
        # only keep internal links
        if parsed.netloc == urlparse(BASE_URL).netloc:
            # normalize
            clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            # exclude wp-admin, feed, etc.
            if not any(x in clean_url for x in ["/wp-json", "/feed", "/wp-admin", "/xmlrpc", ".jpg", ".png", ".pdf", ".zip"]):
                links.add(clean_url)
    return links

def crawl(url):
    if url in visited or len(visited) > 60:
        return
    visited.add(url)
    print(f"Crawling: {url}")
    try:
        resp = requests.get(url, headers=headers, timeout=12, verify=False)
        if resp.status_code != 200:
            print(f"Failed {url} with status {resp.status_code}")
            return
        
        soup = BeautifulSoup(resp.text, "html.parser")
        
        title = soup.title.string.strip() if soup.title else ""
        
        # Remove script and style elements
        for s in soup(["script", "style", "noscript"]):
            s.decompose()
            
        # Divi content usually in #main-content or .et_builder_inner_content or .entry-content
        content_container = soup.find(id="main-content") or soup.find("article") or soup.find("body")
        
        # Collect images
        images = []
        for img in content_container.find_all("img", src=True):
            src = urljoin(url, img["src"])
            alt = img.get("alt", "").strip()
            images.append({"src": src, "alt": alt})
            
        # Collect text paragraphs, headings, lists
        sections = []
        for el in content_container.find_all(["h1", "h2", "h3", "h4", "h5", "p", "li"]):
            t = el.get_text().strip()
            if t and len(t) > 1:
                sections.append({"tag": el.name, "text": t})
                
        raw_text = clean_text(content_container.get_text())
        
        pages_data.append({
            "url": url,
            "title": title,
            "images": images,
            "sections": sections,
            "text": raw_text
        })
        
        new_links = get_links_from_page(soup, url)
        for link in new_links:
            crawl(link)
            
    except Exception as e:
        print(f"Error crawling {url}: {e}")

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    print("Starting crawl of fapolu.com.tw...")
    crawl(BASE_URL)
    
    os.makedirs("data", exist_ok=True)
    with open("data/crawled_site.json", "w", encoding="utf-8") as f:
        json.dump(pages_data, f, ensure_ascii=False, indent=2)
    print(f"Done! Crawled {len(pages_data)} pages. Saved to data/crawled_site.json")

