const Twitter = require('twitter')

class Token {
  constructor(data, interval, perInterval) {
    this.active      = true
    this.ticks       = 0
    this.client      = new Twitter(data)
    this.interval    = interval
    this.perInterval = perInterval

    this.waitForClient = Promise.resolve(this)
  }

  wait() {
    if (this.active) {
      return Promise.resolve(this)
    } else {
      return this.waitForClient
    }
  }

  tick() {
    if (this.ticks === 0) {
      this.startWindowCountdown()
    }

    this.ticks += 1

    if (this.ticks >= this.perInterval) {
      this.active = false
    }
  }

  startWindowCountdown() {
    this.waitForClient = new Promise((resolve) => {
      setTimeout(() => {
        this.ticks  = 0
        this.active = true

        resolve(this)
      }, this.interval)
    })
  }
}

module.exports = Token
