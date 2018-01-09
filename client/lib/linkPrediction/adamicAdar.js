import intersection from 'lodash.intersection'

export default ({ graph }, start, end) => {
  const startNeighbors = Array.from(graph.get(start).keys())
  const endNeighbors = Array.from(graph.get(end).keys())

  const inter = intersection(
    startNeighbors,
    endNeighbors
  )

  let sum = 0
  for (let i = 0; i < inter.length; i++) {
    const common = inter[i]
    const commonNeighbors = Array.from(graph.get(common).keys()).length

    sum += 1 / Math.log(commonNeighbors)
  }

  return sum
}
