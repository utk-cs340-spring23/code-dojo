import { Player } from "./player";
import { Host } from "./host";

class QuizRoom {
    id: string;
    host: Host;
    players: Player[];          // Keyed by Socket ID
    questions: string[];        // Array of all questions
    answers: string[];          // Array of all answers
    is_question_active: boolean; // Is there currently an open question?

    constructor(id: string, host: Host) {
        this.id = id;
        this.host = host;
        this.players = [];
        this.questions = [];
        this.answers = [];
        this.is_question_active = false;

        console.log(`Created new room with id ${id} and host socket id ${host.socket.id}`);
    }
}

export { QuizRoom };
