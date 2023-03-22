import { Host } from "./host";
import { Player } from "./player";
import { QuestionType, Question } from "./question";
import { strict as assert } from 'node:assert';

class QuizRoom {
    #id: string;                    // Room id; also used for socket.io rooms
    #host: Host;                    // Person that controls the room
    #num_players: number;           // How many players currently in QuizRoom
    #players: Player[];             // Keyed by Socket ID
    #questions: Question[];         // Array of all questions
    #is_question_active: boolean;   // Is there currently a question active?

    constructor(id: string, host: Host) {
        this.#id = id;
        this.#host = host;
        this.#num_players = 0;
        this.#players = [];
        this.#questions = [];
        this.#is_question_active = false;

        console.log(`Created new room with id ${id} and host socket id ${host.socket.id}`);
    }

    get id(): string {
        return this.#id;
    }

    get host(): Host {
        return this.#host;
    }

    get num_players(): number {
        return this.#num_players;
    }

    get players(): Player[] {
        return this.#players;
    }

    get questions(): Question[] {
        return this.#questions;
    }

    get is_question_active(): boolean {
        return this.#is_question_active;
    }

    get curr_question(): Question | undefined {
        return this.#questions.at(-1);
    }

    get num_questions(): number {
        return this.#questions.length;
    }

    add_player(player: Player): boolean {
        // assert(this.players[player.socket.id] == null, `Trying to add player ${player.nickname} (${player.socket.id}) but that socket id already exists in the QuizRoom's players table`);

        if (this.#players[player.socket.id] != undefined) {
            return false;
        }

        this.players[player.socket.id] = player;
        ++this.#num_players;

        return true;
    }

    delete_player(player: Player): boolean {
        return this.delete_player_by_socket_id(player.socket.id);
    }

    delete_player_by_socket_id(socket_id: string): boolean {
        if (this.#players[socket_id] == undefined) {
            return false;
        }

        delete this.players[socket_id];
        --this.#num_players;

        return true;
    }

    push_question(question: Question): boolean {
        if (this.#is_question_active) {
            return false;
        }

        this.questions.push(question);
        this.#is_question_active = true;
        return true;
    }

    close_question(): boolean {
        if (!this.#is_question_active) {
            return false;
        }

        for (const [key, player] of Object.entries(this.players)) {
            assert(key == player.socket.id, "A player's socket id and their key don't match!");

            if (player.answers.at(-1) == this.#questions.at(-1)?.answer) {
                assert(player.answers.at(-1) == player.answers[this.num_questions - 1], "Player's answers array is malformed!");
                player.is_correct.push(true);
                this.curr_question.increment_num_right();
            } else {
                player.is_correct.push(false);
                this.curr_question.increment_num_wrong();
            }
        }
        this.#is_question_active = false;
        return true;
    }
}

export { QuizRoom };
