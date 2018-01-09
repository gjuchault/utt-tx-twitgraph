export const addToken = (token) => {
  return {
    type: 'ADD_TOKEN',
    payload: token
  }
}

export const removeToken = (token) => {
  return {
    type: 'REMOVE_TOKEN',
    payload: token
  }
}
