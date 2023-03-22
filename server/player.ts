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
        this.answers = [];
    }
}

export { Player };
