const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { dbConnect } = require('./db')
const twitterSetup = require('./twitter')
const { Tweet } = require('./models')

const PORT = 3002
const CLIENT_URL = 'http://localhost:3000'
const TWITTER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAHv2QgEAAAAAMFn2drWf8LLTMtxhsx5GLV3cKWk%3DtQWBa7wFoadzj98THWGIujLguT4WH21mXETMghgdq3xxTYyhQ4'
const TWITTER_API_PREFIX = 'https://api.twitter.com/2/tweets/search/recent?query=%23'
const TWITTER_API_SUFIX = '&tweet.fields=created_at&expansions=author_id&user.fields=created_at'

const serverConfig = {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, serverConfig)

dbConnect()

app.use(cors())
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.send('hello there')
})

app.get('/tweets/recent', async (req, res) => {
  const endpoint = TWITTER_API_PREFIX + req.query.hashtag + TWITTER_API_SUFIX
  const result = await axios.get(endpoint, {
    headers: {'Authorization': `Bearer ${TWITTER_TOKEN}`}
  })
  await Tweet.deleteMany({})

  const tweets = result.data.data.map((data) => {
    const users = result.data.includes.users || []
    const user = users.filter(({ id }) => id === data.author_id)[0]
    const value = {
      id: data.id,
      text: data.text,
      author: user && user.username,
      created_at: data.created_at
    }
    return value
  })

  res.json(tweets)
})

app.get('/tweets/new', async (req, res) => {
  const tweets = await Tweet.find()
  await Tweet.deleteMany({})
  io.emit('tweetcount', 0)

  res.json(tweets)
})

app.post('/clear', (req, res) => {
  io.emit("clear")
  res.json({ clear: true })
})

app.post('/approve', (req, res) => {
  io.emit("tweet", req.body.tweet)
  res.json(req.body.tweet)
})

io.on('connection', () => twitterSetup(io))

server.listen(PORT, () => console.log(`listening on *:${PORT}`))