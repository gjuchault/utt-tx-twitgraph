const debug = require('debug')('twit-graph:user')

class User {
  constructor(name, depth, initialUser, breadth, type, tokens, database) {
    this.name        = name
    this.depth       = depth
    this.initialUser = initialUser
    this.breadth     = breadth
    this.type        = type
    this.database    = database
    this.tokens      = tokens

    this.results = []
  }

  fetch() {
    return this
      .shouldFetch()
      .then((shouldFetchUser) => {
        debug(`should fetch user ${this.name} ? ${shouldFetchUser ? 'yes' : 'no'}`)

        if (shouldFetchUser) {
          return this.self()
            .then(() => this.retrieve('followers'))
            .then(() => this.retrieve('followings'))
            .then(() => this.results)
        } else {
          // user is at max depth, return empty queue
          return []
        }
      })
  }

  shouldFetch() {
    return this.database
      .relatedAlreadyFetched(this.name)
      .then(relatedAlreadyFetched => !relatedAlreadyFetched)
  }

  self() {
    return this.database.addUser(this.name, this.depth, true, this.initialUser)
  }

  retrieve(userType) {
    let count = this.breadth

    if (this.type === 'both') {
      // retrieve half from followers and half from followings
      count = userType === 'followings' ? Math.ceil(this.breadth / 2) : Math.floor(this.breadth / 2)
    } else if (this.type === 'followings' && userType !== 'followings') {
      return Promise.resolve()
    } else if (this.type === 'followers' && userType !== 'followers') {
      return Promise.resolve()
    }

    debug(`getting ${count}, ${userType}, ${this.type}`)

    const params = {
      screen_name: this.name,
      skip_status: true,
      include_user_entities: false,
      count
    }

    const url = userType === 'followings' ? '/friends/list' : '/followers/list'

    return this.tokens
      .getToken()
      .then(client => client.get(url, params))
      .then((results) => {
        this.results.push(...results.users.map((result) => {
          return {
            name : result.screen_name,
            depth: this.depth + 1,
            type : userType === 'followings' ? 'following' : 'follower'
          }
        }))

        debug(`got relationships ${this.results.map(r => r.name).join(', ')}`)

        debug(`adding ${this.results.length} relations to ${this.name}`)

        // add nodes in database
        const addNodes = Promise.all(
          this.results.map(result => this.database.addUser(result.name, result.depth, false))
        )

        // add links in database
        const addLinks = Promise.all(
          this.results.map((result) => {
            if (result.type === 'following') {
              this.database.addLink(this.name, result.name)
            } else {
              this.database.addLink(result.name, this.name)
            }
          })
        )

        return Promise.all([ addNodes, addLinks ])
      })
  }
}

module.exports = User
