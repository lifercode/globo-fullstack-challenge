const axios = require('axios')

const twitterSetup = require('../config/twitterSetup')
const Tweet = require('../models/Tweet')

const TWITTER_API_PREFIX = '/tweets/search/recent?query=%23'
const TWITTER_API_SUFIX = '&tweet.fields=created_at&expansions=author_id&user.fields=created_at'

async function getRecentTweets(req, res) {
  twitterSetup(req.io, req.query.hashtag)

  const endpoint = process.env.TWITTER_API_URL + TWITTER_API_PREFIX + req.query.hashtag + TWITTER_API_SUFIX
  const result = await axios.get(endpoint, {
    headers: {'Authorization': `Bearer ${process.env.TWITTER_API_TOKEN}`}
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
}

async function getNewTweets(req, res) {
  const tweets = await Tweet.find()
  await Tweet.deleteMany({})
  req.io.emit('tweetcount', 0)

  res.json(tweets)
}

async function clearAllTweets(req, res) {
  req.io.emit("clear")
  res.json({ clear: true })
}

async function approveTweet(req, res) {
  req.io.emit("tweet", req.body.tweet)
  res.json(req.body.tweet)
}

module.exports = {
  getRecentTweets,
  getNewTweets,
  clearAllTweets,
  approveTweet
}