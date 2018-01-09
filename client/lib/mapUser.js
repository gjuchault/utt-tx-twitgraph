import io from 'socket.io-client'
import { user, relationship } from '../actions'

export default (store) => {
  const socket = io.connect()
  socket.on('user', () => {
    store.dispatch(user())
  })

  socket.on('rel', () => {
    store.dispatch(relationship())
  })
}
