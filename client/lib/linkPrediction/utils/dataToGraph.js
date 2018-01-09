const Graph = require('node-dijkstra')

function getLinksForNode(node, links) {
  const rels = {}

  links
    .forEach((rel) => {
      if (rel.source === node || rel.target === node) {
        let link = rel.source === node ? rel.target : rel.source
        rels[link] = 1
      }
    })

  return rels
}

export default (nodes, links) => {
  const graph = new Graph()

  nodes.forEach((node) => {
    graph.addNode(node, getLinksForNode(node, links))
  })

  return graph
}
