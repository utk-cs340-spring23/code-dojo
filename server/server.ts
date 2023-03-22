/*----------------------------------------------------------------------------*/
/* Imports                                                                    */
/*----------------------------------------------------------------------------*/
// Note: importing everything using "*" may be a problem?
import { strict as assert } from 'node:assert';
import * as express from "express";
import * as http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import * as path from "path";
import { Player } from "./player";
import { Host } from "./host";
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

let num_connections: number = 0;
let quizrooms: QuizRoom[] = [];

/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/
const io: SocketIOServer = new SocketIOServer(server);

io.on("connection", function (socket: Socket) {
    ++num_connections;
    let self_quizroom: QuizRoom | null = null;
    let self_player: Player | null = null;

    console.log(`connection ${socket.id} (total connections ${num_connections})`);

    /* When a new room is created, we instantiate a new QuizRoom and store it in the array quizrooms, keyed by room id */
    socket.on("create room", function (room_id: string) {
        if (self_quizroom != null) {
            io.to(socket.id).emit("create room fail", `already in room  ${self_quizroom.id}`);
            return;
        }

        if (quizrooms[room_id] != null) {
            io.to(socket.id).emit("create room fail", "room already exists");
            return;
        }

        socket.join(room_id);

        quizrooms[room_id] = new QuizRoom(room_id, new Host("Host", socket));
        self_quizroom = quizrooms[room_id];

        io.to(socket.id).emit("create room success", `Successfully created room ${room_id}`);
    });

    /* Join room only applies to players. This sets the socket's room and sets the self_quizroom and self_player variables. */
    socket.on("join room", function (room_id: string, nickname: string) {
        /* If the user tries to join the room they are already in, do nothing. */
        if (room_id == self_quizroom?.id) {
            return;
        }

        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", `room ${room_id} does not exist`);
            console.log("no room exist");
            return;
        }

        console.log("joined room");
        socket.join(room_id);

        self_quizroom = quizrooms[room_id];

        assert(self_quizroom != null, `Player ${nickname} (id ${socket.id}) just joined room ${room_id} but the room does not exist on the server!`);

        self_quizroom.players[socket.id] = new Player(nickname, socket);
        self_player = self_quizroom.players[socket.id];

        if (self_quizroom.is_question_active) {
            io.to(socket.id).emit("join room success", room_id, self_quizroom?.questions.at(-1));
        } else {
            io.to(socket.id).emit("join room success", room_id, "Waiting for next question...");
        }


        io.to(self_quizroom.id).emit("player join", socket.id, nickname);

    });

    /* When the host creates a new question, push that question to every player */
    socket.on("new question", function (question: string, answer: string) {
        if (self_quizroom == null) {
            io.to(socket.id).emit("new question fail", "room does not exist");
            return;
        }

        console.log(`${socket.id} : ${self_quizroom.host.socket.id}`);
        if (socket != self_quizroom.host.socket) {
            io.to(socket.id).emit("new question fail", "you are not the host!");
            return;
        }

        if (self_quizroom.is_question_active) {
            io.to(socket.id).emit("new question fail", "there is already a question active!");
            return;
        }

        console.log(`new question ${question} (answer: ${answer})`);
        self_quizroom.questions.push(question);
        self_quizroom.answers.push(answer);
        self_quizroom.is_question_active = true;

        io.to(socket.id).emit("new question success", "successfully pushed question");
        io.to(self_quizroom.id).emit("push question", question);

    });

    /* When the host closes the question, we need to grade every player's response and tell them if they are right or wrong */
    socket.on("close question", function () {
        if (self_quizroom == null) {
            io.to(socket.id).emit("close question fail", "you aren't the host of any room!");
            return;
        }

        if (socket != self_quizroom.host.socket) {
            io.to(socket.id).emit("close question fail", "you are not the host!");
            return;
        }

        if (!self_quizroom.is_question_active) {
            io.to(socket.id).emit("close question fail", "There is no question active!");
            return;
        }

        for (const [key, player] of Object.entries(self_quizroom.players)) {
            assert(key == player.socket.id, "A player's socket id and their key don't match!");

            if (player.answers.at(-1) == self_quizroom.answers.at(-1)) {
                assert(player.answers.at(-1) == player.answers[self_quizroom.answers.length - 1], "Player's answers array is malformed!");
                io.to(player.socket.id).emit("answer correct");
                io.to(self_quizroom.host.socket.id).emit("player answer correct", player.socket.id);
                self_player?.is_correct.push(true);
            } else {
                io.to(player.socket.id).emit("answer incorrect");
                io.to(self_quizroom.host.socket.id).emit("player answer incorrect", player.socket.id);
                self_player?.is_correct.push(false);
            }
        }

        self_quizroom.is_question_active = false;
        io.to(socket.id).emit("close question success", "Successfully closed and graded questions");
    });

    /* We store every player's answer in the Player's "answers" table. The index is the number of the current question. */
    socket.on("submit answer", function (provided_answer) {
        if (self_player == null) {
            io.to(socket.id).emit("submit answer fail", "you don't exist on the server! something is terribly wrong");
            return;
        }

        if (self_quizroom == null) {
            io.to(socket.id).emit("submit answer fail", "room does not exist");
            return;
        }

        console.log(`${socket.id} submitted answer ${provided_answer}`);

        /* We do not use push here. If player submits more than one answer or if player joined midway through quiz, it still goes to the same index in their answers array. */
        self_player.answers[self_quizroom.questions.length - 1] = provided_answer;

        io.to(socket.id).emit("submit answer success", "successfully submitted answer");
    });

    /* If the host leaves, delete the entire QuizRoom. If a player leaves, only delete that player's entry the QuizRoom's "Players" table. */
    socket.on("disconnect", function () {
        --num_connections;
        console.log(`disconnect ${socket.id} (total connections ${num_connections})`);
        console.log(`${self_quizroom?.id} ${self_quizroom?.host.socket.id} ${socket.id}`);

        if (self_quizroom != null) {
            if (self_quizroom.host.socket.id == socket.id) {
                console.log(`Should be deleting room  ${self_quizroom.id}`);
                delete quizrooms[self_quizroom.id];
            } else if (self_player != null) {
                console.log(`Should be deleting player ${self_player.nickname} (socket ID ${socket.id})`);
                delete self_quizroom.players[socket.id];
                io.to(self_quizroom.id).emit("player leave", socket.id);
            }
        }
    });
});
