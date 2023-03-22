import { Player } from "./player";

class QuizRoom {
    id: string;
    players: Player[];  // Keyed by Socket ID
    question: string;
    answer: string;
    num_questions: number;

    constructor(id: string) {
        this.id = id;
        this.players = [];
        this.question = "";
        this.answer = "";
        this.num_questions = 0;

        console.log("Created new room with id " + id + " and host socket id " + host.socket.id);
    }
}

export { QuizRoom };
