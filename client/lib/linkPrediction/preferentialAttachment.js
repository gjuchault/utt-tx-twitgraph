export default ({ graph }, start, end) => {
  const startNeighbors = Array.from(graph.get(start).keys())
  const endNeighbors = Array.from(graph.get(end).keys())

  return startNeighbors.length * endNeighbors.length
}
