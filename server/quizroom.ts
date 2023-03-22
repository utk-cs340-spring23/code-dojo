import { Player } from "./player";
import { Host } from "./host";
import { strict as assert } from 'node:assert';

class QuizRoom {
    id: string;
    host: Host;
    num_players: number;
    players: Player[];              // Keyed by Socket ID
    questions: string[];            // Array of all questions
    answers: string[];              // Array of all answers
    is_question_active: boolean;    // Is there currently an open question?

    constructor(id: string, host: Host) {
        this.id = id;
        this.host = host;
        this.players = [];
        this.questions = [];
        this.answers = [];
        this.is_question_active = false;

        console.log(`Created new room with id ${id} and host socket id ${host.socket.id}`);
    }

    get curr_question(): string | undefined {
        return this.questions.at(-1);
    }

    get num_questions(): number {
        return this.questions.length;
    }

    add_player(player: Player): void {
        assert(this.players[player.socket.id] == null, `Trying to add player ${player.nickname} (${player.socket.id}) but that socket id already exists in the QuizRoom's players table`);
        this.players[player.socket.id] = player;
    }

    delete_player(player: Player): void {
        delete this.players[player.socket.id];
    }

    delete_player_by_socket_id(socket_id: string): void {
        delete this.players[socket_id];
    }

    push_question(question: string, answer: string): boolean {
        if (this.is_question_active) {
            return false;
        }

        this.questions.push(question);
        this.answers.push(answer);
        this.is_question_active = true;
        return true;
    }

    close_question(): boolean {
        if (!this.is_question_active) {
            return false;
        }

        for (const [key, player] of Object.entries(this.players)) {
            assert(key == player.socket.id, "A player's socket id and their key don't match!");

            if (player.answers.at(-1) == this.answers.at(-1)) {
                assert(player.answers.at(-1) == player.answers[this.answers.length - 1], "Player's answers array is malformed!");
                player.is_correct.push(true);
            } else {
                player.is_correct.push(false);
            }
        }
        this.is_question_active = false;
        return true;
    }
}

export { QuizRoom };
