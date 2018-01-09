function linkHasRel(links, a, b) {
  return links.some(rel =>
    (rel.source === a && rel.target === b) ||
    (rel.source === b && rel.target === a)
  )
}

export default (nodes, links) => {
  const pairs = []

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (!linkHasRel(links, nodes[i], nodes[j])) {
        pairs.push([ nodes[i], nodes[j] ])
      }
    }
  }

  return pairs
}
