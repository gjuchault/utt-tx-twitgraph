import pairs from './utils/pairs'
import dataToGraph from './utils/dataToGraph'
import graphDistance from './graphDistance'
import commonNeighbors from './commonNeighbors'
import preferentialAttachment from './preferentialAttachment'
import jaccard from './jaccard'
import adamicAdar from './adamicAdar'

export default class LinkPrediction {
  constructor (method = LinkPrediction.LPA_GRAPH_DISTANCE, nodes, links) {
    this.method = method
    this.nodes = nodes.map(node => node.id)
    this.links = links
    this.graph = dataToGraph(this.nodes, this.links)
    this.pairs = pairs(this.nodes, links)
  }

  start(theresold) {
    if (typeof this[this.method] !== 'function') {
      return Promise.reject(new Error('Invalid Link Prediction Algorithm'))
    }

    return this[this.method](theresold)
  }

  graphDistance(theresold) {
    return this.pairs.filter(pair => {
      const score = graphDistance(this.graph, pair[0], pair[1])

      return score <= theresold
    })
  }

  commonNeighbors(theresold) {
    return this.pairs.filter(pair => {
      const score = commonNeighbors(this.graph, pair[0], pair[1])

      return score >= theresold
    })
  }

  preferentialAttachment(theresold) {
    return this.pairs.filter(pair => {
      const score = preferentialAttachment(this.graph, pair[0], pair[1])

      return score >= theresold
    })
  }

  jaccard(theresold) {
    return this.pairs.filter(pair => {
      const score = jaccard(this.graph, pair[0], pair[1])

      return score >= theresold
    })
  }

  adamicAdar(theresold) {
    return this.pairs.filter(pair => {
      const score = adamicAdar(this.graph, pair[0], pair[1])

      console.log(score)

      return score >= theresold
    })
  }
}

LinkPrediction.LPA_GRAPH_DISTANCE = 'graphDistance'
LinkPrediction.LPA_COMMON_NEIGHBORS = 'commonNeighbors'
LinkPrediction.LPA_PREFERENTIAL_ATTACHMENT = 'preferentialAttachment'
LinkPrediction.LPA_JACCARD = 'jaccard'
LinkPrediction.LPA_ADAMIC_ADAR = 'adamicAdar'

addEventListener('message', (e) => {
  const descriptor = e.data

  const linkPrediction = new LinkPrediction(
    descriptor.predictionAlgorithm,
    descriptor.nodes,
    descriptor.links
  )

  const results = linkPrediction.start(descriptor.theresold)

  postMessage(results)
}, false)
