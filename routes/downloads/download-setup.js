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
        this.data = this.localData
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
        const data = await this.fetch().catch(err => {
            console.error(`Failed to fetch release data from server: ${err}`)
            return null
        })
        if (data !== null){
            data.forEach(release => {
                if (release.assets.length >= 1){
                    outData.push({
                        tag: release.tag_name,
                        prerelease: release.prerelease,
                        files: release.assets
                    })
                }
            })
        }
        return outData
    }

    async fetch(){
        let owner = 'Relics-Of-The-Past'
        let repo = 'Relics-of-the-Past-Release'
        console.log('Fetching from Github API')
        const data = await octokit.request('GET /repos/{owner}/{repo}/releases', {owner: owner, repo: repo, per_page: 100})
        return new Promise((res, rej) => {
            if (data.status !== 200){
                rej(data)
            }
            else{
                res(data.data)
            }
        })
     }

    async diff(){
        await this.readLocal()
        const tempData = await this.format()
        if (this.localData){
            this.data = this.localData
        }
        if (tempData.length >= 1){
            if (this.data === tempData){
                this.data = this.data
            } else {
                this.data = tempData
                await this.writeLocal()
            }
        } else {
            this.data = this.localData
        }
        return
    }

    monitor() {
        console.log('Monitoring Releases')
        this.diff().then(() => {
            setInterval(this.diff, 1000 * 60 * 60 * 24)
        })
    }
}
const releases = new downloads()
releases.monitor()

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
