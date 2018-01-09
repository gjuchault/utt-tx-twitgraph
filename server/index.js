const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const webpackMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const debug = require('debug')('twit-graph:server')
const config = require('../config')
const ensureTokens = require('./ensureTokens')

const client = path.join(__dirname, '..', 'public')
const app = express()

const compiler = webpack(require('../webpack.config'))

if (process.env.NODE_ENV === 'development') {
  compiler.watch({}, (err, stats) => {
    debug('built client')
  })
}

async function start() {
  await ensureTokens()

  app.use(bodyParser.json())
  app.use(serveStatic(client, { maxAge: '7 days' }))

  app.get('/api/v1/listTokens', require('./controllers/listTokens'))
  app.get('/api/v1/getAll', require('./controllers/getAll'))
  app.post('/api/v1/removeToken', require('./controllers/removeToken'))
  app.post('/api/v1/addToken', require('./controllers/addToken'))
  app.post('/api/v1/mapUser', require('./controllers/mapUser'))
  app.delete('/api/v1/reset', require('./controllers/reset'))

  // Single-Page Application
  app.get('*', (req, res) => {
    res.sendFile(path.join(client, 'index.html'))
  })

  // Error handling
  app.use((error, req, res, _) => {
    console.log(error)

    res
      .status(500)
      .json({ error })
      .end()
  })

  const server = http.Server(app)

  const io = require('socket.io')(server)

  app.locals.io = io

  server.listen(config.port, () => {
    console.log(`Listenning on port http://localhost:${config.port}/`)
  })
}

start()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
