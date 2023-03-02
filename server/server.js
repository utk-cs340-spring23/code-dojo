/*----------------------------------------------------------------------------*/
/* Required Modules                                                           */
/*----------------------------------------------------------------------------*/
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path")
const { QuizRoom } = require('./quizroom');
// const { Console } = require("console");

/*----------------------------------------------------------------------------*/
/* Server                                                                     */
/*----------------------------------------------------------------------------*/
const port = 3000;
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

http.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/

var quizrooms = [];

// Whenever someone connects to our server
io.on("connection", function (socket) {
    // var clientIP = socket.request.connection.remoteAddress;
    var current_quizroom = null;
    var current_room_id = null;

    console.log("connection " + socket.id);

    socket.on("join room as host", function (room_id) {
        if (room_id == current_room_id) {
            return;
        }

        console.log("join room as host");

        socket.join(room_id);
        current_room_id = room_id;

        // Create a new room if the provided room id does not exist
        if (quizrooms[current_room_id] == null) {
            console.log("created new room");
            quizrooms[current_room_id] = new QuizRoom(current_room_id, socket);
        }

        current_quizroom = quizrooms[current_room_id];

        io.to(current_room_id).emit("player join", socket.id);
    });

    socket.on("join room as player", function (room_id) {
        if (room_id == current_room_id) {
            return;
        }

        console.log("join room as player " + room_id);
        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", room_id);
            console.log("no room exist");
        } else {
            console.log("joined room");
            socket.join(room_id);
            current_room_id = room_id;
            current_quizroom = quizrooms[current_room_id];
            io.to(socket.id).emit("join room success", room_id);
            io.to(current_room_id).emit("player join", socket.id);
        }
    });

    // When the host creates a new question, push that question to every player
    socket.on("new question", function (question, answer) {
        console.log(socket.id + " : " + current_quizroom.host_socket.id);
        if (socket != current_quizroom.host_socket) {
            return;
        }

        console.log("new question " + question);
        current_quizroom.question = question;
        current_quizroom.answer = answer;

        io.to(current_room_id).emit("push question", question);
    });

    // When a player submits an answer, tell them if they are right or wrong
    socket.on("submit answer", function (provided_answer) {
        process.stdout.write(socket.id + " submitted answer " + provided_answer);

        if (provided_answer == current_quizroom.answer) {
            console.log(" (correct answer)");
            io.to(socket.id).emit("answer correct");
        } else {
            console.log(" (incorrect answer)");
            io.to(socket.id).emit("answer incorrect");
        }
    });

    socket.on("disconnect", function () {
        // If the host leaves, remove the room
        if (current_quizroom != null && current_quizroom.host_socket.id == socket.id) {
            quizrooms[current_room_id] = null;
        }

        io.to(current_room_id).emit("player leave", socket.id);
    });
});
