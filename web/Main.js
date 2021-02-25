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
    navBar.innerHTML = `<ul id="navBarList">${navBarDataOut}</ul><div id="mobileNavBar"></div>`
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
}