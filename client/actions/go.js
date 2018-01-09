export const go = (location, disablePushState = false) => {
  if (!disablePushState) {
    history.pushState(null, location, location)
  }

  return {
    type: 'PUSH',
    payload: location
  }
}
