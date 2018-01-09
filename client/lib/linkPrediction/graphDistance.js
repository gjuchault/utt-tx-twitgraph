export default (graph, start, end) => {
  return graph.path(start, end).length - 2
}
