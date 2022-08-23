const https = require('http')
const express = require('express')
const subdomain = require('express-subdomain')
const fs = require('fs')
const {request} = require('undici')
const server = express()
const port = 3000
//require('dotenv').config()

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

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

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

// Discord login handling
server.get('/login', async ({query}, res) => {
    const {code} = query

    if (code) {
        try {
            const tokenResponse = await request('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID,
                    client_secret: process.env.DISCORD_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: 'http://localtest.me:3000/login',
                    scope: 'guilds.members.read',
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            const oauthData = await getJSONResponse(tokenResponse.body)
            console.log(oauthData)
            const userResult = await request('https://discord.com/api/v10/users/@me', {
                headers: {authorization: `${oauthData.token_type} ${oauthData.access_token}`}
            })
            console.log(await getJSONResponse(userResult.body))
        } catch (error) {
            console.error(error)
        }
    } else {
        console.log('No code in call')
    }
    return res.status(200).sendFile(`${__dirname}/src/home.html`)
})

// Sends the user to the hidden place, this is setup separately in case we want some extra functionality added to the page
server.get('/hidden', (req, res) => {
    console.log(__dirname)
    res.status(200).sendFile(`${__dirname}/src/hidden.html`)
});

// Sends any requests to the base url to the index page
server.get('/', (req, res) => {
    if (req.hostname.split('.')[0] === 'www' || req.hostname.split('.')[0] === 'relicsofthepast'){
        res.sendFile(__dirname + '/src/home.html')
    }
    else {
        //console.log(req)
        res.status(404).sendFile(`${__dirname}/src/404.html`)
    }
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

// Sends the official WiiU release build Zip
server.get('/WiiU-Release', (req, res) => {
    var file = `${__dirname}/src/assets/ModFiles/WiiU/breathofthewild_relics_of_the_past__e0751.zip`;
    res.download(file, 'RelicsOfThePast_Official-Release-WiiU.zip');
});

// Sends the official NX release build Zip
server.get('/NX-Release', (req, res) => {
    var file = `${__dirname}/src/assets/ModFiles/NX/relics_of_the_past_v103_switch_.zip`
    res.download(file, 'RelicsOfThePast_Official-Release-NX.zip')
});

// Sends the public WiiU Beta Zip
server.get('/WiiU-Beta_public', (req, res) => {
    var file = `${__dirname}/src/assets/ModFiles/WiiU`
    res.download(file, 'RelicsOfThePast_Public-Beta-WiiU.zip')
});

// Sends the public NX Beta Zip
server.get('/NX-Beta_public', (req, res) => {
    var file = `${__dirname}/src/assets/ModFiles/NX`
    res.download(file, 'RelicsOfThePast_Public-Beta-NX.zip')
});

// Starts the server
server.listen(port, 'localhost', () => {
    console.log(`Server started on localhost:${port}`)
});
