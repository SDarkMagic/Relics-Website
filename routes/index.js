const express = require('express')
const twitch = require('./stream-api')()


module.exports = function () {
    const router = new express.Router()
    router.use('/streams', twitch)
    return router
}