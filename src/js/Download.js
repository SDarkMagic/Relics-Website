// Script for the Download page

// Object containing IDs for elements on the page and the download counter key for them
const elementIDs = {
    'UOfficialDownloads': 'UOfficial',
    'NXOfficialDownloads': 'NXOfficial',
    'UBetaDownloads': 'UBeta',
    'NXBetaDownloads': 'NXBeta'
}

// Returns the value in; just needed this for a void callback that would pass data on
function passData(dataIn){
    console.warn(dataIn)
};

// Function for downloading files
function download(fileName) {
    window.location.href = fileName
};

// Function for updating the download counters
function updateDLCounter(dlCountToUpdate){
  var xhttp = new XMLHttpRequest();
  console.log(requestJson('./assets/DownloadCounts.json', passData))
  xhttp.open('POST', './WriteDownloadCounter.php', true)
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send({"FileName": "./assets/DownloadCounter.json", "JSON": dlCountToUpdate})
};

// Requests data from a json file serverside
function requestJson(fileRequest, callBack) {
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

function setupLinks(files, tag){
    let element, platform
    let links = []
    files.forEach(file => {
        if (file.name.toLowerCase().includes('switch')){
            platform = 'switch'
        }
        else if (file.name.toLowerCase().includes('wiiu')){
            platform = 'wiiu'
        }
        else {
            platform = 'switch'
        }
        element = `<div id="${tag}-${platform}" class="DownloadButton ${platform}"><a href="${file.browser_download_url}"><img class='buttonIco' src='assets/${platform}logo.png' title='${platform}' alt='${platform}_Icon'><div class='buttonTxt'>Download ${platform[0].toUpperCase() + platform.slice(1)} ${tag}</div></a></div>`
        links.push(element)
    });
    return links.join('')
}

// Sets the download counter values
function setDownloads(downloadsObject) {
    let elements = []
    let downloadContainer = document.getElementById('downloadContainer')
    for (let release in downloadsObject){
        release = downloadsObject[release]
        elements.push(`<div class="release-group">
            <h1 class='subTitle' style="font-family: Zelda_botw; font-weight: 100;">${release.tag}</h1>
            <hr class="linebreak" style="background-color: black;">
            ${setupLinks(release.files, release.tag)}</div>`)
    };
    downloadContainer.innerHTML = elements.join('')
}

// Updates the download counters every second

// Add variables for the buttons
var officialU = document.getElementById('WiiU_Official');
var officialNX = document.getElementById('NX_Official');
var betaU = document.getElementById('WiiU_Beta');
var betaNX = document.getElementById('NX_Beta');

// Setup event listeners on each button
function SetupListeners(){
    // These are the ones for handling the actual file downloads
    officialU.addEventListener("click", download('WiiU-Release'), false);
    officialNX.addEventListener("click", download('NX-Release'), false);

    // These are the ones for updating the download counters themselves
    for (var id in Object.keys(elementIDs)){
        id = Object.keys(elementIDs)[id]
        document.getElementById(id).addEventListener('click', updateDLCounter(elementIDs[id]), false)
      };
};

// These ones handle updating the download counters
window.addEventListener('load', () =>{
    //requestJson('./assets/DownloadCounts.json', setDownloads)
    requestJson('http://api.localtest.me:3000/releases', setDownloads)
})