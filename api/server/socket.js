module.exports = function(server){
  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    console.log('connection made')
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });
  })
}
