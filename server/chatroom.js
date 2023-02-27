const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Console } = require('console');
const path = require('path')

const port = 3000;

var num_connections = 0;

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/chatroom.html'));
});

io.on('connection', (socket) => {
    num_connections++;
    var socketID = socket.id;
    var clientIP = socket.request.connection.remoteAddress;
    var nickname = socketID;

    console.log(nickname + " (" + clientIP + ") connected (total connections: " + num_connections + ")");
    io.emit('connect message', socketID)

    socket.on('new nickname', function (provided_nickname) {
        nickname = provided_nickname;
        console.log(socketID + " changed their nickname to " + nickname);
        io.emit('nickname message', socketID, nickname);
    });

    socket.on('chat message', function (msg) {
        console.log(socketID + " sent message: " + msg);
        io.emit('chat message', nickname, msg);
    });

    socket.on('disconnect', function () {
        num_connections--;
        console.log(socketID + " (" + clientIP + ") disconnected (total connections: " + num_connections + ")");
        io.emit('disconnect message', nickname);
    });
});



http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
