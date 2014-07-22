var socketio = require('socket.io');
  
var createChat = function (server) {
  var io = socketio(server);
  // console.log("outside of connecting!");
  
  io.on('connection', function (socket) {
    console.log("new connection");
    socket.emit('from_node_event', { message: 'Hi from node!' });
    socket.on('from_browser_event', function (data) {
      console.log(data);
      io.sockets.emit('from_node_event', { message: data.message });
    });
  });
};

module.exports.createChat = createChat;