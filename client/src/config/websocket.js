import socketIOClient from 'socket.io-client'

export function websocketConnect() {
  const socket = socketIOClient(process.env.REACT_APP_API_URL, {
    transport : ['websocket']
  })

  return socket
}