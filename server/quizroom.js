"use strict";
exports.__esModule = true;
exports.QuizRoom = void 0;
var QuizRoom = /** @class */ (function () {
    function QuizRoom(id, host) {
        this.id = id;
        this.host = host;
        this.players = [];
        this.question = "";
        this.answer = "";
        console.log("Created new room with id " + id + " and host socket id " + host.socket.id);
    }
    return QuizRoom;
}());
exports.QuizRoom = QuizRoom;
