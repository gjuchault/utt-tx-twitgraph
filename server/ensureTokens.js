const fs = require('fs')
const path = require('path')

module.exports = () => new Promise((resolve, reject) => {
  const tokensPath = path.join(__dirname, 'tokens.json')

  fs.stat(tokensPath, (err, stats) => {
    if (!err && stats.isFile()) {
      return resolve()
    }

    fs.writeFile(tokensPath, '[]', (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
})
