const cors = require('cors')
const router = require('express').Router()
const downloads = require('./download-setup')


module.exports = function () {
    router.use(cors())
    router.route('/').get(downloads.getDownloads)
    return router
}