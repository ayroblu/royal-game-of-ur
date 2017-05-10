import io from 'socket.io-client'

export default function setup(game){
  const socket = io()
  socket.on('connect', function(){
    console.log('Socket connection made')
  })
  return socket
}

