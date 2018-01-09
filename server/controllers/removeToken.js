const fs = require('fs')
const path = require('path')
const debug = require('debug')('twit-graph:removeToken')

const tokensPath = path.join(__dirname, '..', 'tokens.json')

module.exports = (req, res) => {
  let tokens = JSON.parse(fs.readFileSync(tokensPath))
  const name = req.body.name

  tokens = tokens.filter(token => token.name !== name)

  debug(`removing ${name}`)

  fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2), (error) => {
    if (error) {
      debug(`removing ${name} failed`)
      return res
        .status(500)
        .json({ error })
        .end()
    }

    debug(`removed ${name}`)
    return res
      .status(200)
      .json({ })
      .end()
  })
}
