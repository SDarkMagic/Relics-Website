const https = require('https')
const express = require('express')
const mime = require('node-mime')
const path = require('path')
const fs = require('fs')
const server = express()
const port = 80

//Adds the "web" folder to the available server urls
server.use(express.static('web'));

// Sets up SSL data
var key = fs.readFileSync(__dirname + '/certs/server.key')
var cert = fs.readFileSync(__dirname + '/certs/server.crt')

// Sets up the options variable to contain SSL data
var options = {
    'key': key,
    'cert': cert
}

/*
// Handles errors
server.use(function (err, req, res, next) {
    console.warn(err.stack)
    console.log('this is the error specific function, here is the error ' + err)
});
*/

// Sends any requests to the base url to the index page
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/home.html')
});

// Attempts to forward any requests from /{var} to a corresponding HTML page
server.get('/:pageName', (req, res) => {
    var pageName = req.params['pageName']
    var page = `${__dirname}/web/${pageName}.html`
    console.log(page)
    if (fs.existsSync(page)) {
        res.sendFile(page)
    }
    else {
        res.status(404).sendFile(`${__dirname}/web/404.html`)
    };
});

/*
No longer necessary as news articles are now handled by News.js
// Attempts to get and return proper past news articles
server.get('/news/:article', (res, req) => {
    var articleTitle = req.params['article']
    var page = `${__dirname}/web/news.html`
});
*/

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


// Sends the user to the hidden place
server.get('/hidden', (req, res) => {
    console.log(__dirname)
    res.sendFile(`${__dirname}/web/hidden.html`)
});

var secureServer = https.createServer(options, server)

// Starts the server
secureServer.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
