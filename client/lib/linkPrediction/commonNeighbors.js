import intersection from 'lodash.intersection'

export default ({ graph }, start, end) => {
  const startNeighbors = Array.from(graph.get(start).keys())
  const endNeighbors = Array.from(graph.get(end).keys())

  const inter = intersection(
    startNeighbors,
    endNeighbors
  )

  return inter.length
}
