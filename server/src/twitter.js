const needle = require('needle')
const { Tweet } = require('./models')

const rulesURL = process.env.TWITTER_API_URL + '/tweets/search/stream/rules'
const streamURL = process.env.TWITTER_API_URL + '/tweets/search/stream?tweet.fields=public_metrics,created_at&expansions=author_id'

const rules = [{ value: 'bbb' }]

const requestOptions = {
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
  },
}

async function getRules() {
  const response = await needle('get', rulesURL, requestOptions)
  console.log(response.body)
  return response.body
}

async function setRules() {
  const data = { add: rules }
  const response = await needle('post', rulesURL, data, requestOptions)

  return response.body
}

async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null
  }

  const ids = rules.data.map((rule) => rule.id)
  const data = { delete: { ids } }
  const response = await needle('post', rulesURL, data, requestOptions)

  return response.body
}

function streamTweets(socket) {
  const stream = needle.get(streamURL, requestOptions)

  stream.on('data', async (data) => {
    try {
      const tweetcount = await Tweet.count()
      if (tweetcount < 100) {
        const json = JSON.parse(data)
        const users = json.includes.users || []
        const user = users.filter(({ id }) => id === json.data.author_id)[0]
        const value = {
          id: json.data.id,
          text: json.data.text,
          author: user && user.username,
          created_at: json.data.created_at
        }
        const tweet = new Tweet(value)
        await tweet.save()
        socket.emit('tweetcount', tweetcount)
      }
    } catch (error) {}
  })

  return stream
}

async function setup(io) {
  console.log('Client connected...')

  let currentRules

  try {
    currentRules = await getRules()
    await deleteRules(currentRules)
    await setRules()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  const filteredStream = streamTweets(io)

  let timeout = 0
  filteredStream.on('timeout', () => {
    console.warn('A connection error occurred. Reconnecting…')
    setTimeout(() => {
      timeout++
      streamTweets(io)
    }, 2 ** timeout)
    streamTweets(io)
  })
}

module.exports = setup