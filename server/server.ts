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
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/

let num_connections: number = 0;
let quizrooms: QuizRoom[] = [];

const io: SocketIOServer = new SocketIOServer(server);

io.on("connection", function (socket: Socket) {
    ++num_connections;
    let self_quizroom: QuizRoom | null = null;
    let self_player: Player | null = null;

    console.log("connection " + socket.id + " (total connections " + num_connections + ")");

    socket.on("create room", function (room_id: string) {
        if (self_quizroom != null) {
            io.to(socket.id).emit("create room fail", "already in room " + self_quizroom.id);
            return;
        }

        if (quizrooms[room_id] != null) {
            io.to(socket.id).emit("create room fail", "room already exists");
            return;
        }

        socket.join(room_id);

        quizrooms[room_id] = new QuizRoom(room_id, new Player("Host", socket));

        self_quizroom = quizrooms[room_id];

        io.to(socket.id).emit("create room success", "Successfully created room " + room_id);
    });

    /* Join room only applies to players. This sets the socket's room and sets the self_quizroom and self_player variables. */
    socket.on("join room", function (room_id: string, nickname: string) {
        /* If the user tries to join the room they are already in, do nothing. */
        if (room_id == self_quizroom?.id) {
            return;
        }

        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", "room " + room_id + " does not exist");
            console.log("no room exist");
            return;
        }

        console.log("joined room");
        socket.join(room_id);

        self_quizroom = quizrooms[room_id];

        if (self_quizroom == null) {
            console.log("Something is very very wrong!!!");
            return;
        }

        self_quizroom.players[socket.id] = new Player(nickname, socket);
        self_player = self_quizroom.players[socket.id];

        io.to(socket.id).emit("join room success", room_id, self_quizroom?.question);
        io.to(self_quizroom.id).emit("player join", socket.id, nickname);

    });

    // When the host creates a new question, push that question to every player
    socket.on("new question", function (question: string, answer: string) {
        if (self_quizroom == null) {
            io.to(socket.id).emit("new question fail", "room does not exist");
            return;
        }

        console.log(socket.id + " : " + self_quizroom.host.socket.id);
        if (socket != self_quizroom.host.socket) {
            io.to(socket.id).emit("new question fail", "you are not the host!");
            return;
        }

        console.log("new question " + question);
        self_quizroom.question = question;
        self_quizroom.answer = answer;

        io.to(socket.id).emit("new question success", "successfully pushed question");
        io.to(self_quizroom.id).emit("push question", question);

        ++self_quizroom.num_questions;
    });

    // When a player submits an answer, tell them if they are right or wrong
    socket.on("submit answer", function (provided_answer) {
        if (self_quizroom == null) {
            io.to(socket.id).emit("submit answer fail", "room does not exist");
            return;
        }

        process.stdout.write(socket.id + " submitted answer " + provided_answer);

        if (provided_answer == self_quizroom.answer) {
            console.log(" (correct answer)");
            io.to(socket.id).emit("answer correct");
            io.to(self_quizroom.host.socket.id).emit("player answer correct", socket.id);
        } else {
            console.log(" (incorrect answer)");
            io.to(socket.id).emit("answer incorrect");
            io.to(self_quizroom.host.socket.id).emit("player answer incorrect", socket.id);
        }
    });

    socket.on("disconnect", function () {
        --num_connections;
        console.log("disconnect " + socket.id + " (total connections " + num_connections + ")");
        console.log(self_quizroom?.id + " " + self_quizroom?.host.socket.id + " " + socket.id);

        /* If the host leaves, delete the entire QuizRoom. If a player leaves, only delete that player's entry the QuizRoom's "Players" table. */
        if (self_quizroom != null) {
            if (self_quizroom.host.socket.id == socket.id) {
                console.log("Should be deleting room " + self_quizroom.id);
                quizrooms[self_quizroom.id] = null;
            } else if (self_player != null) {
                console.log("Should be deleting player " + self_player.nickname + " (socket ID " + socket.id + ")");
                self_quizroom.players[socket.id] = null;
                io.to(self_quizroom.id).emit("player leave", socket.id);
            }
        }
    });
});
