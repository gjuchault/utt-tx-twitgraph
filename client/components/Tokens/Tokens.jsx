import React from 'react'
import { connect } from 'react-redux'
import {
  Card, CardBlock, CardTitle,
  Breadcrumb, BreadcrumbItem,
  ListGroup, ListGroupItem, ListGroupItemHeading,
  Form, FormGroup, Label, Input, FormText,
  Button
} from 'reactstrap'

import { go, addToken, removeToken } from '../../actions'
import post from '../../lib/post'

import './Tokens.css'

const mapStateToProps = (state) => ({
  isTokens: state.location === '/tokens',
  tokens: state.tokens
})

const mapActionsToProps = (dispatch) => ({
  backHome(e) {
    e.preventDefault()
    dispatch(go('/'))
  },

  addToken(e) {
    e.preventDefault()
    dispatch(go('/tokens/add'))
  },

  removeToken(token) {
    post('/api/v1/removeToken', token)
      .then(() => dispatch(removeToken(token)))
  }
})

class Tokens extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showSecrets: props.tokens.map((token) => false)
    }

    this.showSecret = this.showSecret.bind(this)
    this.removeToken = this.removeToken.bind(this)
  }

  showSecret(i) {
    return (e) => {
      e.preventDefault()

      const showSecrets = this.state.showSecrets.slice()
      showSecrets[i] = true

      this.setState({ showSecrets })
    }
  }

  removeToken(i) {
    return (e) => {
      e.preventDefault()

      const name = this.props.tokens[i].name

      if (confirm(`Remove token ${name}`)) {
        this.props.removeToken({ name })
      }
    }
  }

  render() {
    return this.props.isTokens && (
      <div id="app" className="tokens">
        <header>
          <h1>TwitGraph — Tokens</h1>
        </header>
        <main>
          <Breadcrumb>
            <BreadcrumbItem>
              <a href="#" onClick={this.props.backHome}>Home</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>Tokens</BreadcrumbItem>
          </Breadcrumb>
          <h3>Actives tokens</h3>
          <Button color="primary" onClick={this.props.addToken}>Add a token</Button>
          <ListGroup>
            {this.props.tokens.map((token, i) => (
              <ListGroupItem key={i}>
                <ListGroupItemHeading>{token.name}</ListGroupItemHeading>
                <div>
                  <strong>Consumer key :</strong> {token.consumer_key}
                </div>
                <div>
                  <strong>Token key :</strong> {token.access_token_key}
                </div>
                {!this.state.showSecrets[i] && <Button onClick={this.showSecret(i)}>Show secrets</Button>}
                {this.state.showSecrets[i] && (
                  <div>
                    <strong>Consumer secret :</strong> {token.consumer_secret}
                  </div>
                )}
                {this.state.showSecrets[i] && (
                  <div>
                    <strong>Token secret :</strong> {token.access_token_secret}
                  </div>
                )}
                <div/>
                <a href="#" className="text-danger" onClick={this.removeToken(i)}>Remove token</a>
              </ListGroupItem>
            ))}
          </ListGroup>
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Tokens)
