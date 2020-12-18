# Generates the news file off of a text file (very simple script, I'm just lazy XD)
import json
import datetime

def getCurrentDate():
    today = datetime.date.today()
    formattedDate = today.strftime('%d/%m/%Y')
    return formattedDate



if __name__ == "__main__":
    print(getCurrentDate())