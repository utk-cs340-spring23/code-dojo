import { Socket } from "socket.io";

class Host {
    nickname: String;
    socket: Socket;

    constructor(nickname: String, socket: Socket) {
        this.nickname = nickname;
        this.socket = socket;
    }
}

export { Host };
