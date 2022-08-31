// Script for the Download page

// Function for downloading files
function download(fileName) {
    window.location.href = fileName
};


// Requests data from a json file or api serverside
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

// Dynamically generates the buttons for the download links based off of the file names
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

// Sets the downloads
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

// These ones handle updating the download counters
window.addEventListener('load', () =>{
    requestJson('http://api.localtest.me:3000/releases', setDownloads)
})