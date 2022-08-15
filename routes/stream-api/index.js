const cors = require('cors')
const router = require('express').Router()
const twitch = require('./streams')


module.exports = function () {
    router.use(cors())
    router.route('/').get(twitch)
    return router
}