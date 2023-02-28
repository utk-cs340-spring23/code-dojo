const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Console } = require('console');
const path = require('path')

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/quiz.html'));
});

app.get('/quiz.js', (req, res) => {
    res.sendFile(path.resolve('./public/quiz.js'));
});

io.on('connection', (socket) => {
    var socketID = socket.id;
    var clientIP = socket.request.connection.remoteAddress;
    var nickname = socketID;

    console.log(nickname + " (" + clientIP + ")");
    io.emit('connect message', socketID);

    socket.on('submit answer', function (answer) {
        console.log(socketID + " submitted answer " + answer);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
