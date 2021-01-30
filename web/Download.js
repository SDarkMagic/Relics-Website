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
    console.log(requestJson('./assets/DownloadCounts.json', passData))
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

// Sets the download counter values
function setDownloads(downloadsObject) {
    for (var id in Object.keys(elementIDs)){
      id = Object.keys(elementIDs)[id]
      console.log('This is just logging stuff', id)
        let element = document.getElementById(id)
        element.innerText = downloadsObject[elementIDs[id]]
    };
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
    //for (var id in Object.keys(elementIDs)){
      //  id = Object.keys(elementIDs)[id]
        //document.getElementById(id).addEventListener('click', updateDLCounter(elementIDs[id]), false)
      //};
};

// These ones handle updating the download counters
window.addEventListener('load', requestJson('./assets/DownloadCounts.json', setDownloads))