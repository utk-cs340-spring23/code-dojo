/*----------------------------------------------------------------------------*/
/* Imports                                                                    */
/*----------------------------------------------------------------------------*/
import { strict as assert } from 'node:assert';
import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

import { Host } from "./host.js";
import { Player } from "./player.js";
import { QuestionType, Question } from "./question.js";
import { QuizRoom } from "./quizroom.js";

/*----------------------------------------------------------------------------*/
/* Server                                                                     */
/*----------------------------------------------------------------------------*/
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = 3000;
const public_path = new URL("../public", import.meta.url).pathname;

app.use(express.static(public_path));

server.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

let num_connections: number = 0;
let quizrooms: QuizRoom[] = [];

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/
function close_question(this_quizroom: QuizRoom, io: SocketIOServer) {
    this_quizroom.close_question();

    for (const [key, player] of Object.entries(this_quizroom.players)) {
        assert(key == player.socket.id, "A player's socket id and their key don't match!");

        if (player.is_curr_correct) {
            io.to(player.socket.id).emit("answer correct");
            io.to(this_quizroom.host.socket.id).emit("player answer correct", player.socket.id);
        } else {
            io.to(player.socket.id).emit("answer incorrect");
            io.to(this_quizroom.host.socket.id).emit("player answer incorrect", player.socket.id);
        }
    }

    io.to(this_quizroom.id).emit("close question success", "Successfully closed and graded questions");
}

/*----------------------------------------------------------------------------*/
/* Socket IO                                                                  */
/* Handles all user connections                                               */
/*----------------------------------------------------------------------------*/
const io: SocketIOServer = new SocketIOServer(server);

