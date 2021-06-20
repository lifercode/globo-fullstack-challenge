import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import RefreshIcon from '@material-ui/icons/Refresh'
import TwitterIcon from '@material-ui/icons/Twitter'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import socketIOClient from 'socket.io-client'

import { fromNow } from '../helpers/date'
import api from '../config/api'
import '../styles/page-tweets.css'

const API_URL = "http://localhost:3002"

export default function Tweets() {
  const [tweets, setTweets] = useState([])
  const [count, setCount] = useState(0)
  const [approvedTweets, setApprovedTweets] = useState([])
  const [removedTweets, setRemovedTweets] = useState([])
  const [hashtag, setHashtag] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isApproveLoading, setApproveLoading] = useState(null)
  const hasTweets = Boolean(tweets.length)

  async function handlerSearch(e) {
    e.preventDefault()
    setLoading(true)
    const result = await api.get(`/tweets/recent?hashtag=${hashtag}`)
    result.data
      ? setTweets(result.data)
      : alert(`Nenhum tweet encontrado com a hashtag #${hashtag}`)
    setHashtag('')
    setCount(0)
    setLoading(false)
  }

  async function handlerTweetApprove(value) {
    setApproveLoading(value.id)
    const updatedTweets = [value, ...approvedTweets]
    await api.post('/approve', { tweet: value })
    setApprovedTweets(updatedTweets)
    setTweets(tweets.filter(({ id }) => id !== value.id))
    setApproveLoading(null)
  }

  function clear() {
    setCount(0)
    setTweets([])
    api.post('/clear')
  }

  async function update() {
    setLoading(true)
    const result = await api.get('/tweets/new')
    if (result.data) {
      setTweets([...result.data, ...tweets].slice(0, 50))
    }
    setCount(0)
    setLoading(false)
  }

  function handlerTweetRemove(value) {
    setRemovedTweets([value, ...removedTweets])
    setTweets(tweets.filter(({ id }) => id !== value.id))
  }

  function handleInputChange(e) {
    const normalizedValue = e.target.value.replace(' ', '').replace('#', '')
    setHashtag(normalizedValue)
  }

  useEffect(() => {
    const socket = socketIOClient(API_URL, { transport : ['websocket'] })

    function handlerCount(value) {
      if (count === 0 || value <= 100) {
        setCount(value)
      }
    }

    socket.on("tweetcount", handlerCount)
  
    return () => {
      socket.off("tweetcount", handlerCount)
    }
  }, [])

  return (
    <Container maxWidth="sm">

      {!hasTweets && (
        <form onSubmit={handlerSearch}>
          <div className="search-form-container">
            <div className="search-input-container">
              <TextField
                className="search-input"
                id="input-with-icon-textfield"
                placeholder="hashtag"
                variant="outlined"
                color="primary"
                disabled={isLoading}
                fullWidth
                value={hashtag}
                onChange={handleInputChange}
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
                disabled={isLoading || !hashtag.length}
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

      {(!isLoading && !hasTweets) && (
        <TwitterIcon className="twitter-logo"/>
      )}

      {hasTweets && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={clear}
        >
          <RefreshIcon />
        </Button>
      )}
      {' '}
      {(hasTweets && count >= 1) && (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={update}
        >
          <TwitterIcon style={{ marginRight: 5 }} />{' '}
          +{count > 99 ? 99 : count}
        </Button>
      )}

      {isLoading && (
        <div className="loader-container">
          <CircularProgress />
        </div>
      )}

      {hasTweets && tweets.map((value) => (
        <Paper
          key={value.id}
          elevation={3}
          className="tweet"
          style={{ opacity: value.id === isApproveLoading ? 0.4 : 1 }}
        >
          <p>
            <small>@{value.author} <span>· {fromNow(value.created_at)}</span></small>
          </p>
          <p>{value.text}</p>
          <div className="tweet-action-area">
            <Button
              size="small"
              color="primary"
              variant="outlined"
              disabled={value.id === isApproveLoading}
              onClick={() => handlerTweetRemove(value)}
            >
              <DeleteIcon />
            </Button>
            {' '}
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={value.id === isApproveLoading}
              onClick={() => handlerTweetApprove(value)}
            >
              <CheckIcon />
            </Button>
          </div>
        </Paper>
      ))}

    </Container>
  )
}