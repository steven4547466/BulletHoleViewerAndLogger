const express = require('express')
const router = express.Router()
const http = require("http")
const config = require("../settings/settings.json")

let holes = {}

/**
 * Main page rendering
 */
router.get('/', (req, res) => {
  res.render('index', {resError: req.query.error, data: JSON.stringify(holes)})
})


http.createServer((req, res) => {
  if (req.method != "POST") return res.writeHead(400).end()
  if (config.authentication.enabled && req.headers.authorization != config.authentication.key) return res.writeHead(401).end()
  let body = ""

  req.on("data", d => body += d)

  req.on("end", () => {
    let data = JSON.parse(body)
    for(let i = 0; i < data.length; i++) {
      let cur = data[i]
      let user = cur.userId

      if (!holes[cur.server]) holes[cur.server] = {}
      if (!holes[cur.server][cur.roundStartedAt]) holes[cur.server][cur.roundStartedAt] = {}
      if (!holes[cur.server][cur.roundStartedAt][user]) {
        holes[cur.server][cur.roundStartedAt][user] = {
          name: cur.userName,
          bullets: [cur.position]
        }
      } else {
        holes[cur.server][cur.roundStartedAt][user].bullets.push(cur.position)
      }
      if (Object.keys(holes[cur.server]).length > 10) {
        let roundStartTimes = Object.keys(holes[cur.server]).sort((a, b) => parseInt(a) - parseInt(b))
        for (let i = 0; i < roundStartTimes.length; i++) {
          delete holes[cur.server][roundStartTimes[i]]
          if (Object.keys(holes[cur.server]).length <= 10) 
            break;
        }
      }
    }
    return res.writeHead(200).end()
  })
}).listen(config.postPort).on("listening", () => {
  console.log(`Listening to post requests on ${config.postPort}`)
})

module.exports = router
