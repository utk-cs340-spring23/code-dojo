import { Host } from "./host";
import { Player } from "./player";
import { QuestionType, Question } from "./question";
import { strict as assert } from 'node:assert';

class QuizRoom {
    private _id: string;                                // Unique room id; also used for socket.io rooms
    private _host: Host;                                // Person that controls the room
    private _num_players: number;                       // How many players currently in QuizRoom
    private _players: Player[];                         // Table of players, keyed by socket ID
    private _questions: Question[];                     // Array of all questions
    public timeout_id: ReturnType<typeof setTimeout>    // Timeout ID for timed questions

    /**
     * Instantiates a new QuizRoom object
     * @param id Used for keying in the "QuizRooms" table in server.ts, and used as the room ID in Socket.IO
     * @param host Controls question pushing and closing
     */
    constructor(id: string, host: Host) {
        this._id = id;
        this._host = host;
        this._num_players = 0;
        this._players = [];
        this._questions = [];
        this.timeout_id = null;

        console.log(`Created new room with id ${id} and host socket id ${host.socket.id}`);
    }

    public get id(): string {
        return this._id;
    }

    public get host(): Host {
        return this._host;
    }

    public get num_players(): number {
        return this._num_players;
    }

    public get players(): Player[] {
        return this._players;
    }

    public get questions(): Question[] {
        return this._questions;
    }

    public get curr_question(): Question | undefined {
        return this._questions.at(-1);
    }

    public get num_questions(): number {
        return this._questions.length;
    }

    public get curr_question_index(): number {
        return this._questions.length - 1;
    }

    public get nicknames(): string[] {
        let nicknames: string[] = [];

        for (const [key, player] of Object.entries(this._players)) {
            nicknames.push(player.nickname);
        }

        return nicknames;
    }

    /**
     * Adds specified Player object to the "players" table, keyed by their socket ID
     * @param player Player to add
     * @returns True if successful, false otherwise
     */
    public add_player(player: Player): boolean {
        if (this._players[player.socket.id] != null) {
            return false;
        }

        /* Check for unique nickname */
        /* TODO: consider instead storing a table keyed by nicknames for O(1) checking for unique nicknames */
        for (const [socket_id, other_player] of Object.entries(this._players)) {
            assert(socket_id == other_player.socket.id, "A player's socket id and their key don't match!");

            if (player.nickname == other_player.nickname) {
                return false;
            }
        }

        this._players[player.socket.id] = player;
        ++this._num_players;

        return true;
    }

    /**
     * @param player Player to delete from "players" table
     * @returns True if successful, false otherwise
     */
    public delete_player(player: Player): boolean {
        return this.delete_player_by_socket_id(player.socket.id);
        --this._num_players;
    }

    /**
     * @param socket_id Deletes specified socket ID from the "players" table
     * @returns True if successful, false otherwise
     */
    public delete_player_by_socket_id(socket_id: string): boolean {
        if (this._players[socket_id] == null) {
            return false;
        }

        delete this._players[socket_id];
        --this._num_players;

        return true;
    }

    /**
     * @param question Question to push to the "questions" table
     */
    public push_question(question: Question): void {
        this.questions.push(question);
    }

    /**
     * @param player Player to get answer from
     * @returns Player's answer to the current question
     */
    public get_player_curr_answer(player: Player): string | undefined {
        return player.answers[this.curr_question_index];
    }

    public set_player_curr_answer(player: Player, answer: any): void {
        player.answers[this.curr_question_index] = answer;
        console.log(`setting player.answers[${this.curr_question_index}] = ${answer}`);
    }

    /**
     * Closes the current question, grading every players' answer
     * @returns True if successful, false otherwise
     */
    public async close_question(): Promise<boolean> {
        if (!this.curr_question?.is_active) {
            return false;
        }

        for (const [socket_id, player] of Object.entries(this._players)) {
            assert(socket_id == player.socket.id, "A player's socket id and their key don't match!");

            console.log(`checking if ${this.curr_question.answer} = ${this.get_player_curr_answer(player)}`);

            const grade: number = await this.curr_question.check_answer(this.get_player_curr_answer(player), player);

            if (grade > 0) {
                player.set_correct(this.curr_question_index);
                this.curr_question.increment_num_right();
            } else {
                player.set_incorrect(this.curr_question_index);
                this.curr_question.increment_num_wrong();
            }
        }

        this.curr_question.close();
        return true;
    }
}

export { QuizRoom };
