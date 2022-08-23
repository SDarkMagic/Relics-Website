const axios = require('axios')
const fs = require('fs')
const { RefreshableAuthProvider, StaticAuthProvider, ClientCredentialsAuthProvider } = require('twitch-auth');
const { ApiClient } = require('twitch');
//const fs = promises
require('dotenv').config()

const clientId = process.env.TWITCH_CLIENT_ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET
const client = new ApiClient({authProvider: new ClientCredentialsAuthProvider(clientId, clientSecret)})
const botwGameId = 110758

function checkTitle(title){
    for (let i in title.split(' ')) {
        let word = title.split(' ')[i]
        const regex = /\W/g
        word = word.replace(regex, '').toLowerCase()
        if (word === 'relics' || word === 'rotp') {
            return true
        } else {
            continue
        }
    }
    return false
}
async function getStreams(req, res, next){
    const game = await client.helix.games.getGameById(botwGameId)
    const streams = await game.getStreamsPaginated().getAll()
    let relicsStreams = []
    streams.forEach(stream => {
        if (checkTitle(stream.title) === true){
            relicsStreams.push({user_name: stream.userName, title: stream.title})
        }
    })
    res.status(200).json(relicsStreams)
}

module.exports = {
    getStreams
}