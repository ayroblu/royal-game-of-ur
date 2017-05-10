module.exports = function(server){
  var io = require('socket.io')(server)
  io.on('connection', function (socket) {
    console.log('connection made')

    socket.on('game move', function (data) {
      socket.broadcast.emit('game move', data)
    })
    socket.on('game switch', function () {
      socket.broadcast.emit('game switch')
    })
  })
}
