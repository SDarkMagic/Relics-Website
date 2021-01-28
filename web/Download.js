// Script for the Download page

// Function for downloading files
function download(fileName) {
    window.location.href = fileName
};

// Add variables for the buttons
var officialU = document.getElementById('WiiU_Official')
var officialNX = document.getElementById('NX_Official')
var betaU = document.getElementById('WiiU_Beta')
var betaNX = document.getElementById('NX_Beta')

// Setup event listeners on each button
// These are the ones for handling the actual file downloads
officialU.addEventListener("click", download('WiiU-Release'), false)
officialNX.addEventListener("click", download('NX-Release'), false)

// These ones handle updating the download counters