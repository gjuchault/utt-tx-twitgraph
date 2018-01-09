const Database = require('../engine/database')

const db = new Database()

module.exports = (req, res) => {
  let nodes = null

  db.getAllNodes()
    .then((data) => {
      nodes = data.records.map(record => ({
        id: record.toObject().name,
        initial: !!record.toObject().initial
      }))

      return db.getAllLinks()
    })
    .then((data) => {
      const links = data.records.map(record => record.toObject())

      return res
        .status(200)
        .json({
          nodes,
          links
        })
        .end()
    })
    .catch((err) => {
      res.status(500).json(err).end()
    })
}
