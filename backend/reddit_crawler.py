import requests
from config import REDDIT_CRED
import json
from model import analyze

client_auth = requests.auth.HTTPBasicAuth(REDDIT_CRED['ID'], REDDIT_CRED['SECRET'])
post_data = {"grant_type": "client_credentials", "username": REDDIT_CRED['USER'], "password": REDDIT_CRED["PASSWORD"]}
headers = headers = {"User-Agent": "MovieReviewer/0.1 by michaeljavy"}

def tagDownload(tag):
	tag = tag+" review"
	reviews = {'data':[]}
	response = requests.post("https://www.reddit.com/api/v1/access_token", auth=client_auth, data=post_data, headers=headers)
	response = response.json()
	access_token = response['access_token']
	token_type = response['token_type']
	new_headers = {"Authorization": str(token_type+" "+access_token), "User-Agent": "MovieReviewer/0.1 by michaeljavy"}
	response = requests.get("https://oauth.reddit.com/r/all/search?q="+tag+"&sort=relevance&limit=20", headers=new_headers)
	if response.status_code==200:
		redditData = response.json()
		redditData = redditData["data"]["children"]
		for post in redditData:
			post_id = post["data"]["id"]
			response = requests.get("https://oauth.reddit.com/r/all/comments/"+post_id+"?depth=1", headers=new_headers)
			if response.status_code==200:
				redditData = response.json()[1]["data"]["children"][:-1]
				for comment in redditData:
					if len(comment["data"]["body"])>300:
						continue #review too long
					reviews['data'] += [{"up":comment["data"]["ups"],"review":comment["data"]["body"],"url":"https://www.reddit.com"+comment["data"]["permalink"]}]
	else:
	    return None
	return analyze(tag,reviews)


if __name__=="__main__":
	tagDownload("the prodigy")
