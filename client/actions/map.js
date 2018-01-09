export const user = () => {
  return {
    type: 'INCREMENT_USERS'
  }
}

export const relationship = () => {
  return {
    type: 'INCREMENT_RELATIONS'
  }
}

export const addPrediction = (prediction) => {
  return {
    type: 'ADD_PREDICTION',
    payload: {
      source: prediction[0],
      target: prediction[1],
      prediction: true
    }
  }
}

export const fullData = (nodes, links) => {
  return {
    type: 'SET_RESULT',
    payload: { nodes, links }
  }
}
