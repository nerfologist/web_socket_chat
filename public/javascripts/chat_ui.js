$(document).ready(function () {
  var socket = io.connect();
  var chat = new ChatApp.Chat(socket);
  
  var parseMsgForm = function () {
    return $('#msg_input').val();
  };
  
  // var parseNicknameForm = function () {
  //   return $('#nickname_input').val();
  // };
  
  var sendMessage = function (msg) {
    chat.sendMessage(msg);
  };
  
  var appendMsg = function (msg) {
    var $li = $('<li>');
    $li.text(msg);
    $('#msg_target').append($li);
  };
  
  var sendNicknameChangeRequest = function (newNick) {
    chat.requestNicknameChange(newNick);
  };
  
  var sendRoomChangeRequest = function (newRoom) {
    chat.joinRoom(newRoom);
  };
  
  $('form#messageForm').on('submit', function (event) {
    event.preventDefault();
    var msg = parseMsgForm();
    
    // custom commands
    if (msg.match(/^\/.*/)) {
      return _handleCommand(msg);
    }
    
    sendMessage(msg);
  });
  
  var _handleCommand = function (cmd) {
    // nickname change
    if (cmd.match(/^\/nick/)) {
      var nick = cmd.match(/\/nick\s*(\w+)/)[1];
      return sendNicknameChangeRequest(nick);
    } else if (cmd.match(/^\/room/)) {
      var room = cmd.match(/\/room\s*(\w+)/)[1];
      return sendRoomChangeRequest(room);
    }
  };

  // $('form#nicknameForm').on('submit', function (event) {
  //   event.preventDefault();
  //   var newNick = parseNicknameForm();
  //   sendNicknameChangeRequest(newNick);
  // });
  
  socket.on('from_node_event', function (data) {
    appendMsg(data.message);
  });
  
  socket.on('nickname_change_result', function (data) {
    appendMsg('nickname changed to ' + data.nickname);
  });
  
  socket.on('room_change_result', function (data) {
    console.log(data.message);
  })
});
