import { Player } from "./player";

class QuizRoom {
    id: string;
    host: Player;
    players: Player[];  // Keyed by Socket ID
    question: string;
    answer: string;
    num_questions: number;

    constructor(id: string, host: Player) {
        this.id = id;
        this.host = host;
        this.players = [];
        this.question = "";
        this.answer = "";
        this.num_questions = 0;

        console.log("Created new room with id " + id + " and host socket id " + host.socket.id);
    }
}

export { QuizRoom };
