var IdList = [];

// Requests the navBar json from the server
function requestPageJson(fileRequest, callBack) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            jsonOut = JSON.parse(xhttp.responseText);
            callBack(jsonOut);
        }
    }
    xhttp.open('GET', fileRequest, true);
    xhttp.send()
};

// Checks if a string is null or not and then adds to it accordingly
function checkNullAppend(dataToCheck, valueToAppend){
    if (dataToCheck == null){
        return valueToAppend
    }
    else {
        return (dataToCheck + valueToAppend)
    };
};

function isEven(int) {
    if (int%2 == 0) {
        return true;
    }
    else {
        return false;
    };
};

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
    formattedHTML = `<a class="anchor" id="${memberName}"></a>
        <div class="memberCard ${align}">
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

requestPageJson('/assets/TeamMembers.json', setTeam)
