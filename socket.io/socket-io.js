exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
      // insert here your event
      // insert here your event
      /**
       * create or joins a room
       */
      socket.on('create or join', function(room, userId){
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
        console.log('someone joining');
      });
      socket.on('chat', function (room, userId, chatText){
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });
      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
      socket.on('draw', function(room, userId, width, height, prevX, prevY, currX, currY, color, thickness){
        io.sockets.to(room).emit('draw', room, userId, width, height, prevX, prevY, currX, currY, color, thickness);
        //console.log(room,userId);
      });
    } catch (e) {
    }
  });
}