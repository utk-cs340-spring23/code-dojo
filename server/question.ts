import { RunResult, RunOutput, run_c } from "./runcode.js";
import { Player } from "./player.js"

enum QuestionType {
    unknown,
    free_response,
    multiple_choice,
    code
};

enum CodeLanguage {
    JavaScript,
    C
};

/**
 * Abstract Class Question
 *
 * @class Question
 */
class Question {
    protected _type: QuestionType;
    protected _prompt: string;            // The text of the question
    protected _answer: string;            // The text of the correct answer
    protected _start_time: number;        // Unix time (ms) when question was created
    protected _is_timed: boolean;         // Is the question timed?
    protected _time_limit: number;        // Amount of time (ms) to complete the question
    protected _end_time: number;          // Unix time (ms) when question closes
    protected _num_right: number;         // How many players got the question right
    protected _num_wrong: number;         // How many players got the question wrong
    protected _is_active: boolean;        // Is the question currently active in the QuizRoom?

    /**
     * Instantiates a new Question object; untimed by default
     * @param prompt String of the actual question
     * @param answer String of the answer
     * @param time_limit Time limit in milliseconds
     */
    constructor(prompt: string, answer: string, time_limit: number) {
        if (this.constructor == Question) {
            throw new Error("Abstract classes cannot be instantiated.");
        }

        this._type = QuestionType.unknown;
        this._prompt = prompt;
        this._answer = answer;
        this._start_time = Date.now();
        this._is_timed = time_limit > 0;
        this._time_limit = time_limit;
        this._end_time = this.start_time + time_limit;
        this._num_right = 0;
        this._num_wrong = 0;
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

    public async check_answer(provided_answer: any, player: Player): Promise<number> {
        throw new Error("Method 'check_answer()' must be implemented");
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

/**
 * Free Response Question
 *
 * @class FRQuestion
 * @extends Question
 */
class FRQuestion extends Question {
    private _answers: string[];

    constructor(prompt: string, answers: string[], time_limit: number) {
        super(prompt, answers[0], time_limit);
        this._type = QuestionType.free_response;
        this._answers = answers;
    }

    public override async check_answer(provided_answer: string, player: Player): Promise<number> {
        for (const [i, answer] of this._answers.entries()) {
            if (provided_answer == answer) {
                return 1;
            }
        }

        return 0;
    }
}

/**
 * Multiple Choice Question
 *
 * @class MCQuestion
 * @extends Question
 */
class MCQuestion extends Question {
    private _answer_choices: string[];          // Answer choices for multiple choice questions
    private _correct_answer_indices: number[];  // Index of correct answer
    private _answer_string: string;

    constructor(prompt: string, answer_choices: string[], correct_answer_indices: number[], time_limit: number) {
        let answer_string: string = "";
        for (let i = 0; i < correct_answer_indices.length; ++i) {
            if (i > 0) {
                answer_string += ", ";
            }

            answer_string += answer_choices[correct_answer_indices[i]];
        }

        super(prompt, answer_string, time_limit);

        this._type = QuestionType.multiple_choice;
        this._answer_choices = answer_choices;
        this._correct_answer_indices = correct_answer_indices;
    }

    public get answer_choices(): string[] {
        return this._answer_choices;
    }

    public get correct_answer_indices(): number[] {
        return this._correct_answer_indices;
    }

    /**
     * Returns whether a provided answer choice is correct
     * @param provided_answer_indices array of answer indices
     * @returns True if correct, false otherwise
     */
    public override async check_answer(provided_answer_indices: number[], player: Player): Promise<number> {
        if (provided_answer_indices == null) {
            return 0;
        }

        let grade: number = 0;

        for (const [i, answer_index] of provided_answer_indices.entries()) {
            if (this.correct_answer_indices.includes(answer_index)) {
                ++grade;
            }
        }

        return grade;
    }
}

class CodeQuestion extends Question {
    // private _test_cases: any[];
    // private _correct_outputs: string[];
    private _template: string;
    private _language: CodeLanguage;

    constructor(prompt: string, template: any, answer: string, language: CodeLanguage, time_limit: number) {
        super(prompt, answer, time_limit);
        this._template = template;
        this._type = QuestionType.code;
        // this._test_cases = test_cases;
        // this._correct_outputs = correct_outputs;
        this._language = language;
    }

    public get template(): string {
        return this._template;
    }

    public get language(): CodeLanguage {
        return this._language;
    }

    public override async check_answer(provided_answer: string, player: Player): Promise<number> {
        if (provided_answer == null || provided_answer == "") {
            return 0;
        }

        let output: RunOutput = new RunOutput();

        switch (this._language) {
            case CodeLanguage.C:
                await run_c(provided_answer, Date.now().toString(), output);
                break;
        }

        console.log("SUBMISSION RESULT:" + output.stdout);
        console.log("ANSWER: " + this._answer);

        player.curr_output = output;

        if (output.result != RunResult.run_success) {
            return 0;
        }

        if (output.stdout != this._answer) {
            return 0;
        }

        return 1;
    }
}

export { QuestionType };
export { CodeLanguage };
export { Question };
export { FRQuestion };
export { MCQuestion };
export { CodeQuestion };