io.on("connection", function (socket: Socket) {
    ++num_connections;

    /* The following two variables are specific to each "socket" */
    let this_quizroom: QuizRoom | null = null;
    let this_player: Player | null = null;

    console.log(`connection ${socket.id} (total connections ${num_connections})`);

    /* When a host creates a new room, we instantiate a new QuizRoom and store it in the array quizrooms, keyed by room id */
    socket.on("create room", function (room_id: string) {
        if (this_quizroom != null) {
            io.to(socket.id).emit("create room fail", `already in room  ${this_quizroom.id}`);
            return;
        }

        if (quizrooms[room_id] != null) {
            io.to(socket.id).emit("create room fail", "room already exists");
            return;
        }

        socket.join(room_id);

        quizrooms[room_id] = new QuizRoom(room_id, new Host("Host", socket));
        this_quizroom = quizrooms[room_id];

        io.to(socket.id).emit("create room success", `Successfully created room ${room_id}`);
    });

    /* Join room only applies to players. This sets the socket's room and sets the this_quizroom and this_player variables. */
    socket.on("join room", function (room_id: string, nickname: string) {
        /* If the user tries to join the room they are already in */
        if (room_id == this_quizroom?.id) {
            io.to(socket.id).emit("join room fail", `you are already in room ${room_id}`);
            return;
        }

        /* If the user tries to join a non-existant room */
        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", `room ${room_id} does not exist`);
            console.log("no room exist");
            return;
        }

        /* Join the socket room */
        socket.join(room_id);
        this_quizroom = quizrooms[room_id];

        assert(this_quizroom != null, `Player ${nickname} (id ${socket.id}) just joined room ${room_id} but the room does not exist on the server!`);

        /* Add player to the QuizRoom "players" table */
        this_quizroom.add_player(new Player(nickname, socket));
        this_player = this_quizroom.players[socket.id];

        /* If there's currently a question active in the QuizRoom, give that to the user */
        // if (this_quizroom.is_question_active) {
        //     io.to(socket.id).emit("join room success", room_id, true, this_quizroom.curr_question.prompt);
        // } else {
        //     io.to(socket.id).emit("join room success", room_id, false, "");
        // }

        io.to(socket.id).emit("join room success", room_id);

        if (this_quizroom.is_question_active) {
            io.to(socket.id).emit("push question", this_quizroom.curr_question.prompt, this_quizroom.curr_question.end_time);
        }

        /* Inform the room that a new player joined; used by host to maintain the player list */
        io.to(this_quizroom.id).emit("player join", socket.id, nickname);

    });

    /* When the host creates a new question, push that question to every player */
    socket.on("new question", function (prompt: string, answer: string, time_limit_s: number) {
        if (this_quizroom == null) {
            io.to(socket.id).emit("new question fail", "room does not exist");
            return;
        }

        if (socket != this_quizroom.host.socket) {
            io.to(socket.id).emit("new question fail", "you are not the host!");
            return;
        }

        if (this_quizroom.is_question_active) {
            io.to(socket.id).emit("new question fail", "there is already a question active!");
            return;
        }

        let question: Question = new Question(QuestionType.free_response, prompt, answer);

        /* For some reason, whenever a socket emits NaN, it gets sent as null...? */
        if (!Number.isNaN(time_limit_s) && time_limit_s != null) {
            question.set_time_limit(time_limit_s * 1000);
            setTimeout(function () {
                close_question(this_quizroom, io);
            }, time_limit_s * 1000);

        }

        this_quizroom.push_question(question);

        io.to(socket.id).emit("new question success", "successfully pushed question");

        /* If no time limit was specified, the question's end_time is set to NaN. But socket.io sends NaN as null, so in quiz.js, we check if end_time == null to tell if the question is timed. */
        io.to(this_quizroom.id).emit("push question", question.prompt, question.end_time);
    });

    /* When the host closes the question, we grade every player's response and tell them if they are right or wrong */
    socket.on("close question", function () {
        if (this_quizroom == null) {
            io.to(socket.id).emit("close question fail", "you aren't the host of any room!");
            return;
        }

        if (socket != this_quizroom.host.socket) {
            io.to(socket.id).emit("close question fail", "you are not the host!");
            return;
        }

        if (!this_quizroom.is_question_active) {
            io.to(socket.id).emit("close question fail", "There is no question active!");
            return;
        }

        close_question(this_quizroom, io);
    });

    /* We store every player's answer in the Player's "answers" table. The index is the number of the current question. */
    socket.on("submit answer", function (provided_answer) {
        if (this_player == null) {
            io.to(socket.id).emit("submit answer fail", "you don't exist on the server! something is terribly wrong");
            return;
        }

        if (this_quizroom == null) {
            io.to(socket.id).emit("submit answer fail", "room does not exist");
            return;
        }

        if (!this_quizroom.is_question_active) {
            io.to(socket.id).emit("submit answer fail", "there is no question to answer");
            return;
        }

        console.log(`${socket.id} submitted answer ${provided_answer}`);

        /* We do not use push here. If player submits more than one answer or if player joined midway through quiz, it still goes to the same index in their array of answers. */
        this_player.answers[this_quizroom.num_questions - 1] = provided_answer;

        io.to(socket.id).emit("submit answer success", "successfully submitted answer");
    });

    /* If the host leaves, delete the entire QuizRoom. If a player leaves, only delete that player's entry the QuizRoom's "Players" table. */
    socket.on("disconnect", function () {
        --num_connections;
        console.log(`disconnect ${socket.id} (total connections ${num_connections})`);
        console.log(`${this_quizroom?.id} ${this_quizroom?.host.socket.id} ${socket.id}`);

        if (this_quizroom == null) {
            return;
        }

        if (this_quizroom.host.socket.id == socket.id) {
            console.log(`Should be deleting room  ${this_quizroom.id}`);
            delete quizrooms[this_quizroom.id];
        } else if (this_player != null) {
            console.log(`Should be deleting player ${this_player.nickname} (socket ID ${socket.id})`);
            assert(this_player.socket.id == socket.id, `${socket.id} is disconnecting, but this_player.socket.id = ${this_player.socket.id}`)
            this_quizroom.delete_player(this_player);
            io.to(this_quizroom.id).emit("player leave", socket.id);
        }

    });
});
