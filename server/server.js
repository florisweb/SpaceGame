global.Vector = new require("./vector.js").Vector;
const Clients = new require("./client.js").Clients;



const WebSocketServer = require('websocket').server;
const http = require('http');


var server = http.createServer(function(request, response) {});
server.listen(8080, function() {});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    console.log('[Connect] new client');
    Clients.addClient(connection);
});



