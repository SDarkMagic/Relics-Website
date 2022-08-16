// A modified version of Team.js

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
function setTeam(stream) {
    var steamContainer = document.getElementById('StreamContainer');
    var data;
    var i = 0
    for (var index in stream) {
        data = checkNullAppend(data, formatMemberData(stream[index], isEven(i)))
        i++
    };
    //data = 'Null';
    //console.warn(data)
    if (stream.length != 0) {
        steamContainer.innerHTML = data;
    }
    else {
        return
    }
};

function formatMemberData(stream, isEven) {
    console.log(stream)
    let streamer = stream['user_name']
    let title = stream['title']
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
    formattedHTML = `<div class="streamerCard ${align}">
            <iframe class='player' src='https://player.twitch.tv/?channel=${streamer}&parent=${window.location.hostname}' allowfullscreen="true" muted="true" autoplay="false"></iframe>
            <iframe class='chat' src='https://www.twitch.tv/embed/${streamer}/chat?parent=${window.location.hostname}'></iframe>
            <a href='https://twitch.tv/${streamer}' class='streamLink'>
                <h3 class='streamTitle'>${title}</h3>
            </a>`
    formattedHTML = formattedHTML + `</div>\n`
    //console.log(formattedHTML)
    return formattedHTML
}

window.addEventListener('load', requestPageJson('https://api.relicsofthepast.dev/streams', setTeam))
