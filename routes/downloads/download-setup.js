const notFound = require('../errors/NotFound')
const fs = require('fs')
const {Octokit} = require('octokit')
require('dotenv').config()

const octokit = new Octokit({userAgent: 'Relics Website Downloads'})
let releases;

async function getReleases(){
    let owner = 'Relics-Of-The-Past'
    let repo = 'Relics-of-the-Past-Release'
    releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {owner: owner, repo: repo, per_page: 100})
    console.log('Called get releases')
    console.log(releases.data, releases.data.length)
}

async function getDownloads(req, res, next){
    if (releases.data.length >= 1){
        let downloads = []
        releases.data.forEach(release => {
            if (release.assets.length >= 1){
                downloads.push({
                    tag: release.tag_name,
                    prerelease: release.prerelease,
                    files: release.assets

                })
            }
            else {
                return
            }
        });
        res.status(200).json(downloads)
    } else {
        res.status(404).json(new notFound())
    }
}

getReleases().then(() => {
    setInterval(getReleases, 1000 * 60 * 60 * 24)
})

module.exports = {
    getDownloads
}
