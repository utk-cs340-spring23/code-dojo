enum QuestionType {
    free_response
}

class Question {
    #type: QuestionType;
    #prompt: string;
    #answer: string;
    #start_time: number;        // Unix time (ms) when question was created
    #is_timed: boolean;         // Is the question timed?
    #time_limit: number;        // Amount of time (ms) to complete the question
    #end_time: number;          // Unix time (ms) when question ends
    #num_right: number;         // How many players got the question right
    #num_wrong: number;         // How many players got the question wrong

    /**
     * Instantiates a new Question object; untimed by default
     * @param type QuestionType
     * @param prompt String of the actual question
     * @param answer String of the answer
     */
    constructor(type: QuestionType, prompt: string, answer: string) {
        this.#type = type;
        this.#prompt = prompt;
        this.#answer = answer;
        this.#num_right = 0;
        this.#num_wrong = 0;
        this.#start_time = Date.now();
        this.#is_timed = false;
        this.#time_limit = NaN;
        this.#end_time = NaN;
    }

    /**
     * Sets the time limit info for the question
     * @param ms Amount of time (in milliseconds) to complete the question
     */
    set_time_limit(ms: number): void {
        this.#is_timed = true;
        this.#time_limit = ms;
        this.#end_time = this.#start_time + this.#time_limit;
    }

    get type(): QuestionType {
        return this.#type;
    }

    get prompt(): string {
        return this.#prompt;
    }

    get answer(): string {
        return this.#answer;
    }

    get start_time(): number {
        return this.#start_time;
    }

    get is_timed(): boolean {
        return this.#is_timed;
    }

    get time_limit(): number {
        return this.#time_limit;
    }

    get end_time(): number {
        return this.#end_time;
    }

    get num_right(): number {
        return this.#num_right;
    }

    get num_wrong(): number {
        return this.#num_wrong;
    }

    /**
     * Increases #num_right by 1
     */
    increment_num_right(): void {
        ++this.#num_right;
    }

    /**
     * Increases #num_wrong by 1
     */
    increment_num_wrong(): void {
        ++this.#num_wrong;
    }

}

export { QuestionType };
export { Question };
