// Request json data
function requestNewsJson(fileRequest, callBack) {
    var xhttp = new XMLHttpRequest()
    var fileName = fileRequest.split('/')
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            jsonOut = JSON.parse(xhttp.responseText);
            callBack(jsonOut);
        }
    }
    xhttp.open('GET', fileRequest, true);
    xhttp.send()
}

// Request more json data
function requestPastNewsJson(fileRequest, articleName, callBack) {
    var xhttp = new XMLHttpRequest()
    var fileName = fileRequest.split('/')
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            jsonOut = JSON.parse(xhttp.responseText);
            callBack(jsonOut, articleName);
        }
    }
    xhttp.open('GET', fileRequest, true);
    xhttp.send()
}

// Function for checking whether or not there are queries on the news page
function handleQuery() {
    var query = new URLSearchParams(window.location.search)
    console.log(query.get('article'))
    if (query.has('article')) {
        var articleTitle = query.get('article')
        requestPastNewsJson('assets/PastNews.json', articleTitle, updatePastNews)
    }
    else {
        requestNewsJson('assets/News.json', updateDefaultNews)
    };
};

// Generates and sets innerHTML of the news section to the newest article
function updateDefaultNews(newsJson) {
    var title;
    var date;
    var author;
    var content;
    var pageElement = document.getElementById('newsContainer');
    title = newsJson['Title'];
    date = newsJson['Date'];
    author = newsJson['Author'];
    content = newsJson['News'];
    var formatData = HTMLFormat(title, author, date, content);
    pageElement.innerHTML = formatData;
};

// Generates and sets innerHTML of the news section with a specific past news article
function updatePastNews(newsJson, articleTitle) {
    console.log('Using past news')
    var title = articleTitle;
    var pageElement = document.getElementById('newsContainer');
    console.warn(newsJson)
    console.log(Object.keys(newsJson))
    if (Object.keys(newsJson).includes(title)) {
        var articleObj = newsJson[title]
        var html = HTMLFormat(title, articleObj['Author'], articleObj['Date'], articleObj['News'])
        pageElement.innerHTML = html
    }
    else {
        throw new Error(`The article: "${title}" could not be found`)
    }
};

function HTMLFormat(title, author, date, content){
    var htmlData = `<h3 class="date">${date}</h3>
    <h1 class="articleTitle">${title}</h1>
    <h2 class="author">${author}</h2>
    <hr class="lineBreak">
    <p class="article">${content}</p>`;
    return htmlData
};

function genPastArticles(jsonData){
    var articles = {};
    var HTMLData = null;

    for (var title in jsonData) {
        let date = jsonData[title]['Date']
        articles[title] = date;
    };
    console.log(articles)
    if (Object.keys(articles).length == 0) {
        document.getElementById("more").innerHTML = null
    }
    else if (Object.keys(articles).length <= 3) {
        for (var article in articles) {
            console.log(article)
            var articleHTML = `<a href="/news?article=${article}" class="moreNews_Link" title="${article}"><div class="centeredContainer" style="width: 85%;"><h1 class="moreNews_Title">${article}</h1><h1 class="moreNews_Date">${articles[title]}</h1></div></a>`
            HTMLData = checkNullAppend(HTMLData, articleHTML)
        }
    }
    else {
        var i = 1;
        var showArticles = [];
        var newArticle;
        while (i <= 3) {
            newArticle = Object.keys(articles)[~~(Math.random() * Object.keys(articles).length)]
            if (showArticles.includes(newArticle)) {
                i=i
            }
            else {
                showArticles.push(newArticle)
                i++
            }
        }
        console.log(showArticles)
        for (var article of showArticles) {
            let title = article;
            var articleHTML = `<a href="/news?article=${article}" class="moreNews_Link" title="${article}"><div class="centeredContainer" style="width: 85%;"><h1 class="moreNews_Title">${article}</h1><h1 class="moreNews_Date">${articles[title]}</h1></div></a>`
            HTMLData = checkNullAppend(HTMLData, articleHTML)
        }
    };
    document.getElementById("pastNewsContainer").innerHTML = HTMLData
}

// Checks if a string is null or not and then adds to it accordingly
function checkNullAppend(dataToCheck, valueToAppend){
    if (dataToCheck == null){
        return valueToAppend
    }
    else {
        return (dataToCheck + valueToAppend)
    };
}

handleQuery()
requestNewsJson('assets/PastNews.json', genPastArticles)