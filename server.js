const https = require('http')
const express = require('express')
const subdomain = require('express-subdomain')
const fs = require('fs')
const server = express()
const port = 3000

//Adds the "src" folder to the available server urls
server.use(express.static('src'));
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
        res.status(404).sendFile(__dirname + '/src/404.html')
    }
})
server.use(subdomain('objmap', objmap))

const radar = require('./routes/radar/app/app')
radar.get('/', (req, res) => {
    res.status(404).sendFile(__dirname + '/src/404.html')
})
server.use(subdomain('radar', radar))

const api = require('./routes')()
server.use(subdomain('api', api))

// Sends any requests to the base url to the index page
server.get('/', (req, res) => {
    if (req.hostname.split('.')[0] === 'www' || req.hostname.split('.')[0] === 'relicsofthepast'){
        res.sendFile(__dirname + '/src/home.html')
    }
    else {
        res.status(404).sendFile(`${__dirname}/src/404.html`)
    }
});

// Sends the user to the hidden place, this is setup separately in case we want some extra functionality added to the page
server.get('/hidden', (req, res) => {
    console.log(__dirname)
    res.sendFile(`${__dirname}/src/hidden.html`)
});

// Attempts to forward any requests from /{var} to a corresponding HTML page
server.get('/:pageName', (req, res) => {
    var pageName = req.params['pageName']
    var page = `${__dirname}/src/${pageName.toLowerCase()}.html`
    console.log(page)
    if (fs.existsSync(page) && (req.hostname.split('.')[0] === 'www' || req.hostname.split('.')[0] === 'relicsofthepast')) {
        res.sendFile(page)
    }
    else {
        res.status(404).sendFile(`${__dirname}/src/404.html`)
    };
});

// Starts the server
server.listen(port, 'localhost', () => {
    console.log(`Server started on localhost:${port}`)
});
