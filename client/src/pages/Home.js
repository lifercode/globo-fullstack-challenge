import React from 'react'
import {
  CardActionArea,
  CardContent,
  Typography,
  Container,
  Grid,
  Card,
  Chip,
  Box
} from '@material-ui/core'

import '../styles/page-home.css'

const widgets = [
  {
    title: 'Tweets',
    description: 'Controle os tweets exibidos no telão',
    target: '/tweets',
    plus: false
  },
  {
    title: 'Telão',
    description: 'Acompanhe os tweets selecionados',
    target: '/telao',
    plus: false
  },
  {
    title: 'Preview',
    description: 'Controle e acompanhe os tweets',
    target: '/preview',
    plus: true
  }
]

export default function Home() {
  function goTo(target) {
    window.location.href = target
  }

  return (
    <Container maxWidth="md">
      <Box className="header">
        <img src="/img/logo-globo.png" alt="logo-globo" className="logo" />
        <Typography variant="h2">
          Globo Fullstack Challenge
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={3}>
          {widgets.map((widget, index) => (
            <Grid item sm={4} xs={12} key={index}>
              <Card>
                <CardActionArea onClick={() => goTo(widget.target)}>
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      {widget.title}
                      {' '}
                      {widget.plus && <Chip size="small" label="Plus" />}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {widget.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box className="footer">
        <Typography variant="p">
          by{' '}
          <a
            href="https://github.com/lifercode"
            target="_blank"
            rel="noreferrer"
          >
            <b>@lifercode</b>
          </a>
        </Typography>
      </Box>
    </Container>
  )
}