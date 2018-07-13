from bs4 import BeautifulSoup
from urllib.request import urlopen

# read html file and create soup object
response = urlopen('https://learningenglish.voanews.com/a/lets-learn-english-lesson-26-this-game-is-fun/3457248.html')
html = response.read()
soup = BeautifulSoup(html, 'html.parser')

div = soup.find(id="us-map")

file = open("map.html","w+")
file.write(soup.text)
file.close()