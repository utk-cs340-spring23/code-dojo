"use strict";
exports.__esModule = true;
/*----------------------------------------------------------------------------*/
/* Imports                                                                    */
/*----------------------------------------------------------------------------*/
var express = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var path = require("path");
var player_1 = require("./player");
var quizroom_1 = require("./quizroom");
/*----------------------------------------------------------------------------*/
/* Server                                                                     */
/*----------------------------------------------------------------------------*/
var app = express();
var server = http.createServer(app);
var port = 3000;
var publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
server.listen(port, function () {
    console.log("Socket.IO server running at http://localhost:".concat(port, "/"));
});
/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/
var io = new socket_io_1.Server(server);
var quizrooms = [];
io.on("connection", function (socket) {
    var curr_quizroom = null;
    var curr_room_id = "";
    console.log("connection " + socket.id);
    socket.on("join room as host", function (room_id) {
        if (room_id == curr_room_id) {
            return;
        }
        console.log("join room as host");
        socket.join(room_id);
        curr_room_id = room_id;
        // Create a new room if the provided room id does not exist
        if (curr_room_id != null && quizrooms[curr_room_id] == null) {
            console.log("created new room");
            quizrooms[curr_room_id] = new quizroom_1.QuizRoom(curr_room_id, new player_1.Player("Host", socket));
        }
        curr_quizroom = quizrooms[curr_room_id];
        io.to(curr_room_id).emit("player join", socket.id);
    });
    socket.on("join room as player", function (room_id) {
        if (room_id == curr_room_id) {
            return;
        }
        console.log("join room as player " + room_id);
        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", room_id);
            console.log("no room exist");
        }
        else {
            console.log("joined room");
            socket.join(room_id);
            curr_room_id = room_id;
            curr_quizroom = quizrooms[curr_room_id];
            io.to(socket.id).emit("join room success", room_id);
            io.to(curr_room_id).emit("player join", socket.id);
        }
    });
    // When the host creates a new question, push that question to every player
    socket.on("new question", function (question, answer) {
        if (curr_quizroom == null) {
            return;
        }
        console.log(socket.id + " : " + curr_quizroom.host.socket.id);
        if (socket != curr_quizroom.host.socket) {
            return;
        }
        console.log("new question " + question);
        curr_quizroom.question = question;
        curr_quizroom.answer = answer;
        io.to(curr_room_id).emit("push question", question);
    });
    // When a player submits an answer, tell them if they are right or wrong
    socket.on("submit answer", function (provided_answer) {
        if (curr_quizroom == null) {
            return;
        }
        process.stdout.write(socket.id + " submitted answer " + provided_answer);
        if (provided_answer == curr_quizroom.answer) {
            console.log(" (correct answer)");
            io.to(socket.id).emit("answer correct");
        }
        else {
            console.log(" (incorrect answer)");
            io.to(socket.id).emit("answer incorrect");
        }
    });
    socket.on("disconnect", function () {
        // If the host leaves, delete the room
        if (curr_quizroom != null && curr_quizroom.host.socket.id == socket.id) {
            quizrooms[curr_room_id] = null;
        }
        io.to(curr_room_id).emit("player leave", socket.id);
    });
});
