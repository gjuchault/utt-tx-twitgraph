const initialState = []

export default (state = initialState, action) => {
  let newState = state.slice()

  if (action.type === 'ADD_TOKEN') {
    newState = newState.concat([ action.payload ])
  }

  if (action.type === 'REMOVE_TOKEN') {
    newState = newState.filter((token) =>
      token.name !== action.payload.name
    )
  }

  return newState
}
