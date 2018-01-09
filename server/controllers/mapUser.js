const debug = require('debug')('twit-graph:mapUser')

const Engine = require('../engine')

module.exports = (req, res) => {
  const user = (req.body.user.startsWith('@')) ? req.body.user.slice(1) : req.body.user
  const depth = req.body.depth
  const breadth = req.body.breadth
  const type = req.body.type

  const io = req.app.locals.io

  debug(`started mapping ${user} maxDepth=${depth} breadth=${breadth} type=${type}`)
  io.sockets.emit('mapping', { user, depth, breadth })

  const engine = new Engine(user, depth, breadth, type)

  engine.on('user', () => {
    io.sockets.emit('user')
  })

  engine.on('rel', () => {
    io.sockets.emit('rel')
  })

  engine.start()

  return res.status(200).end()
}
