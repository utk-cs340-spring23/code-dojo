/*----------------------------------------------------------------------------*/
/* Imports                                                                    */
/*----------------------------------------------------------------------------*/
import { strict as assert } from "node:assert";
import express from "express";
import http from "http";
import { MongoClient } from "mongodb";
import { Server as SocketIOServer, Socket } from "socket.io";

import { Host } from "./host.js";
import { Player } from "./player.js";
import { QuestionType, CodeLanguage, Question, FRQuestion, MCQuestion, CodeQuestion, string_to_codelanguage, codelanguage_to_string } from "./question.js";
import { QuizRoom } from "./quizroom.js";
import { RunResult, RunOutput, run_c } from "./runcode.js";

/*----------------------------------------------------------------------------*/
/* Server                                                                     */
/*----------------------------------------------------------------------------*/
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = parseInt(process.env.PORT) || 56946;
const public_path: string = new URL("../public/", import.meta.url).pathname;

app.use(express.static(public_path));

server.listen(port, function () {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

let num_connections: number = 0;
let quizrooms: QuizRoom[] = [];     // Array of all active QuizRooms, keyed by their string room ID

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/

/**
 * Calls close_question() method on the specified QuizRoom, and communicates question feedback to all players and host
 * @param io The current SocketIO Server
 * @param this_quizroom The quizroom to call close_question() on
 * @return True if successful, false otherwise
 */
async function close_question(io: SocketIOServer, quizroom: QuizRoom): Promise<boolean> {
    let grade_question_success: boolean = await quizroom.close_question();
    if (!grade_question_success) {
        return false;
    }

    let results = new Object();

    for (const [key, player] of Object.entries(quizroom.players)) {
        assert(key == player.socket.id, "A player's socket id and their key don't match!");

        let player_answer: any = quizroom.get_player_curr_answer(player);

        let answer_string: string;

        switch (quizroom.curr_question.type) {
            case QuestionType.free_response:
                answer_string = player_answer;
                break;
            case QuestionType.multiple_choice:
                answer_string = (quizroom.curr_question as MCQuestion).answer_choices[player_answer];
                break;
            case QuestionType.code:
                answer_string = player.curr_output.stdout;
                break;
        }

        console.log(answer_string);

        if (results[answer_string] == null) {
            results[answer_string] = 1;
        } else {
            ++results[answer_string];
        }

        if (player.is_correct[quizroom.curr_question_index]) {
            io.to(player.socket.id).emit("answer correct", answer_string, quizroom.curr_question.answer, player.num_right, player.num_wrong);
            io.to(quizroom.host.socket.id).emit("player answer correct", player.socket.id);
        } else {
            io.to(player.socket.id).emit("answer incorrect", answer_string, quizroom.curr_question.answer, player.num_right, player.num_wrong);
            io.to(quizroom.host.socket.id).emit("player answer incorrect", player.socket.id);
        }
    }

    console.log(results);

    io.to(quizroom.id).emit("close question success", "Successfully closed and graded questions");
    io.to(`${quizroom.id} spectators`).emit("correct answer", quizroom.curr_question.answer);
    io.to(`${quizroom.id} spectators`).emit("question results", results, quizroom.curr_question.num_right);

    return true;
}

function on_new_question_check(io: SocketIOServer, quizroom: QuizRoom, socket: Socket): boolean {
    if (quizroom == null) {
        io.to(socket.id).emit("new question fail", "room does not exist");
        return false;
    }

    if (socket != quizroom.host.socket) {
        io.to(socket.id).emit("new question fail", "you are not the host!");
        return false;
    }

    if (quizroom.curr_question?.is_active) {
        io.to(socket.id).emit("new question fail", "there is already a question active!");
        return false;
    }

    return true;
}

/*----------------------------------------------------------------------------*/
/* Socket IO                                                                  */
/* Handles all user connections                                               */
/*----------------------------------------------------------------------------*/
const io: SocketIOServer = new SocketIOServer(server);

io.on("connection", function (socket: Socket) {
    ++num_connections;

    /* The following variables are specific to each "socket" */
    let this_quizroom: QuizRoom = null;
    let this_player: Player = null;
    let is_spectator: boolean = false;

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

    /* Join room only applies to players. This sets the player socket's room and sets the "this_quizroom" and "this_player" variables. */
    socket.on("join room", function (room_id: string, nickname: string) {
        /* If the user tries to join the room they are already in */
        if (room_id == this_quizroom?.id) {
            io.to(socket.id).emit("join room fail", `you are already in room ${room_id}`);
            return;
        }

        /* If the user tries to join a non-existent room */
        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("join room fail", `room ${room_id} does not exist`);
            console.log("no room exist");
            return;
        }

        /* Join the socket room */
        this_quizroom = quizrooms[room_id];

        assert(this_quizroom != null, `Player ${nickname} (id ${socket.id}) just joined room ${room_id} but the room does not exist on the server!`);

        /* Add player to the QuizRoom "players" table */
        let add_player_success: boolean = this_quizroom.add_player(new Player(nickname, socket));

        if (!add_player_success) {
            io.to(socket.id).emit("join room fail", `duplicate nickname`);
            this_quizroom = null;
            return;
        }

        socket.join(room_id);
        this_player = this_quizroom.players[socket.id];

        assert(this_quizroom.id == room_id, "Join Room: this_quizroom.id does not match room_id!");

        io.to(socket.id).emit("join room success", `Successfully joined room "${room_id}" as ${this_player.nickname}! Waiting for host...`);

        /* If there's a question active when the user joined, push it to the user */
        if (this_quizroom.curr_question?.is_active) {
            switch (this_quizroom.curr_question.type) {
                case QuestionType.free_response:
                    io.to(socket.id).emit("push frquestion", this_quizroom.curr_question.prompt, this_quizroom.curr_question.end_time);
                    break;
                case QuestionType.multiple_choice:
                    io.to(this_quizroom.id).emit("push mcquestion", this_quizroom.curr_question.prompt, (this_quizroom.curr_question as MCQuestion).answer_choices, this_quizroom.curr_question.end_time);
                    break;
                case QuestionType.code:
                    io.to(this_quizroom.id).emit("push codequestion", this_quizroom.curr_question.prompt, (this_quizroom.curr_question as CodeQuestion).template, codelanguage_to_string((this_quizroom.curr_question as CodeQuestion).language), this_quizroom.curr_question.end_time);
                    break;
            }
        }

        /* Inform the room that a new player joined; used by host to maintain the player list */
        io.to(this_quizroom.id).emit("player join", socket.id, nickname);

        io.to(`${this_quizroom.id} spectators`).emit("num players", this_quizroom.num_players);
    });

    socket.on("spectate room", function (room_id: string) {
        if (quizrooms[room_id] == null) {
            io.to(socket.id).emit("spectate room fail", `room ${room_id} does not exist`);
            return;
        }

        console.log(`${socket.id} is a spectator!`);
        is_spectator = true;
        this_quizroom = quizrooms[room_id];
        socket.join(room_id);
        socket.join(`${room_id} spectators`);

        io.to(socket.id).emit("spectate room success", "successfully spectating room", this_quizroom.num_players, this_quizroom.nicknames);

    });

    socket.on("new frquestion", function (prompt: string, answers: string[], time_limit_s: number) {
        if (!on_new_question_check(io, this_quizroom, socket)) {
            return;
        }

        let question: Question = new FRQuestion(prompt, answers, time_limit_s * 1000);
        this_quizroom.push_question(question);

        let is_timed: boolean = time_limit_s > 0;

        io.to(this_quizroom.id).emit("push frquestion", question.prompt, is_timed ? question.end_time : null);
        io.to(this_quizroom.host.socket.id).emit("new question success", "successfully pushed question", is_timed ? question.end_time : null);

        /* Close question when time expires */
        if (is_timed) {
            this_quizroom.timeout_id = setTimeout(function () {
                close_question(io, this_quizroom);
            }, time_limit_s * 1000);
        }
    });

    socket.on("new mcquestion", function (prompt: string, answer_choices: string[], correct_answer_indices: number[], time_limit_s: number) {
        if (!on_new_question_check(io, this_quizroom, socket)) {
            return;
        }

        let question: MCQuestion = new MCQuestion(prompt, answer_choices, correct_answer_indices, time_limit_s * 1000);
        console.log(prompt);
        console.log(answer_choices);
        console.log(correct_answer_indices);
        this_quizroom.push_question(question);

        let is_timed: boolean = time_limit_s > 0;

        io.to(this_quizroom.id).emit("push mcquestion", question.prompt, question.answer_choices, is_timed ? question.end_time : null);
        io.to(this_quizroom.host.socket.id).emit("new question success", "successfully pushed question", is_timed ? question.end_time : null);

        /* Close question when time expires */
        if (is_timed) {
            this_quizroom.timeout_id = setTimeout(function () {
                close_question(io, this_quizroom);
            }, time_limit_s * 1000);
        }
    });

    socket.on("new codequestion", function (prompt: string, template: string, answer: string, provided_language: string, time_limit_s: number) {
        if (!on_new_question_check(io, this_quizroom, socket)) {
            return;
        }

        const code_language: CodeLanguage = string_to_codelanguage(provided_language);

        if (code_language == null) {
            io.to(socket.id).emit("new question fail", "no such language exists");
        }

        let question: Question = new CodeQuestion(prompt, template, answer, code_language, time_limit_s * 1000);
        this_quizroom.push_question(question);

        let is_timed: boolean = time_limit_s > 0;

        io.to(this_quizroom.id).emit("push codequestion", question.prompt, template, provided_language, is_timed ? question.end_time : null);
        io.to(this_quizroom.host.socket.id).emit("new question success", "successfully pushed question", is_timed ? question.end_time : null);

        /* Close question when time expires */
        if (is_timed) {
            this_quizroom.timeout_id = setTimeout(function () {
                close_question(io, this_quizroom);
            }, time_limit_s * 1000);
        }
    });

    socket.on("compile and run", async function (code: string, provided_language: string) {
        let output: RunOutput = new RunOutput();

        switch (provided_language) {
            case "C":
                await run_c(code, socket.id, output);
                break;
            default:
                io.to(socket.id).emit("compile fail", `Language ${provided_language} not supported!`);
                break;
        }

        switch (output.result) {
            case RunResult.compile_fail:
                io.to(socket.id).emit("compile fail", output.stderr);
                break;
            case RunResult.run_fail:
                io.to(socket.id).emit("run fail", output.stderr);
                break;
            case RunResult.run_success:
                io.to(socket.id).emit("run success", output.stdout);
                break;
            case RunResult.run_timeout:
                io.to(socket.id).emit("run timeout");
                break;
            default:
                io.to(socket.id).emit("run fail", "Run never occured? (You should not be seeing this)");
                break;
        }
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

        if (!this_quizroom.curr_question?.is_active) {
            io.to(socket.id).emit("close question fail", "There is no question active!");
            return;
        }

        close_question(io, this_quizroom);
        clearTimeout(this_quizroom.timeout_id);
    });

    /* When a player submits an answer, we store that answer in the player's "answers" table. */
    socket.on("submit answer", function (provided_answer: any) {
        if (this_player == null) {
            io.to(socket.id).emit("submit answer fail", "you don't exist on the server! something is terribly wrong");
            return;
        }

        if (this_quizroom == null) {
            io.to(socket.id).emit("submit answer fail", "you are not in a room");
            return;
        }

        if (!this_quizroom.curr_question?.is_active) {
            io.to(socket.id).emit("submit answer fail", "there is no question to answer");
            return;
        }

        console.log(`${socket.id} submitted answer ${provided_answer}`);

        console.log(this_quizroom.get_player_curr_answer(this_player));

        if (this_quizroom.get_player_curr_answer(this_player) == undefined) {
            this_quizroom.curr_question.increment_num_answered();
            io.to(`${this_quizroom.id} spectators`).emit("new answer", this_quizroom.curr_question.num_answered);
        }

        /* We do not simply "push" the answer onto the answers array. We need to account for the possibilty that the player may submit more than one answer and/or the player may join midway through quiz. */
        this_quizroom.set_player_curr_answer(this_player, provided_answer);

        if (this_quizroom.curr_question.type == QuestionType.multiple_choice) {
            io.to(socket.id).emit("submit answer success", `successfully submitted answer "${(this_quizroom.curr_question as MCQuestion).answer_choices[provided_answer]}"`);
        } else {
            io.to(socket.id).emit("submit answer success", `successfully submitted answer "${provided_answer}"`);
        }

        io.to(this_quizroom.host.socket.id).emit("player submit answer", socket.id, provided_answer);
    });

    /* If the host leaves, delete the QuizRoom. If a player leaves, only delete that player's entry the QuizRoom's "Players" table. */
    socket.on("disconnect", function () {
        --num_connections;
        console.log(`disconnect ${socket.id} (total connections ${num_connections})`);
        console.log(`${this_quizroom?.id} ${this_quizroom?.host.socket.id} ${socket.id}`);

        if (this_quizroom == null) {
            return;
        }

        if (this_quizroom.host.socket.id == socket.id) {
            console.log(`Should be deleting room  ${this_quizroom.id}`);
            io.to(this_quizroom.id).emit("close session");
            delete quizrooms[this_quizroom.id];
        } else if (this_player != null) {
            console.log(`Should be deleting player ${this_player.nickname} (socket ID ${socket.id})`);
            assert(this_player.socket.id == socket.id, `${socket.id} is disconnecting, but this_player.socket.id = ${this_player.socket.id}`)
            this_quizroom.delete_player(this_player);
            io.to(this_quizroom.id).emit("player leave", socket.id, this_player.nickname);
            io.to(`${this_quizroom.id} spectators`).emit("num players", this_quizroom.num_players);
        }
    });
});
