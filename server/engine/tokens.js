const debug = require('debug')('twit-graph:tokens')
const Token = require('./token')

let tokens = require('../tokens')

const minute = 1000 * 60

class Tokens {
  // Two endpoints, 15/window per endpoint => 30
  constructor(interval = 15 * minute, perInterval = 30) {
    debug(`init ${tokens.length} tokens with ${perInterval}req/${interval / minute}min`)

    this.tokens = tokens.map(token => new Token(token, interval,  perInterval))

    this.actualToken = null
  }

  getToken(autoTick = true) {
      return Promise
        .race(this.tokens.map(token => token.wait()))
        .then((token) => {
          this.actualToken = token

          if (autoTick) {
            this.actualToken.tick()
          }

          return token.client
        })
  }

  tick() {
    if (this.actualToken) {
      this.actualToken.tick()
    }
  }
}

module.exports = Tokens
