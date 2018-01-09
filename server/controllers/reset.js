const Database = require('../engine/database')

const db = new Database()

module.exports = (req, res) => {
  db.reset()
    .then((data) => {
      return res
        .status(200)
        .json({})
        .end()
    })
    .catch((err) => {
      res.status(500).json(err).end()
    })
}
