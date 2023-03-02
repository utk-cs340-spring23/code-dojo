class QuizRoom {
    constructor(id, host_socket) {
        this.id = id;
        this.host_socket = host_socket;
        this.player_sockets = [];
        this.question = null;
        this.answer = null;

        console.log("Created new room with id " + id + " and host socket id " + host_socket.id);
    }
}

module.exports = { QuizRoom };
