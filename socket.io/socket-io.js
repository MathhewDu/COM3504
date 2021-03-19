
exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
      // insert here your event
      /**
       * create or joins a room
       */
      socket.on('create or join', function(room, userId){
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
      });
      socket.on('chat', function (room, userId, chatText){
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });
      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}
