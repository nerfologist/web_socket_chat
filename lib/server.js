var http = require('http');
var static = require('node-static');
var chatServer = require('./chat_server');
var fileServer = new static.Server('public');
var socketio = require('socket.io');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    if (req.url === '/') {
      fileServer.serveFile('index.html', 200, {}, req, res);
    }
    fileServer.serve(req, res);
  }).resume();
});

server.listen(8080);
chatServer.createChat(server);