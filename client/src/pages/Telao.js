import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

import { fromNow } from '../helpers/date'
import '../styles/page-telao.css'

export default function Telao() {
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_URL, { transport : ['websocket'] })

    function handlerTweet(tweet) {
      setTweets(prevTweets => [tweet, ...prevTweets])
    }
    function handlerClear() {
      setTweets([])
    }

    socket.on("tweet", handlerTweet)
    socket.on("clear", handlerClear)
  
    return () => {
      socket.off("tweet", handlerTweet)
      socket.off("clear", handlerClear)
    }
  }, [])

  return (
    <Container maxWidth="md">
      {tweets.length ? (
        <Box className="tweets-container">
          {tweets.map(({ id, text, author, created_at }) => (
            <Paper key={id} className="tweet fadein">
              <p>
                <small>@{author} <span>· {fromNow(created_at)}</span></small>
              </p>
              <p>{text}</p>
            </Paper>
          ))}
        </Box>
      ) : (
        <img className="logo-globo" src="logo-globo.png" alt="logo-globo"/>
      )}
    </Container>
  )
}