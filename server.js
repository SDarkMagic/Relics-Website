const https = require('http')
const express = require('express')
const subdomain = require('express-subdomain')
const fs = require('fs')
const server = express()
const port = 3000

//Adds the "web" folder to the available server urls
server.use(express.static('web'));
server.use(express.static('objmap'))

/*
// Handles errors
server.use(function (err, req, res, next) {
    console.warn(err.stack)
    console.log('this is the error specific function, here is the error ' + err)
});
*/

const objmap = express.Router()
objmap.get('/', (req, res) => {
    res.sendFile(`${__dirname}/objmap/dist/index.html`)
})
objmap.get('/:subDir/:subFile?', (req, res) => {
    let subFile = req.params['subFile']
    let subDir = req.params['subDir']
    // console.log(subDir, subFile)
    try {
        if (subFile != undefined){
            res.status(200).sendFile(`${__dirname}/objmap/dist/${subDir}/${subFile}`)
        }
        else {
            res.status(200).sendFile(`${__dirname}/objmap/dist/${subDir}`)
        }
    }
    catch {
        res.status(404).sendFile(__dirname + '/web/404.html')
    }
})
server.use(subdomain('objmap', objmap))

const radar = require('./routes/radar/app/app')
radar.get('/', (req, res) => {
    res.status(404).sendFile(__dirname + '/web/404.html')
})
server.use(subdomain('radar', radar))

const api = require('./routes')()
server.use(subdomain('api', api))

// Sends any requests to the base url to the index page
server.get('/', (req, res) => {
    if (req.hostname.split('.')[0] === 'www' || req.hostname.split('.')[0] === 'relicsofthepast'){
        res.sendFile(__dirname + '/web/home.html')
    }
    else {
        res.status(404).sendFile(`${__dirname}/web/404.html`)
    }
});

// Sends the user to the hidden place, this is setup separately in case we want some extra functionality added to the page
server.get('/hidden', (req, res) => {
    console.log(__dirname)
    res.sendFile(`${__dirname}/web/hidden.html`)
});

// Attempts to forward any requests from /{var} to a corresponding HTML page
server.get('/:pageName', (req, res) => {
    var pageName = req.params['pageName']
    var page = `${__dirname}/web/${pageName.toLowerCase()}.html`
    console.log(page)
    if (fs.existsSync(page) && (req.hostname.split('.')[0] === 'www' || req.hostname.split('.')[0] === 'relicsofthepast')) {
        res.sendFile(page)
    }
    else {
        res.status(404).sendFile(`${__dirname}/web/404.html`)
    };
});

// Sends the official WiiU release build Zip
server.get('/WiiU-Release', (req, res) => {
    var file = `${__dirname}/web/assets/ModFiles/WiiU/breathofthewild_relics_of_the_past__e0751.zip`;
    res.download(file, 'RelicsOfThePast_Official-Release-WiiU.zip');
});

// Sends the official NX release build Zip
server.get('/NX-Release', (req, res) => {
    var file = `${__dirname}/web/assets/ModFiles/NX/relics_of_the_past_v103_switch_.zip`
    res.download(file, 'RelicsOfThePast_Official-Release-NX.zip')
});

// Sends the public WiiU Beta Zip
server.get('/WiiU-Beta_public', (req, res) => {
    var file = `${__dirname}/web/assets/ModFiles/WiiU`
    res.download(file, 'RelicsOfThePast_Public-Beta-WiiU.zip')
});

// Sends the public NX Beta Zip
server.get('/NX-Beta_public', (req, res) => {
    var file = `${__dirname}/web/assets/ModFiles/NX`
    res.download(file, 'RelicsOfThePast_Public-Beta-NX.zip')
});

// Starts the server
server.listen(port, 'localhost', () => {
    console.log(`Server started on localhost:${port}`)
});
