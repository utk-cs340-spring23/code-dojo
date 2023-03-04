/*----------------------------------------------------------------------------*/
/* Imports                                                                    */
/*----------------------------------------------------------------------------*/
import * as express from "express";
import * as http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import * as path from "path";
import { Player } from "./player";
import { QuizRoom } from "./quizroom";

/*----------------------------------------------------------------------------*/
/* Server                                                                     */
/*----------------------------------------------------------------------------*/
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = 3000;
const publicPath: string = path.join(__dirname, "../public");

app.use(express.static(publicPath));

server.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/

let num_connections: number = 0;
let quizrooms: QuizRoom[] = [];

const io: SocketIOServer = new SocketIOServer(server);

io.on("connection", function (socket: Socket) {
    ++num_connections;
    let curr_quizroom: QuizRoom | null = null;
    let curr_room_id: string = "";
    let curr_nickname: string = "";

    console.log("connection " + socket.id + " (total connections " + num_connections + ")");

    socket.on("create room", function (room_id: string) {
        if (curr_quizroom != null || room_id == curr_room_id) {
            io.to(socket.id).emit("create room fail", "already in room " + curr_room_id);
            return;
        }

        if (quizrooms[room_id] != null) {
            io.to(socket.id).emit("create room fail", "room already exists");
            return;
        }

        socket.join(room_id);

        quizrooms[room_id] = new QuizRoom(room_id, new Player("Host", socket));

        curr_quizroom = quizrooms[room_id];
        curr_room_id = room_id;
        curr_nickname = "Host";

        io.to(socket.id).emit("create room success", room_id);
    });

    socket.on("join room", function (room_id: string, nickname: string) {
        if (room_id == curr_room_id) {
            return;
        }

        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", "room " + room_id + " does not exist");
            console.log("no room exist");
            return;
        }

        console.log("joined room");
        socket.join(room_id);

        curr_quizroom = quizrooms[room_id];
        curr_room_id = room_id;
        curr_nickname = nickname;

        io.to(socket.id).emit("join room success", room_id, curr_quizroom?.question);
        io.to(curr_room_id).emit("player join", socket.id, nickname);

    });

    // When the host creates a new question, push that question to every player
    socket.on("new question", function (question: string, answer: string) {
        if (curr_quizroom == null) {
            io.to(socket.id).emit("new question fail", "room " + curr_room_id + " does not exist");
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
            io.to(curr_quizroom.host.socket.id).emit("player answer correct", socket.id);
        } else {
            console.log(" (incorrect answer)");
            io.to(socket.id).emit("answer incorrect");
            io.to(curr_quizroom.host.socket.id).emit("player answer incorrect", socket.id);
        }
    });

    socket.on("disconnect", function () {
        --num_connections;
        console.log("disconnect " + socket.id + " (total connections " + num_connections + ")");
        console.log(curr_quizroom?.id + " " + curr_quizroom?.host.socket.id + " " + socket.id);

        // If the host leaves, delete the room
        if (curr_quizroom != null && curr_quizroom.host.socket.id == socket.id) {
            console.log("Should be deleting room " + curr_room_id);
            quizrooms[curr_room_id] = null;
        }

        io.to(curr_room_id).emit("player leave", socket.id);
    });
});
