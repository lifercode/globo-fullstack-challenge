import React from 'react'
import Box from '@material-ui/core/Box'

import '../styles/page-preview.css'

export default function Preview() {
  return (
    <Box className="container">
      <Box className="device-container-phone">
        <img
          src="/img/iphone.png"
          alt="device-phone-mockup"
          className="device-image device-image-phone"
        />
        <iframe
          title="tweets"
          src="/tweets"
          frameborder="0"
          className="device-iframe-phone"
        />
      </Box>
      <Box className="device-container-tv">
        <img
          src="/img/tv.png"
          alt="device-tv-mockup"
          className="device-image device-image-tv"
        />
        <iframe
          title="telao"
          src="/telao"
          frameborder="0"
          className="device-iframe-tv"
        />
      </Box>
    </Box>
  )
}