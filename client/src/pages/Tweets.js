import React, { useState, useEffect } from 'react'
import {
  CircularProgress,
  InputAdornment,
  Container,
  TextField,
  Button,
  Paper
} from '@material-ui/core'
import {
  Refresh as RefreshIcon,
  Twitter as TwitterIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Check as CheckIcon
} from '@material-ui/icons'

import { websocketConnect } from '../config/websocket'
import { fromNow } from '../helpers/date'
import api from '../config/api'
import '../styles/page-tweets.css'

export default function Tweets() {
  const [tweets, setTweets] = useState([])
  const [newTweetsCount, setCount] = useState(0)
  const [hashtag, setHashtag] = useState('')
  const [isTweetsLoading, setTweetsLoading] = useState(false)
  const [isTweetApproveLoading, setTweetApproveLoading] = useState(null)

  const hasTweets = Boolean(tweets.length)

  function getTweetStyle(tweetId) {
    return {
      opacity: tweetId === isTweetApproveLoading ? 0.4 : 1
    }
  }

  function clearAllTweets() {
    setCount(0)
    setTweets([])
    api.post('/clear')
  }

  function removeTweet(tweet) {
    setTweets(tweets.filter(({ id }) => id !== tweet.id))
  }

  async function getNewTweets() {
    setTweetsLoading(true)
    const result = await api.get('/tweets/new')
    result.data && setTweets([...result.data, ...tweets].slice(0, 50))
    setCount(0)
    setTweetsLoading(false)
  }

  async function approveTweet(tweet) {
    setTweetApproveLoading(tweet.id)
    await api.post('/approve', { tweet })
    setTweets(tweets.filter(({ id }) => id !== tweet.id))
    setTweetApproveLoading(null)
  }

  function handlerInputSearchChange(e) {
    const normalizedValue = e.target.value.replace(' ', '').replace('#', '')
    setHashtag(normalizedValue)
  }

  async function handlerInputSearchSubmit(e) {
    e.preventDefault()
    setTweetsLoading(true)
    const result = await api.get(`/tweets/recent?hashtag=${hashtag}`)
    result.data
      ? setTweets(result.data)
      : alert(`Nenhum tweet encontrado com a hashtag #${hashtag}`)
    setHashtag('')
    setCount(0)
    setTweetsLoading(false)
  }

  useEffect(() => {
    const socket = websocketConnect()

    function handlerNewTweetsCount(value) {
      if (newTweetsCount === 0 || value <= 100) {
        setCount(value)
      }
    }

    socket.on("tweetcount", handlerNewTweetsCount)
  
    return () => {
      socket.off("tweetcount", handlerNewTweetsCount)
    }
  }, [])

  return (
    <Container maxWidth="sm">

      {!hasTweets && (
        <form onSubmit={handlerInputSearchSubmit}>
          <div className="search-form-container">
            <div className="search-input-container">
              <TextField
                className="search-input"
                id="input-with-icon-textfield"
                placeholder="hashtag"
                variant="outlined"
                color="primary"
                disabled={isTweetsLoading}
                fullWidth
                value={hashtag}
                onChange={handlerInputSearchChange}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      #
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className="search-button-container">
              <Button
                disabled={isTweetsLoading || !hashtag.length}
                variant="contained"
                color="primary"
                type="submit"
              >
                <SearchIcon />
              </Button>
            </div>
          </div>
        </form>
      )}

      <br />

      {(!isTweetsLoading && !hasTweets) && (
        <TwitterIcon className="twitter-logo"/>
      )}

      {hasTweets && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={clearAllTweets}
        >
          <RefreshIcon />
        </Button>
      )}
      {' '}
      {(hasTweets && newTweetsCount >= 1) && (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={getNewTweets}
        >
          <TwitterIcon className="twitter-button-icon"/>{' '}
          +{newTweetsCount > 99 ? 99 : newTweetsCount}
        </Button>
      )}

      {isTweetsLoading && (
        <div className="loader-container">
          <CircularProgress />
        </div>
      )}

      {hasTweets && tweets.map((tweet) => (
        <Paper
          key={tweet.id}
          elevation={3}
          className="tweet"
          style={getTweetStyle(tweet.id)}
        >
          <p>
            <small>
              @{tweet.author}{' '}
              <span>· {fromNow(tweet.created_at)}</span>
            </small>
          </p>
          <p>{tweet.text}</p>
          <div className="tweet-action-area">
            <Button
              size="small"
              color="primary"
              variant="outlined"
              disabled={tweet.id === isTweetApproveLoading}
              onClick={() => removeTweet(tweet)}
            >
              <DeleteIcon />
            </Button>
            {' '}
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={tweet.id === isTweetApproveLoading}
              onClick={() => approveTweet(tweet)}
            >
              <CheckIcon />
            </Button>
          </div>
        </Paper>
      ))}

    </Container>
  )
}