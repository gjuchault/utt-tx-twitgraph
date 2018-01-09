export default (filename, data) => {
  const $a = document.createElement('a')
  console.log(encodeURIComponent(data))
  $a.setAttribute('download', filename)
  $a.setAttribute('href', `data:application/octet-stream,${encodeURIComponent(data)}`)
  $a.style.display = 'none'

  document.body.appendChild($a)

  $a.click()

  document.body.removeChild($a)
}
