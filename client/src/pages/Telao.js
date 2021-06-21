import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Box
} from '@material-ui/core'

import { websocketConnect } from '../config/websocket'
import { fromNow } from '../helpers/date'
import '../styles/page-telao.css'

export default function Telao() {
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    const socket = websocketConnect()

    function handlerAddTweet(tweet) {
      setTweets(prevTweets => [tweet, ...prevTweets])
    }
    function handlerClearTweets() {
      setTweets([])
    }

    socket.on("tweet", handlerAddTweet)
    socket.on("clear", handlerClearTweets)
  
    return () => {
      socket.off("tweet", handlerAddTweet)
      socket.off("clear", handlerClearTweets)
    }
  }, [])

  return (
    <Container maxWidth="md">
      {tweets.length ? (
        <Box className="tweets-container">
          {tweets.map(({ id, text, author, created_at }) => (
            <Paper key={id} className="tweet fadein">
              <p>
                <small>
                  @{author}{' '}
                  <span>· {fromNow(created_at)}</span>
                </small>
              </p>
              <p>{text}</p>
            </Paper>
          ))}
        </Box>
      ) : (
        <img
          className="logo-globo"
          src="/img/logo-globo.png"
          alt="logo-globo"
        />
      )}
    </Container>
  )
}