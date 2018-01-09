const neo4j = require('neo4j-driver').v1
const { database } = require('../../config')

class Database {
  constructor() {
    this.driver = neo4j.driver(database.uri, neo4j.auth.basic(database.user, database.password))
    this.session = this.driver.session()

    this.setup = this.session.run('create constraint on (n:User) assert n.name is unique')
  }

  userDepth(name) {
    const query = `
      match (n:User {name: $name})
      return n.depth as depth
    `

    return this.setup
      .then(() => this.session.run(query, { name }))
      .then((result) => result.records.length > 0 ? result.records[0].get('depth') : Infinity)
  }

  relatedAlreadyFetched(name) {
    const query = `
      match (n:User {name: $name})
      return n.relatedAlreadyFetched as relatedAlreadyFetched
    `

    return this.setup
      .then(() => this.session.run(query, { name }))
      .then((result) => result.records.length > 0 && result.records[0].get('relatedAlreadyFetched'))
  }

  reallow(name) {
    const query = `
      match (n:User {name: $name})
      set n.relatedAlreadyFetched = false
      set n.initial = true
    `

    return this.setup
      .then(() => this.session.run(query, { name }))
  }

  reset() {
    const query = 'match (n: User) detach delete n'

    return this.setup
      .then(() => this.session.run(query))
  }

  addUser(name, depth, relatedAlreadyFetched, initial = false) {
    const query = `
      merge (n:User {name: $name})
      on create set n = {name: $name, depth: $depth, relatedAlreadyFetched: $relatedAlreadyFetched, initial: $initial}
      on match set n.depth = (case when n.depth >= $depth then $depth else n.depth end), n.relatedAlreadyFetched = $relatedAlreadyFetched
    `

    console.log(name, depth, relatedAlreadyFetched, initial)

    return this.setup
      .then(() => this.session.run(query, { name, depth, relatedAlreadyFetched, initial }))
      .catch((err) => {
        if (err.code !== 'Neo.ClientError.Schema.ConstraintValidationFailed') {
          throw err;
        }
      })
      .then(() => { name, depth })
  }

  addLink(from, to) {
    const query = `
      match (from:User), (to:User)
      where from.name = $from and to.name = $to
      create unique (from) -[r:follows]-> (to)
    `

    return this.setup
      .then(() => this.session.run(query, { from, to })
      .catch((err) => {
        if (err.code !== 'Neo.ClientError.Schema.ConstraintValidationFailed') {
          throw err;
        }
      })
      .then(() => { from, to }))
  }

  getAllNodes() {
    const query = 'match (n: User) return n.name as name, n.initial as initial'

    return this.setup.then(() => this.session.run(query))
  }

  getAllLinks() {
    const query = 'match (n:User)-[:follows]->(d:User) return n.name as source, d.name as target'

    return this.setup.then(() => this.session.run(query))
  }
}

module.exports = Database
