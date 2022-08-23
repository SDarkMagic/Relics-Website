var devCookie = "RelicsDevCookie=920";
if (document.cookie.indexOf(devCookie) !== -1) {
   // I am a developer
   // Show control panel, debug info, etc.
   console.log('Development User, analytics Disabled')
} else {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TZ6RZSP');
    console.log('Analytics enabled')
}
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
    var mobileNavBarDataOut;
    var newData;
    var newMobileData;
    for (var entry in navBarData) {
        if (navBarData[entry]['ico'] != null){
            newData = `<li class="navItem"><a href="${navBarData[entry]['url']}" class="navLink"><img src="${navBarData[entry]['ico']}" class="navImg" alt="${entry}" title="${entry}"></a></li>`;
            navBarDataOut = checkNullAppend(navBarDataOut, newData)
        }
        else {
            newData = `<li class="navItem"><a href="${navBarData[entry]['url']}" class="navLink">${entry}</a></li>`;
            navBarDataOut = checkNullAppend(navBarDataOut, newData)
        };
        newMobileData = `<li class="navItem"><a href="${navBarData[entry]['url']}" class="navLink">${entry}</a></li>`
        mobileNavBarDataOut = checkNullAppend(mobileNavBarDataOut, newMobileData)
    };
    navBar.innerHTML = `<ul id="navBarList">${navBarDataOut}<li id="loginContainer"><a id="login" href="https://discord.com/api/oauth2/authorize?client_id=1011650063442915339&redirect_uri=http%3A%2F%2Flocaltest.me%3A3000%2Flogin&response_type=code&scope=identify%20guilds.members.read">Login</a></li></ul><div id="mobileNavBar" onclick="showDropDown('mobileNavBarList')"></div></div><ul id="mobileNavBarList">${mobileNavBarDataOut}</ul><div id="empty">`
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

// Only for the mobile nav bar; displays the navbar when the hamburger is clicked
function showDropDown(dropDownId) {
  var element = document.getElementById(dropDownId)
  if (element.style.display === "block"){
    element.style.display = "none";
  }
  else {
    element.style.display = "block"
  }
};

function debug_getHeight(elementGetId, dataElement) {
  var debugElement = document.getElementById(elementGetId)
  var dataDisplayElement = document.getElementById(dataElement)
  dataDisplayElement.innerText = debugElement.clientWidth
}
function generateRandomString() {
    let randomString = '';
    const randomNumber = Math.floor(Math.random() * 10);
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
}

function checkDiscordLogin() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

    if (!accessToken) {
        const randomString = generateRandomString();
        localStorage.setItem('oauth-state', randomString);

        document.getElementById('login').href += `&state=${encodeURIComponent(btoa(randomString))}`;
        return document.getElementById('login').style.display = 'block';
    }

    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        return console.log('You may have been click-jacked!');
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            const { username, discriminator } = response;
            document.getElementsByClassName('title').innerText += ` ${username}#${discriminator}`;
        })
        .catch(console.error);
}
// Code run when window the script is running from is loaded
window.addEventListener('load', () => {
    console.log('Loaded page!')
    requestPageJson('/assets/NavBar.json', genNavBar)
    console.log('Generated NavBar successfully')
    checkDiscordLogin()
    console.log('Checked discord login')
})