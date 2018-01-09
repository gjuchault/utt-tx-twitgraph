const initialState = location.pathname

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'PUSH') {
    newState = action.payload
  }

  return newState
}
