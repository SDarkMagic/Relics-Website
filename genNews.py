# Generates the news file off of a text file (very simple script, I'm just lazy XD)
import json
import datetime

def getCurrentDate():
    today = datetime.date.today()
    formattedDate = today.strftime('%d/%m/%Y')
    return formattedDate

def updatePastNews():
    with open('./web/assets/News.json', 'rt') as readNewsFile:
        news = json.loads(readNewsFile.read())

    with open('./web/assets/PastNews.json', 'rt') as readPastNewsFile:
        pastNews = json.loads(readPastNewsFile.read())

    newsKey = news.get('Title')
    pastNews.update({newsKey: {'News': news.get('News'), 'Date': news.get('Date')}})

    with open('./web/assets/PastNews.json', 'wt') as writePastNewsFile:
        writePastNewsFile.write(json.dumps(pastNews, indent=2))

if __name__ == "__main__":
    updatePastNews()
    print(getCurrentDate())