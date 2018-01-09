import React from 'react'
import { connect } from 'react-redux'
import {
  Card, CardBlock, CardTitle, CardText,
  Breadcrumb, BreadcrumbItem,
  Form, FormGroup, Label, Input, FormText,
  Button
} from 'reactstrap'

import { go, addToken } from '../../actions'
import post from '../../lib/post'

import './AddToken.css'

const mapStateToProps = (state) => ({
  isAddToken: state.location === '/tokens/add'
})

const mapActionsToProps = (dispatch) => ({
  backHome(e) {
    e.preventDefault()
    dispatch(go('/'))
  },

  backTokens(e) {
    e.preventDefault()
    dispatch(go('/tokens'))
  },

  addToken(token) {
    post('/api/v1/addToken', { token })
      .then(() => dispatch(addToken(token)))
      .then(() => dispatch(go('/tokens')))
  }
})

class AddToken extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      consumer_key: '',
      consumer_secret: '',
      access_token_key: '',
      access_token_secret: ''
    }

    this.addToken = this.addToken.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addToken(e) {
    e.preventDefault()

    this.props.addToken({
      name: this.state.name,
      consumer_key: this.state.consumer_key,
      consumer_secret: this.state.consumer_secret,
      access_token_key: this.state.access_token_key,
      access_token_secret: this.state.access_token_secret
    })
  }

  render() {
    return this.props.isAddToken && (
      <div id="app" className="addtoken">
        <header>
          <h1>TwitGraph — Add a token</h1>
        </header>
        <main>
          <Breadcrumb>
            <BreadcrumbItem>
              <a href="#" onClick={this.props.backHome}>Home</a>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <a href="#" onClick={this.props.backTokens}>Tokens</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              Add a token
            </BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <CardBlock className="card-body">
              <CardTitle>New token</CardTitle>
              <Form>
                <FormGroup>
                  <Label>
                    Name:
                    <Input
                      type="text"
                      name="name"
                      onChange={this.handleInputChange}
                      value={this.state.name}
                      placeholder="Token A"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Consumer key:
                    <Input
                      type="text"
                      name="consumer_key"
                      onChange={this.handleInputChange}
                      value={this.state.consumer_key}
                      placeholder="xvz1evFS4wEEPTGEFPHBog"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Consumer secret:
                    <Input
                      type="password"
                      name="consumer_secret"
                      onChange={this.handleInputChange}
                      value={this.state.consumer_secret}
                      placeholder="xvz1evFS4wEEPTGEFPHBog"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Access token key:
                    <Input
                      type="text"
                      name="access_token_key"
                      onChange={this.handleInputChange}
                      value={this.state.access_token_key}
                      placeholder="xvz1evFS4wEEPTGEFPHBog"
                      required />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Access token secret:
                    <Input
                      type="password"
                      name="access_token_secret"
                      onChange={this.handleInputChange}
                      value={this.state.access_token_secret}
                      placeholder="xvz1evFS4wEEPTGEFPHBog"
                      required />
                  </Label>
                </FormGroup>
                <Button color="primary" onClick={this.addToken}>Add</Button>
              </Form>
            </CardBlock>
          </Card>
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AddToken)
