$(document).ready(function () {
  var socket = io.connect();
  var chat = new ChatApp.Chat(socket);
  
  var parseForm = function () {
    return $('#msg_input').val();
  };
  
  var sendMessage = function (msg) {
    chat.sendMessage(msg);
  };
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    var msg = parseForm();
    sendMessage(msg);
  });
  
  var appendMsg = function (msg) {
    var $li = $('<li>');
    $li.text(msg);
    $('#msg_target').append($li);
  };
  
  socket.on('from_node_event', function (data) {
    appendMsg(data.message);
  });
});
