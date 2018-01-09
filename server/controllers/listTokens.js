const fs = require('fs')
const path = require('path')

const tokensPath = path.join(__dirname, '..', 'tokens.json')

module.exports = (req, res) => {
  const tokens = JSON.parse(fs.readFileSync(tokensPath))

  return res
    .status(200)
    .json({ tokens })
    .end()
}
