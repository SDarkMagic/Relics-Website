const notFound = require('../errors/NotFound')
const fs = require('fs')
const { promisify } = require('util')
const {Octokit} = require('octokit')
require('dotenv').config()

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const access = promisify(fs.access)
const octokit = new Octokit({userAgent: 'Relics Website Downloads'})

class downloads{
    constructor(){
        this.filePath = `${process.cwd()}/src/assets/downloads.json`
        this.data = null
    }

    async readLocal(){
        const data = await readFile(this.filePath).catch(err => {
            console.error(err)
            this.localData = {}
        })
        this.localData = JSON.parse(data)
        return
    }

    async writeLocal(){
        await writeFile(this.filePath, JSON.stringify(this.data)).catch(err => {
            console.error(err)
            return
        })
        return
    }

    async format(){
        let outData = []
        const data = await this.fetch()
        //console.log(data)
        data.forEach(release => {
            if (release.assets.length >= 1){
                outData.push({
                    tag: release.tag_name,
                    prerelease: release.prerelease,
                    files: release.assets
                })
            }
        })
        return outData
    }

    async fetch(){
        let owner = 'Relics-Of-The-Past'
        let repo = 'Relics-of-the-Past-Release'
        try{
            const data = await octokit.request('GET /repos/{owner}/{repo}/releases', {owner: owner, repo: repo, per_page: 100})
            console.log('Called get releases')
            return new Promise((res, rej) => {
                try {
                    res(data.data)
                } catch (err){
                    rej(err)
                }
            })
        }
        catch (err){
            console.error(err)
            setTimeout(this.fetch, 3000)
        }
    }

    async load(){
        await this.readLocal()
        this.remoteData = await this.format()
        return
    }

    async diff(){
        if (this.remoteData.length >= 1){
            if (this.localData === this.remoteData){
                this.data = this.localData
            } else {
                this.data = this.remoteData
                await this.writeLocal()
            }
        } else {
            this.data = this.localData
        }
        return
    }

    async monitor() {
        this.diff().then(() => {
            setInterval(this.diff, 1000 * 60 * 60 * 24)
        })
    }
}
const releases = new downloads()
releases.load().then(() => {
    setInterval(releases.diff, 1000 * 60 * 60 * 24)
})

async function getDownloads(req, res, next) {
    if (releases.data){
        res.status(200).json(releases.data)
    }
    else {
        res.status(404).json(new notFound())
    }
}

module.exports = {
    getDownloads
}
