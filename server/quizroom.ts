import { Player } from "./player";

class QuizRoom {
    id: string;
    host: Player;
    players: Player[];
    question: string;
    answer: string;

    constructor(id: string, host: Player) {
        this.id = id;
        this.host = host;
        this.players = [];
        this.question = "";
        this.answer = "";

        console.log("Created new room with id " + id + " and host socket id " + host.socket.id);
    }
}

export { QuizRoom };
