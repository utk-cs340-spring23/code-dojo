import fs from "fs";
import { exec } from "child_process";

const code_time_limit: number = 2500; // in milliseconds

enum RunResult {
    unknown,
    compile_fail,
    run_fail,
    run_success,
    run_timeout
};

class RunOutput {
    public stdout: string;
    public stderr: string;
    public result: RunResult;

    constructor() {
        this.stdout = "";
        this.stderr = "";
        this.result = RunResult.unknown;
    }
};

async function run_c(code, name, output): Promise<void> {
    const file_name = `tmp/${name}.c`;
    const executable_name = `tmp/${name}.out`;

    fs.writeFileSync(file_name, code);

    try {
        await new Promise((resolve, reject) => {
            exec(`gcc ${file_name} -o ${executable_name}`, (err, stdout, stderr) => {
                if (err) {
                    output.stdout = stdout;
                    output.stderr = stderr;
                    output.result = RunResult.compile_fail;
                    reject(stderr);
                } else {
                    resolve(output);
                }

                exec(`rm ${file_name}`);
            });
        });

        await new Promise((resolve, reject) => {
            exec(`./${executable_name}`, { timeout: code_time_limit }, (err, stdout, stderr) => {
                if (err) {
                    if (err.killed && err.signal === "SIGTERM") {
                        output.result = RunResult.run_timeout;
                    } else {
                        output.stdout = stdout;
                        output.stderr = stderr;
                        output.result = RunResult.run_fail;
                    }
                    reject(stderr);
                } else {
                    output.stdout = stdout;
                    output.stderr = stderr;
                    output.result = RunResult.run_success;
                    resolve(output);
                }

                exec(`rm ${executable_name}`);
            });
        });

    } catch (error) {
        console.error("Error during compilation or execution:", error);
    }
}

export { RunResult };
export { RunOutput };
export { run_c };
