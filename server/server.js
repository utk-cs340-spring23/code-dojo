// Required modules
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
// const { Console } = require('console');

// Server port
const port = 3000;

// When you go to localhost:3000, you get quiz.html
app.get('/', function (req, res) {
    res.sendFile(path.resolve('./public/quiz.html'));
});

// When you go to localhost:3000/quiz.js, you get quiz.js
app.get('/quiz.js', function (req, res) {
    res.sendFile(path.resolve('./public/quiz.js'));
});

// Whenever we get a connection from a new client:
io.on('connection', function (socket) {
    var socketID = socket.id;
    var clientIP = socket.request.connection.remoteAddress;
    var nickname = socketID;

    console.log(nickname + " (" + clientIP + ")");
    io.emit('connect message', socketID);

    // Whenever someone submits an answer:
    socket.on('submit answer', function (answer) {
        // console.log without trailing newline
        process.stdout.write(socketID + " submitted answer " + answer);

        if (answer == "4") {
            console.log("Correct answer");
            io.to(socketID).emit('answer correct');
        } else {
            console.log("Incorrect answer");
            io.to(socketID).emit('answer incorrect');
        }
    });
});

// Start server
http.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
