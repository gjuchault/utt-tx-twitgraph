import React from 'react'
import { connect } from 'react-redux'
import {
  Card, CardBlock, CardTitle, CardText,
  Breadcrumb, BreadcrumbItem,
  Form, FormGroup, Label, Input, FormText,
  Button, ButtonGroup
} from 'reactstrap'

import { go, fullData } from '../../actions'
import post from '../../lib/post'

import './Home.css'

const mapStateToProps = (state) => ({
  isHome: state.location === '/',
  tokenCount: state.tokens.length,
  users: state.map.users,
  relations: state.map.relations
})

const mapActionsToProps = (dispatch) => ({
  openTokens() {
    dispatch(go('/tokens'))
  },

  clearResults() {
    dispatch(fullData([], []))
  },

  openVisualizations() {
    dispatch(go('/visualization'))
  }
})

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: 'UTTroyes',
      depth: '3',
      breadth: '3',
      type: 'both'
    }

    this.chooseFollowers = this.chooseFollowers.bind(this)
    this.chooseFollowings = this.chooseFollowings.bind(this)
    this.chooseBoth = this.chooseBoth.bind(this)
    this.mapUser = this.mapUser.bind(this)
    this.showResults = this.showResults.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  mapUser(e) {
    e.preventDefault()

    this.props.clearResults()
    post('/api/v1/mapUser', {
      user: this.state.user,
      depth: this.state.depth,
      breadth: this.state.breadth,
      type: this.state.type
    })
  }

  chooseFollowers(e) {
    e.preventDefault()

    this.setState({
      type: 'followers'
    })
  }

  chooseFollowings(e) {
    e.preventDefault()

    this.setState({
      type: 'followings'
    })
  }

  chooseBoth(e) {
    e.preventDefault()

    this.setState({
      type: 'both'
    })
  }

  get division() {
    switch (this.state.type) {
      case 'followers':
        return `${this.state.breadth} followers`
      case 'followings':
        return `${this.state.breadth} followings`
      default:
        return `${Math.ceil(this.state.breadth / 2)} followings, ${Math.floor(this.state.breadth / 2)} followers`
    }
  }

  showResults() {
    this.props.openVisualizations()
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const followers = { color: this.state.type === 'followers' ? 'primary' : 'secondary' }
    const followings = { color: this.state.type === 'followings' ? 'primary' : 'secondary' }
    const both = { color: this.state.type === 'both' ? 'primary' : 'secondary' }

    return this.props.isHome && (
      <div id="app" className="home">
        <header>
          <h1>TwitGraph</h1>
        </header>
        <main>
          <Breadcrumb>
            <BreadcrumbItem active>
              Accueil
            </BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <CardBlock className="card-body">
              <CardTitle>Tokens</CardTitle>
              <CardText>Active tokens: {this.props.tokenCount}</CardText>
              <Button color="primary" size="sm" onClick={this.props.openTokens}>Tokens management</Button>
            </CardBlock>
          </Card>
          <Card>
            <CardBlock className="card-body">
              <Form>
                <FormGroup>
                  <Label className="form-group">
                    Twitter username:
                    <Input
                      type="text"
                      name="user"
                      onChange={this.handleInputChange}
                      value={this.state.user}
                      placeholder="UTTroyes"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label className="form-group">
                    <span title="Maximum relations between the initial user and the deepest user">Depth</span>:
                    <Input
                      type="number"
                      name="depth"
                      min="1"
                      onChange={this.handleInputChange}
                      value={this.state.depth}
                      placeholder="3"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label className="form-group">
                    <span title="Maximum relations per node">Breadth</span>:
                    <Input
                      type="number"
                      name="breadth"
                      max="200"
                      min="2"
                      onChange={this.handleInputChange}
                      value={this.state.breadth}
                      placeholder="3"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <ButtonGroup>
                    <Button onClick={this.chooseFollowers} {...followers}>Followers</Button>{' '}
                    <Button onClick={this.chooseBoth} {...both}>Both</Button>{' '}
                    <Button onClick={this.chooseFollowings} {...followings}>Followings</Button>
                  </ButtonGroup>
                  <small className="text-muted">{this.division} per user</small>
                </FormGroup>
                <Button color="success" size="lg" onClick={this.mapUser}>Start</Button>
                <br/>
                <br/>
                <p>Noeuds: {this.props.users} — Liens: {this.props.relations}</p>
                <a href="#" onClick={this.showResults}>Last results</a>
              </Form>
            </CardBlock>
          </Card>
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Home)
