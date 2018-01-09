const fs = require('fs')
const path = require('path')
const debug = require('debug')('twit-graph:addToken')

const tokensPath = path.join(__dirname, '..', 'tokens.json')

module.exports = (req, res) => {
  const tokens = require('../tokens.json')
  const token = req.body.token

  tokens.push(token)

  debug(`adding ${token.name}`)

  fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2), (error) => {
    if (error) {
      debug(`adding ${token.name} failed`)
      return res
        .status(500)
        .json({ error })
        .end()
    }

    debug(`added ${token.name}`)
    return res
      .status(200)
      .json({ })
      .end()
  })
}
