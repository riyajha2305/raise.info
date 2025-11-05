import requests
import json
import cloudscraper
from bs4 import BeautifulSoup
from time import sleep
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class Scraper:
    def __init__(self):
        self._search_URL = {
            "leetcode":"https://leetcode.com/graphql/",
        }
        self._post_request_body = {
            "leetcode": {
                "query": "\n    query discussPostItems($orderBy: ArticleOrderByEnum, $keywords: [String]!, $tagSlugs: [String!], $skip: Int, $first: Int) {\n  ugcArticleDiscussionArticles(\n    orderBy: $orderBy\n    keywords: $keywords\n    tagSlugs: $tagSlugs\n    skip: $skip\n    first: $first\n  ) {\n    totalNum\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      node {\n        uuid\n        title\n        slug\n        summary\n        topic {\n          id\n          }\n      }\n    }\n  }\n}\n    ",
                "variables": {
                    "orderBy": "MOST_RELEVANT",
                    "keywords": [
                        "{company_name} salary india"
                    ],
                    "tagSlugs": [
                        "compensation"
                    ],
                    "skip": 0,
                    "first": 10
                }
            }
        }
        self._headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
        }
        self._prompt = """
        You are an AI that returns ONLY valid JSON. No prose, no explanation.

        Extract salary related information from the following discussion content, the output JSON should have the following structure:
        {{
            "level_name": str or null, # e.g., "SDE I", "SDE II", "Senior Software Engineer", "L3", "L4"etc.
            "compensation": {{
                "base": float or 0,
                "bonus": float or 0,
                "stock": float or 0,
                "total_compensation": float or null # sum of base, bonus and stock
            }}
        }}
        For all the values which you are not able to find the value, set them to null, DO NOT FILL IN VALUES BASED ON ASSUMPTIONS.
        If you are not able find the level_name, return an empty JSON object.
        If you are not able to find any salary related information, return an empty JSON object.
        Do not make mistakes when identifying if the given number is in lakhs or crores, 1 lakh = 100,000 and 1 crore = 10,000,000 (note that numbers with lakhs may have an L suffix to it, like 12L = 12 lakhs = 1,200,000).

        There are multiple data given, i will separate the data using 9 dashes (---------), process each data separately and give me a list of JSON objects as output.

        This is the data you are supposed to work on:

        {data}
        """
        self._salaries = dict()
    
    def set_company(self, company_name):
        self._company = company_name

    def get_company(self):
        return self._company
    
    def set_salaries(self, salaries):
        self._salaries = salaries

    def get_salaries(self):
        return self._salaries
    
    def parse_data_llm(self, data_list):
        data = "\n\n\n---------\n\n\n".join(data_list)
        print(data)
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = self._prompt.format(data=data)
        response = model.generate_content(prompt)
        output = response.text[7:-3]

        output_data = json.loads(output)
        return output_data
        

    def scrape_forum_leetcode(self):
        def search_leetcode():
            company_name = self._company.lower()
            url = self._search_URL["leetcode"]

            post_body = self._post_request_body["leetcode"]
            post_body["variables"]["keywords"] = post_body["variables"]["keywords"][0].format(company_name=company_name)
            r = requests.post(url, headers=self._headers, json=post_body)

            output_data = r.json()["data"]["ugcArticleDiscussionArticles"]["edges"]
            return output_data

        def parse_discussion(url):
            scraper = cloudscraper.create_scraper(delay=5)

            while 1:
                r = scraper.get(url)
                if r.status_code != 200:
                    sleep(1)
                else:
                    break
            
            if r.status_code != 200:
                print(f"Failed to fetch the discussion page: {url}")
                return None

            output = r.text
            soup = BeautifulSoup(r.text, 'html.parser')
            next_data = soup.find('script', id='__NEXT_DATA__')

            output_data = list()
            if next_data:
                data = json.loads(next_data.string)
                data = data['props']['pageProps']['dehydratedState']['queries'][0]['state']['data']['ugcArticleDiscussionArticle']['content']
                data = data.replace('\\n', '\n')
                
                return data
            
            return None
            


        output_data = search_leetcode()

        data_list = list()
        for item in output_data:
            url_discussion = "https://leetcode.com/discuss/post/{id}/{slug}".format(id=item["node"]["topic"]["id"], slug=item["node"]["slug"])
            data_list.append(parse_discussion(url_discussion))
        
        while 1:
            try:
                return self.parse_data_llm(data_list)
            except Exception as e:
                print(f"Error occurred: {e}")
                continue
    
    def set_salaries_leetcode(self):
        data = {
            "company_name": self._company,
            "salaries": self.scrape_forum_leetcode()
        }

        salaries = self.get_salaries()
        salaries["leetcode"] = data
        self.set_salaries(salaries)
    
    def set_all_salaries(self):
        self.set_salaries_leetcode()

if __name__ == "__main__":
    companies = ["Google"]

    salaries = dict()
    for company in companies:
        sc = Scraper()
        sc.set_company(company)
        sc.set_all_salaries()
        salaries[company] = sc.get_salaries()

    with open("salaries.json", "w") as f:
        json.dump(salaries, f, indent=2)

