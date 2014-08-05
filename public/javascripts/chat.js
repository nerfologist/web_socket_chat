(function (root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  
  var Chat = ChatApp.Chat = function (socket) {
    var that = this;
    this.socket = socket;
    this.room = null;
    
    socket.on('room_change_result', function (data) {
      console.log('changing this.room');
      that.room = data.room;
    })
  };
  
  Chat.prototype.sendMessage = function (message) {
    this.socket.emit('from_browser_event', { message: message, room: this.room });
  };
  
  Chat.prototype.requestNicknameChange = function (nickname) {
    this.socket.emit('nickname_change_request', { nickname: nickname });
  };
  
  Chat.prototype.joinRoom = function (roomName) {
    this.socket.emit('room_change_request', { room: roomName });
  };
})(this);