const { request } = require("express");

var IdList = [];

// Requests the navBar json from the server
function requestPageJson(fileRequest, callBack) {
    var xhttp = new XMLHttpRequest()
    var fileName = fileRequest.split('/')
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            jsonOut = JSON.parse(xhttp.responseText);
            callBack(jsonOut, fileName);
        }
    }
    xhttp.open('GET', fileRequest, true);
    xhttp.send()
}

// Sets up the team page based on a template
function setTeam(team) {
    var teamContainer = document.getElementById('TeamContainer');
    var data;
    var i = 0
    for (var member in team) {
        console.log(i)
        data = checkNullAppend(data, formatMemberData(team, member, isEven(i)))
        i++
    };
    //data = 'Null';
    //console.warn(data)
    teamContainer.innerHTML = data;
}

function isEven(int) {
    if (int%2 == 0) {
        return true;
    }
    else {
        return false;
    };
};

function formatMemberData(team, Member, isEven) {
    var member = team[Member];
    var memberName = Object.keys(team).find(Member => team[Member] === member);
    var align;
    var formattedHTML;
    var uniqueImgID = 0;
    if (isEven == true) {
        align = 'left'
    }
    else {
        align = 'right'
    };
    if (uniqueImgID in IdList) {
        uniqueImgID = parseInt(IdList[IdList.length-1], 10) + 1
    }
    else {
        uniqueImgID = uniqueImgID
    }
    IdList.push(uniqueImgID)
    formattedHTML = `<div class="memberCard ${align}">
        <a href='${team[Member]["PrimLink"]}'>
            <img src='${team[Member]["image"]}' class="memberImg" title="${memberName}" id="${uniqueImgID}" onerror="imgFail(${uniqueImgID}, 'assets/noMemberIco.png')" alt="${member}">
        </a>
        <div class="text">
            <h1 class='memberName'>${memberName}</h1>
            <h2 class='memberRole'>${member['role']}</h2>
            <hr class="lineBreak">
            <p class='about'>${team[Member]["about"]}</p>
        </div>\n`
        
    /*if (team[Member]['links'] != null || team[Member]['links'] != {}) {
        var linkList = `<ul id='memberLinks>`;
        for (var link in team[Member]['links']){
            var imgPath;
            var linkTxt;
            if (team[Member]['links'][link] != null) {
                imgPath = `<img src="${member['links'][link]}" id='linkImg'>`
            }
            else {
                imgPath = `<img src="assets/linkDefault.png">`
            };
            linkTxt = `<a href="${link}">${imgPath} ${link}</a>`
            checkNullAppend(linkList, linkTxt)
        }  
        formattedHTML = formattedHTML + linkList + `</ul></div>\n`
    }
    else {
        formattedHTML = formattedHTML + `</div>\n`
    };*/
    formattedHTML = formattedHTML + `</div>\n`
    //console.log(formattedHTML)
    return formattedHTML
}

// Creates the HTML for a navbar based on a template
function genNavBar(navBarData) {
    var navBar = document.getElementById('NavBar');
    var navBarDataOut = null;
    var newData;
    for (var entry in navBarData) {
        if (navBarData[entry]['ico'] != null){
            newData = `<li class="navItem"><a href="${navBarData[entry]['url']}" class="navLink"><img src="${navBarData[entry]['ico']}" class="navImg" alt="${entry}" title="${entry}"></a></li>`;
            navBarDataOut = checkNullAppend(navBarDataOut, newData)
        }
        else {
            newData = `<li class="navItem"><a href="${navBarData[entry]['url']}" class="navLink">${entry}</a></li>`;
            navBarDataOut = checkNullAppend(navBarDataOut, newData)
        };
    };
    navBar.innerHTML = `<ul id="navBarList">${navBarDataOut}</ul>`
}

// Generates and sets innerHTML of the news section
function updateNews(newsJson, fileName) {
    var title;
    var date;
    var author;
    var content;
    var pageElement = document.getElementById('newsContainer');
    if (fileName == 'News.json') {
        title = newsJson['Title'];
        date = newsJson['Date'];
        author = newsJson['Author'];
        content = newsJson['News'];
    }
    else if (fileName == 'PastNews.json') {
        
    }
    else {
        return
    };

    var formatData = null;
};

// Checks if a string is null or not and then adds to it accordingly
function checkNullAppend(dataToCheck, valueToAppend){
    if (dataToCheck == null){
        return valueToAppend
    }
    else {
        return (dataToCheck + valueToAppend)
    };
}

function imgFail(imgTagID, altImgPath) {
    img = document.getElementById(imgTagID)
    img.src = altImgPath
};

// Function for downloading files
function download(fileName) {
    window.location.href = fileName
};

// Code run when window the script is running from is loaded
window.onload = function() {
    console.log('Loaded page!')
    requestPageJson('/assets/NavBar.json', genNavBar)
    console.log('Generated NavBar successfully')

    try {
        requestPageJson('/assets/TeamMembers.json', setTeam)
    }
    catch {
        //pass
    };

    try {
        requestPageJson('/assets/News.json', updateNews)
    }
    catch {
        //pass
    };
}