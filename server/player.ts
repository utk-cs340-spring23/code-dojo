import { Socket } from "socket.io";

class Player {
    nickname: string;
    socket: Socket;
    num_right: number;
    num_wrong: number;

    constructor(nickname: string, socket: Socket) {
        this.nickname = nickname;
        this.socket = socket;
    }
}

export { Player };
