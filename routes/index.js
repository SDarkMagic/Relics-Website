const express = require('express')
const cors = require('cors')
const twitch = require('./stream-api')()

module.exports = function () {
    const router = new express.Router()
    router.use(cors({origin: [/\.relicsofthepast\.dev$/, /relicsofthepast\.dev$/]}))
    router.use('/streams', twitch)
    return router
}