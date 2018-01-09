export default (url, data, headers) => {
  return fetch(url, {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, headers),
    body: JSON.stringify(data)
  })
}
