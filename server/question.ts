enum QuestionType {
    free_response,
    multiple_choice
}

class Question {
    protected _type: QuestionType;
    protected _prompt: string;            // The actual text of the question
    protected _answer: string;            // The correct answer
    protected _start_time: number;        // Unix time (ms) when question was created
    protected _is_timed: boolean;         // Is the question timed?
    protected _time_limit: number;        // Amount of time (ms) to complete the question
    protected _end_time: number;          // Unix time (ms) when question closes
    protected _num_right: number;         // How many players got the question right
    protected _num_wrong: number;         // How many players got the question wrong
    protected _is_active: boolean;        // Is the question currently active in the QuizRoom?

    /**
     * Instantiates a new Question object; untimed by default
     * @param type QuestionType
     * @param prompt String of the actual question
     * @param answer String of the answer
     */
    constructor(prompt: string, answer: string, is_timed: boolean, time_limit: number) {
        this._type = QuestionType.free_response;
        this._prompt = prompt;
        this._answer = answer;
        this._num_right = 0;
        this._num_wrong = 0;
        this._start_time = Date.now();
        this._is_timed = is_timed;
        this._time_limit = time_limit;
        this._end_time = this.start_time + time_limit;
        this._is_active = true;
    }

    public get type(): QuestionType {
        return this._type;
    }

    public get prompt(): string {
        return this._prompt;
    }

    public get answer(): string {
        return this._answer;
    }

    public get start_time(): number {
        return this._start_time;
    }

    public get is_timed(): boolean {
        return this._is_timed;
    }

    public get time_limit(): number {
        return this._time_limit;
    }

    public get end_time(): number {
        return this._end_time;
    }

    public get num_right(): number {
        return this._num_right;
    }

    public get num_wrong(): number {
        return this._num_wrong;
    }

    public get is_active(): boolean {
        return this._is_active;
    }

    /**
     * Returns whether a provided answer is correct
     * @param provided_answer String of the provided answer
     * @returns True if correct, false otherwise
     */
    public check_answer(provided_answer: string): boolean {
        return provided_answer == this._answer;
    }

    public increment_num_right(): void {
        ++this._num_right;
    }

    public increment_num_wrong(): void {
        ++this._num_wrong;
    }

    public close(): void {
        this._is_active = false;
    }

}

class MCQuestion extends Question {
    private _answer_choices: string[];      // Answer choices for multiple choice questions
    private _correct_answer_index: number; // Index of correct answer

    constructor(prompt: string, answer_choices: string[], correct_answer_index: number, is_timed: boolean, time_limit: number) {
        super(prompt, answer_choices[correct_answer_index], is_timed, time_limit);
        this._type = QuestionType.multiple_choice;
        this._num_right = 0;
        this._num_wrong = 0;
        this._start_time = Date.now();
        this._end_time = this.start_time + time_limit;
        this._is_active = true;

        this._answer_choices = answer_choices;
        this._correct_answer_index = correct_answer_index;
    }

    public get_answer_choices(): string[] {
        return this._answer_choices;
    }

    public get_correct_answer_index(): number {
        return this._correct_answer_index;
    }

    /**
     * Returns whether a provided answer choice is correct
     * @param provided_answer_index String of answer choice (e.g. "0", "1", ...)
     * @returns True if correct, false otherwise
     */
    public override check_answer(provided_answer_index: string): boolean {
        return parseInt(provided_answer_index) === this._correct_answer_index;
    }
}

export { QuestionType };
export { Question };
export { MCQuestion };
