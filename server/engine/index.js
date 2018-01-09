const EventEmitter = require('events')
const { throttle } = require('lodash')
const Tokens = require('./tokens')
const Database = require('./database')
const Queue = require('./queue')
const User = require('./user')
const debug = require('debug')('twit-graph:engine')

class Engine extends EventEmitter {
  constructor(initialUser, maxDepth = 3, breadth = 3, type = 'both') {
    super()

    this.tokens   = new Tokens()
    this.database = new Database()
    this.queue    = new Queue()

    this.initialUser = initialUser
    this.maxDepth    = maxDepth
    this.breadth     = breadth
    this.type        = type

    this.working = false

    this.queue.push({
      name: this.initialUser,
      initialUser: true,
      depth: 0
    })
  }

  start() {
    debug(`reallowing ${this.initialUser} to be fetched`)
    this.database
      .reallow(this.initialUser)
      .then(() => this.fetchNext())
  }

  fetchNext() {
    // check for queue every 200ms
    setTimeout(() => this.fetchNext(), 200)

    if (this.queue.isEmpty() || this.working) {
      // debug(`queue empty : ${this.queue.isEmpty() ? 'true' : 'false'}`)
      return
    }

    // get next entry
    const entry = this.queue.pop()

    this.emit('user')

    // do not fetch if user is at max depth
    if (entry.depth >= this.maxDepth) {
      debug(`do not fetch ${entry.name} (depth: ${entry.depth}/${this.maxDepth})`)
      return
    }

    this.working = true

    const user = new User(
      entry.name,
      entry.depth,
      entry.initialUser || false,
      this.breadth,
      this.type,
      this.tokens,
      this.database
    )

    return user
      .fetch()
      .then((results) => {
        debug(`user ${user.name} has ${results.length} relations`)

        results.forEach((result) => {
          this.queue.push({ name: result.name, depth: result.depth })

          if (result.type === 'follower') {
            debug(`emitting relationship ${result.name}->${user.name}`)
            this.emit('rel')
          } else {
            debug(`emitting relationship ${user.name}->${result.name}`)
            this.emit('rel')
          }
        })

        this.working = false
      })
      .catch((err) => {
        if (err[0] && err[0].message === 'Rate limit exceeded') {
          debug('rate limiting exceeded')
          return
        }

        console.error(err)
      })
  }
}

module.exports = Engine
