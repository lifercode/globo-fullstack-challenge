import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './pages/Home'
import Preview from './pages/Preview'
import Telao from './pages/Telao'
import Tweets from './pages/Tweets'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/preview">
          <Preview />
        </Route>
        <Route path="/tweets">
          <Tweets />
        </Route>
        <Route path="/telao">
          <Telao />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}