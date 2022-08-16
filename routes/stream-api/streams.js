const axios = require('axios')
const fs = require('fs')
const { RefreshableAuthProvider, StaticAuthProvider, ClientCredentialsAuthProvider } = require('twitch-auth');
const { ApiClient } = require('twitch');
//const fs = promises
require('dotenv').config()

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const client = new ApiClient({authProvider: new ClientCredentialsAuthProvider(clientId, clientSecret)})
const botwGameId = 110758

function checkTitle(title){
    for (let word in title.split(' ')){
        word = word.toLowerCase().replace('/[\w]', '')
        if (word === 'relics' || word === 'rotp') {
            return true
        } else {
            return false
        }
    }
}
async function getStreams(req, res, next){
    console.log('called getStreams')
    const game = await client.helix.games.getGameById(botwGameId)
    const streams = await game.getStreamsPaginated().getAll()
    let relicsStreams = []
    streams.forEach(stream => {
        if (checkTitle(stream.title) === true){
            relicsStreams.push(stream)
        }
    })
    res.status(200).json(relicsStreams)
}

module.exports = {
    getStreams
}