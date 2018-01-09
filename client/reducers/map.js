import clone from 'lodash.clonedeep'

const initialState = {
  nodes: [],
  links: [],
  users: 0,
  relations: 0
}

export default (state = initialState, action) => {
  let newState = clone(state)

  if (action.type === 'INCREMENT_USERS') {
    newState.users += 1
  }

  if (action.type === 'INCREMENT_RELATIONS') {
    newState.relations += 1
  }

  if (action.type === 'ADD_PREDICTION') {
    newState.links.push(action.payload)
    newState.relations += 1
  }

  if (action.type === 'SET_RESULT') {
    newState = {
      nodes: action.payload.nodes,
      links: action.payload.links,
      users: action.payload.nodes.length,
      relations: action.payload.links.length
    }
  }

  return newState
}
