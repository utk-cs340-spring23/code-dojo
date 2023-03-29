import { Socket } from "socket.io";

class Host {
    private _nickname: String;
    private _socket: Socket;

    constructor(nickname: String, socket: Socket) {
        this._nickname = nickname;
        this._socket = socket;
    }

    public get nickname(): String {
        return this._nickname;
    }

    public get socket(): Socket {
        return this._socket;
    }
}

export { Host };
