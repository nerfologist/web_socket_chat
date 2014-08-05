var socketio = require('socket.io');

var _setNickname = function (socket, nickname) {
  nicknames[nickname] = socket;
};

var _joinRoom = function (socket, room) {
  currentRooms[room] = (currentRooms[room] || []);
  if (currentRooms[room].indexOf(socket) === -1){
    var previousRoom = _currentRoom(socket);

    if (previousRoom) {
      var socketIndex = currentRooms[previousRoom].indexOf(socket);
      currentRooms[previousRoom].splice(socketIndex, 1);
    }
    
    currentRooms[room].push(socket);
  }
};

var _currentRoom = function (socket) {
  for (var room in currentRooms){
    if (currentRooms.hasOwnProperty(room)){
      if (currentRooms[room].indexOf(socket) !== -1){
        return room;
      }
    }
  }
};

var _currentNickname = function (socket) {
  for (var nick in nicknames){
    if (nicknames.hasOwnProperty(nick)){
      if (nicknames[nick] === socket){
        return nick;
      }
    }
  }
};

var createChat = function (server) {
  var io = socketio(server);
  // console.log("outside of connecting!");
  
  io.on('connection', function (socket) {
    console.log("new connection");
    socket.emit('from_node_event', { message: 'Hi from node!' });
    
    var newNickname = 'Guest' + guestnumber++;
    _setNickname(socket, newNickname);
    _joinRoom(socket, 'lobby');
        
    socket.emit('nickname_change_result', {
      success: true,
      message: 'new nickname successfully set',
      nickname: newNickname
    });
    
    socket.emit('room_change_result', {
      success: true,
      messsage: 'default room set',
      room: 'lobby'
    });
    
    socket.on('nickname_change_request', function (data) {
      console.log(data);
      var err = _checkNickname(data.nickname);
      if (err) {
        return socket.emit('nickname_change_result', {
          success: false,
          message: err
        });
      }
      
      _setNickname(socket, nickname);
      
      socket.emit('nickname_change_result', {
        success: true,
        message: 'new nickname successfully set',
        nickname: data.nickname
      });
    });
    
    socket.on('room_change_request', function (data) {
      socket.join(data.room);
      _joinRoom(socket, data.room);
      console.log('user joined room ' + data.room);

      socket.emit('room_change_result', {
        success: true,
        message: _currentNickname(socket) + ' joined room ' + data.room,
        room: data.room
      });
    });
    
    socket.on('from_browser_event', function (data) {
      console.log(data);
      for (var room in currentRooms){
        if (currentRooms.hasOwnProperty(room) && room === data.room){
          currentRooms[room].forEach(function (socket) {
            socket.emit('from_node_event', { message: data.message });
          });
        }
      }
    });
  });
};

var _checkNickname = function (nickname) {
  if (nickname.match(/Guest\d*/)) {
    return 'nickname is not allowed';
  }
  
  for (var key in nicknames) {
    if (nicknames.hasOwnProperty(key)) {
      return 'nickname is taken';
    }
  }
};

var nicknames = {};
var currentRooms = {};
var guestnumber = 1;

module.exports.createChat = createChat;