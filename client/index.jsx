import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { applyMiddleware, createStore } from 'redux'
import 'bootstrap/dist/css/bootstrap.css'

import Home from './components/Home/Home'
import Tokens from './components/Tokens/Tokens'
import AddToken from './components/AddToken/AddToken'
import Visualization from './components/Visualization/Visualization'
import reducers from './reducers'
import { fullData, addToken, go } from './actions'
import mapUser from './lib/mapUser'
import './main.css'

console.log(require('./main.css'))

const store = createStore(
  reducers,
  undefined // applyMiddleware(logger)
)

const $app = document.createElement('div')

// Initial token load
fetch('/api/v1/listTokens')
  .then((res) => res.json())
  .then((body) => {
    body.tokens.forEach(token => store.dispatch(addToken(token)))
  })

if (location.pathname === '/visualization') {
  fetch('/api/v1/getAll')
    .then(res => res.json())
    .then((data) => {
      store.dispatch(fullData(data.nodes, data.links))
    })
}

window.onpopstate = (event) => {
  store.dispatch(go(location.pathname, true))
}

mapUser(store)

window.$store = store

ReactDOM.render(
  <Provider store={ store }>
    <div>
      <Home />
      <Tokens />
      <AddToken />
      <Visualization />
    </div>
  </Provider>,
  $app
)

document.body.insertBefore($app, document.body.firstChild)
