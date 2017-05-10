import io from 'socket.io-client'

export default function setup(game){
  const socket = io()
  socket.on('connect', function(){
    console.log('Socket connection made')
  })
  socket.on('game move', function(data){
    console.log('game move', data)
    game.opponentsMove(data)
  })
  socket.on('game switch', function(){
    console.log('game switch')
    game._switchTurn()
  })
  return socket
}

