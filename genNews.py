# Generates the news file off of a text file (very simple script, I'm just lazy XD)
import json
import sys
import pathlib
import ftplib
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
    pastNews.update({newsKey: {'News': news.get('News'), 'Date': news.get('Date'), 'Author': news.get('Author')}})

    with open('./web/assets/PastNews.json', 'wt') as writePastNewsFile:
        writePastNewsFile.write(json.dumps(pastNews, indent=2))

def writeCurrentNews(title, author):
    if pathlib.Path('./article.txt').exists():
        with open('./article.txt', 'rt') as article:
            newsArticle = article.read()
    else:
        newsArticle = 'Beep Boop, This article has been destroyed by guardians.'

    with open('./web/assets/News.json', 'rt') as readNewsJson:
        newsData = json.loads(readNewsJson.read())
        newsData.clear()
        newsData.update({"Title": title, "Author": author, "Date": getCurrentDate(), "News": newsArticle})

    with open('./web/assets/News.json', 'wt') as writeNewsJson:
        writeNewsJson.write(json.dumps(newsData, indent=2))

def uploadNewsFiles(fileName, fileObj):
    with open('privars.json', 'rt') as readCredentials:
        credentials = json.loads(readCredentials.read())['ftpDetails']
    ftp = ftplib.FTP(credentials.get('host'))
    ftp.login(user=credentials.get('user'), passwd=credentials.get('password'))
    ftp.storbinary(f'STOR {fileName}', open(fileObj, 'rb'))
    print(f'Successfully transferred {fileName} to the server!')
    try:
        ftp.quit()
    except:
        ftp.close()

if __name__ == "__main__":
    currentNewsFile = pathlib.Path('./web/assets/News.json')
    pastNewsFile = pathlib.Path('./web/assets/PastNews.json')
    updatePastNews()
    writeCurrentNews(sys.argv[1], sys.argv[2])
    print(getCurrentDate())
    uploadNewsFiles(currentNewsFile.name, currentNewsFile)
    uploadNewsFiles(pastNewsFile.name, pastNewsFile)