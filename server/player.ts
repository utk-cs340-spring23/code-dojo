import { Socket } from "socket.io";

class Player {
    nickname: string;
    socket: Socket;
    num_right: number;
    num_wrong: number;
    answers: string[];
    is_correct: boolean[];

    constructor(nickname: string, socket: Socket) {
        this.nickname = nickname;
        this.socket = socket;
        this.num_right = 0;
        this.num_wrong = 0;
        this.answers = [];
        this.is_correct = [];
    }

    get curr_answer(): string | undefined {
        return this.answers.at(-1);
    }

    get is_curr_correct(): boolean | undefined {
        return this.is_correct.at(-1);
    }
}

export { Player };
