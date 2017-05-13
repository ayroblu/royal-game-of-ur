module.exports = function(server){
  var io = require('socket.io')(server)
  io.on('connection', function (socket) {
    console.log('connection made')

    socket.on('game start', data=>{
      socket.broadcast.emit('game start', data)
    })
    socket.on('game move', data=>{
      socket.broadcast.emit('game move', data)
    })
    socket.on('game switch', data=>{
      socket.broadcast.emit('game switch', data)
    })
    socket.on('player join', data=>{
      socket.broadcast.emit('player join', data)
    })
  })
}
