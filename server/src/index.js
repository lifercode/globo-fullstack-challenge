require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const bodyParser = require('body-parser')
const cors = require('cors')

const {
  getRecentTweets,
  getNewTweets,
  clearAllTweets,
  approveTweet
} = require('./controllers/tweets')
const { dbConnect } = require('./config/db')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

dbConnect()

app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  req.io = io
  return next()
})

app.get('/', async (req, res) => {
  res.send('Welcome to API :D')
})

app.get('/tweets/recent', getRecentTweets)
app.get('/tweets/new', getNewTweets)
app.post('/clear', clearAllTweets)
app.post('/approve', approveTweet)

io.on('connection', () => console.log('Client connected!'))

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`)
})