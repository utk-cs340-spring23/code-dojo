import { Socket } from "socket.io";
import { RunOutput } from "./runcode.js"

class Player {
    private _nickname: string;
    private _socket: Socket;
    private _num_right: number;
    private _num_wrong: number;
    private _answers: any[];
    private _is_correct: boolean[];     // e.g. _is_correct[3] is whether the player got question #4 correct
    public curr_output: RunOutput;

    constructor(nickname: string, socket: Socket) {
        this._nickname = nickname;
        this._socket = socket;
        this._num_right = 0;
        this._num_wrong = 0;
        this._answers = [];
        this._is_correct = [];
        this.curr_output = new RunOutput;
    }

    public get nickname(): string {
        return this._nickname;
    }

    public get socket(): Socket {
        return this._socket;
    }

    public get num_right(): number {
        let num_right: number = 0;

        for (const [i, correct] of Object.entries(this._is_correct)) {
            if (correct) {
                ++num_right;
            }
        }

        return num_right;
    }

    public get num_wrong(): number {
        let num_wrong: number = 0;

        for (const [i, correct] of Object.entries(this._is_correct)) {
            if (!correct) {
                ++num_wrong;
            }
        }

        return num_wrong;
    }

    public get answers(): any[] {
        return this._answers;
    }

    public get is_correct(): boolean[] {
        return this._is_correct;
    }

    public get most_recent_answer(): any | undefined {
        return this._answers.at(-1);
    }


    // public push_correct(): void {
    //     this._is_correct.push(true);
    //     ++this._num_right;
    // }

    // public push_incorrect(): void {
    //     this._is_correct.push(false);
    //     ++this._num_wrong;
    // }

    public set_correct(index: number): void {
        this._is_correct[index] = true;
    }

    public set_incorrect(index: number): void {
        this._is_correct[index] = false;
    }
}

export { Player };
