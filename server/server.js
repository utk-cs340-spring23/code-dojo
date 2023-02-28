/*---------------------------------------------------------------------------*/
/* Required Modules                                                          */
/*---------------------------------------------------------------------------*/
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path")
// const { Console } = require("console");

/*---------------------------------------------------------------------------*/
/* Server                                                                    */
/*---------------------------------------------------------------------------*/
const port = 3000;
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

http.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/*---------------------------------------------------------------------------*/
/* Sockets                                                                   */
/*---------------------------------------------------------------------------*/
var current_question;
var current_answer;

// Whenever someone connects to our server
io.on("connection", function (socket) {
    var socketID = socket.id;
    var clientIP = socket.request.connection.remoteAddress;
    var nickname = socketID;

    console.log(nickname + " (" + clientIP + ")");
    io.emit("player join", socketID);

    // When the host creates a new question, push that question to every player
    socket.on("new question", function (question, answer) {
        console.log("new question " + question);
        current_question = question;
        current_answer = answer = answer;

        io.emit("push question", current_question);
    });

    // When a player submits an answer, tell them if they are right or wrong
    socket.on("submit answer", function (provided_answer) {
        process.stdout.write(socketID + " submitted answer " + provided_answer);

        if (provided_answer == current_answer) {
            console.log(" (correct answer)");
            io.to(socketID).emit("answer correct");
        } else {
            console.log(" (incorrect answer)");
            io.to(socketID).emit("answer incorrect");
        }
    });

    socket.on("disconnect", function () {
        io.emit("player leave", socketID);
    });
});
