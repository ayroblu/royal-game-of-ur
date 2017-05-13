module.exports = function(server){
  var io = require('socket.io')(server)
  io.on('connection', socket=>{
    console.log('connection made')

    socket.on('join room', room=>{
      socket.join(room)
      socket.on('game start', data=>{
        socket.broadcast.to(room).emit('game start', data)
      })
      socket.on('game move', data=>{
        socket.broadcast.to(room).emit('game move', data)
      })
      socket.on('game switch', data=>{
        socket.broadcast.to(room).emit('game switch', data)
      })
      socket.on('player join', data=>{
        socket.broadcast.to(room).emit('player join', data)
      })
    })
  })
}
