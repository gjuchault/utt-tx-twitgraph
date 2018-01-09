import React from 'react'
import { connect } from 'react-redux'
import {
  Card, CardBlock, CardTitle,
  Breadcrumb, BreadcrumbItem,
  Badge, Button,
  Form, FormGroup, Label, Input
} from 'reactstrap'
import clone from 'lodash.clonedeep'
import cytoscape from 'cytoscape'
import regCose from 'cytoscape-cose-bilkent'

regCose(cytoscape)

import { go, fullData, addPrediction } from '../../actions'
import download from '../../lib/download'
import LinkPrediction from '../../lib/linkPrediction/index.worker'

import './Visualization.css'

import Node from './components/Node'
import Link from './components/Link'

const mapStateToProps = (state) => ({
  isVisualization: state.location === '/visualization',
  nodes: state.map.nodes,
  links: state.map.links
})

const mapActionsToProps = (dispatch) => ({
  backHome(e) {
    e.preventDefault()
    dispatch(go('/'))
  },

  addPrediction(data) {
    dispatch(addPrediction(data))
  },

  setFullData(data) {
    dispatch(fullData(data.nodes, data.links))
  }
})

class Visualization extends React.Component {
  constructor(props) {
    super(props)

    this.options = {
      height: 400,
      width: 500,
      radius: 6
    }

    this.state = {
      predictionAlgorithm: 'adamicAdar',
      theresold: 2
    }

    this.toCSV = this.toCSV.bind(this)
    this.prediction = this.prediction.bind(this)
    this.updateData = this.updateData.bind(this)
    this.resetData = this.resetData.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.isVisualization && nextProps.isVisualization) {
      this.updateData()
    }

    const mapUpdate =
      this.props.nodes.length !== nextProps.nodes.length ||
      this.props.links.length !== nextProps.links.length

    const pageUpdate = this.props.isVisualization !== nextProps.isVisualization

    const shouldUpdate = mapUpdate || pageUpdate

    if (shouldUpdate) {
      setTimeout(() => {
        this.startSimulation(nextProps)
      })
    }

    return shouldUpdate
  }

  updateData() {
    fetch('/api/v1/getAll')
      .then(res => res.json())
      .then((data) => {
        this.props.setFullData(data)
        this.startSimulation(this.props)
      })
  }

  resetData() {
    if (confirm('Reset all database ?')) {
      fetch('/api/v1/reset', { method: 'DELETE' })
        .then(() => {
          this.props.setFullData({ nodes: [], links: [] })
          this.startSimulation(this.props)
        })
    }
  }

  prediction(e) {
    e.preventDefault()

    const descriptor = {
      predictionAlgorithm: this.state.predictionAlgorithm,
      theresold: this.state.theresold,
      nodes: this.props.nodes,
      links: this.props.links
    }

    const linkPredictionWorker = new LinkPrediction();

    linkPredictionWorker.postMessage(descriptor);

    linkPredictionWorker.addEventListener('message', (e) => {
      e.data.forEach(prediction => this.props.addPrediction(prediction))
    })
  }

  toggleFullscreen(e) {
    e.preventDefault()

    const $el = this.visualization.querySelector('.visualization__render')

    if (document.fullscreenElement === $el) {
      document.exitFullscreen()
    } else {
      $el.requestFullscreen()
    }
  }

  toCSV(e) {
    e.preventDefault()

    const header = `From,To,Prediction`
    const data   = this.props.links.map((rel) => `${rel.source},${rel.target},${rel.prediction ? '1' : '0'}`).join('\n')

    const csv = [ header, data ].join('\n')

    download('twitgraph.csv', csv)
  }

  startSimulation(props) {
    const elements = props.nodes.concat(props.links).map((elem) => {
      if (elem.source && elem.target) {
        return {
          data: {
            id: `${elem.source}_${elem.target}`,
            source: elem.source,
            target: elem.target
          },
          style: elem.prediction ? {
            'line-color': 'green',
            'target-arrow-color': 'green'
          } : {}
        }
      } else {
        return {
          data: {
            id: elem.id
          },
          style: elem.initial ? {
            'background-color': 'red'
          } : {}
        }
      }
    })

    if (this.visualization.querySelector('.visualization__render')) {
      const $canvas = this.visualization.querySelector('.visualization__render')

      $canvas.style.width ='100%';
      $canvas.style.height='100%';
      $canvas.width  = $canvas.offsetWidth;
      $canvas.height = $canvas.offsetHeight;

      const cy = cytoscape({
        container: this.visualization.querySelector('.visualization__render'),

        elements,

        style: [
          {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle'
            }
          }
        ],

        layout: {
          name: 'cose-bilkent',
          animate: false
        }
      })

      cy.on('mouseover', 'node', (event) => {
        this.tooltip.innerHTML = event.target._private.data.id

        if (!event.target._private.style['background-color']) {
          return
        }

        if (event.target._private.style['background-color'].strValue === 'red') {
          this.tooltip.innerHTML += '<span class="badge badge-success">initial</span>'
        }
      })
    }
  }

  render() {
    const classes = this.props.isVisualization ? 'visualization visualization--active' : 'visualization'
    return (
      <div id="app" className={classes} ref={(el) => this.visualization = el}>
        <header>
          <h1>TwitGraph — Visualization</h1>
        </header>
        <main>
          <Breadcrumb>
            <BreadcrumbItem>
              <a href="#" onClick={this.props.backHome}>Accueil</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              Visualization
            </BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <CardBlock className="card-body">
              <CardTitle>Visualization</CardTitle>
              <a href="#" onClick={this.toCSV}>Export en CSV</a>
              <Form inline>
                <FormGroup>
                  <Label>
                    Prediction:
                    <Input type="select" name="predictionAlgorithm" onChange={this.handleInputChange} defaultValue={this.state.predictionAlgorithm}>
                      <option value="graphDistance">Graph Distance</option>
                      <option value="commonNeighbors">Common Neighbors</option>
                      <option value="preferentialAttachment">Preferential Attachment</option>
                      <option value="jaccard">Jaccard</option>
                      <option value="adamicAdar">Adamic Adar</option>
                    </Input>
                  </Label>
                  <Label>
                    Theresold:
                    <Input
                      type="number"
                      name="theresold"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.theresold}
                      step="0.1"
                      min="0" />
                  </Label>
                  <Button color="primary" size="sm" onClick={this.prediction}>Start</Button>
                </FormGroup>
              </Form>
              <a href="#" className="visualization__fullscreen" onClick={this.toggleFullscreen}>Fullscreen</a>
              <br/>
              <a href="#" className="visualization__reload" onClick={this.updateData}>Update data</a>
              <br/>
              <a href="#" className="visualization__reload text-danger" onClick={this.resetData}>Reset data</a>
              <div className="visualization__render" />
            </CardBlock>
          </Card>
          <div className="node-tooltip" ref={(el) => this.tooltip = el}>Aucun noeud sélectionné</div>
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Visualization)
