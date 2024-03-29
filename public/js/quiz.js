// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const nickname_input = document.getElementById("nickname-input");
const answer_input = document.getElementById("answer-input");
const submit_answer_button = document.getElementById("submit-answer-button");
const question_tag = document.getElementById("question");
const question_timer_tag = document.getElementById("question-timer");
const question_feedback_tag = document.getElementById("question-feedback");
const frquestion_form = document.getElementById("frquestion-form");
const mcquestion_form = document.getElementById("mcquestion-form");
const codequestion_form = document.getElementById("codequestion-form");
const run_code_button = document.getElementById("run-code-button");
const output_tag = document.getElementById("output");
const results_score_tag = document.getElementById("results-score");

const score_tag = document.getElementById("score-number");
const ninja = document.getElementById("ninja-slash");

const form_display_style = "block";

// Ensure that the answer input is disabled to start
answer_input.disabled = true;
submit_answer_button.disabled = true;

frquestion_form.style.display = "none";
mcquestion_form.style.display = "none";
codequestion_form.style.display = "none";

/*----------------------------------------------------------------------------*/
/* "Global Variables"                                                         */
/*----------------------------------------------------------------------------*/
let curr_question_type = "";
let curr_prompt = "";

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/

function redirect_to_homepage(roomid, nickname) {
    let params = new URLSearchParams();
    params.append('roomid', roomid);
    params.append('nickname', nickname);

    const url = 'index.html?' + params.toString();
    window.location.href = url;
}

function submit_frquestion_answer() {
    if (answer_input.value != null) {
        console.log("submit answer " + answer_input.value);
        socket.emit("submit answer", answer_input.value);
    }
}

function submit_mcquestion_answer() {
    let answer_choices = [];

    let mcquestion_button_tags = document.getElementsByClassName("mcquestion-answer-button");

    for (let i = 0; i < mcquestion_button_tags.length; ++i) {
        if (mcquestion_button_tags[i].checked) {
            answer_choices.push(i);
        }
    }

    console.log("submit answer " + answer_choices);
    socket.emit("submit answer", answer_choices);
}

function submit_codequestion_answer() {
    console.log("submit answer " + editor.getValue());
    socket.emit("submit answer", editor.getValue());
    return;
}

function submit_answer_generic() {
    console.log("submit_answer_generic()");
    switch (curr_question_type) {
        case "frquestion":
            submit_frquestion_answer();
            break;
        case "mcquestion":
            submit_mcquestion_answer();
            break;
        case "codequestion":
            submit_codequestion_answer();
            break;
        default:
            break;
    }
}

/*----------------------------------------------------------------------------*/
/* Room Joining                                                               */
/*----------------------------------------------------------------------------*/
/* We expect the user to only ever access this page through the home page. If the necessary URL parameters are not present, then we redirect the user to the homepage using window.location.href */
const params = new URLSearchParams(window.location.search);
const roomid_param = params.get("roomid");
const nickname_param = params.get("nickname");

if (roomid_param == null || roomid_param == "") {
    error_message("Enter a room id");
    redirect_to_homepage(roomid_param, nickname_param);
}

if (nickname_param == null || nickname_param == "") {
    error_message("Enter a nickname");
    redirect_to_homepage(roomid_param, nickname_param);
}

socket.emit("join room", roomid_param, nickname_param);

socket.on("join room fail", function (msg) {
    error_message(msg);
    redirect_to_homepage(roomid_param, nickname_param);
});

socket.on("join room success", function (msg) {
    question_tag.innerText = msg;
});

/*----------------------------------------------------------------------------*/
/* Update Question and Question Timer                                         */
/*----------------------------------------------------------------------------*/
socket.on("push frquestion", function (prompt, end_time) {
    curr_prompt = prompt;
    curr_question_type = "frquestion";

    frquestion_form.style.display = form_display_style;
    frquestion_form.disabled = false;
    mcquestion_form.style.display = "none";
    mcquestion_form.disabled = true;
    codequestion_form.style.display = "none";
    codequestion_form.disabled = false;

    question_tag.innerText = `Question:  ${prompt}`;
    question_feedback_tag.innerText = '';

    answer_input.disabled = false;
    submit_answer_button.disabled = false;

    start_timer(end_time);
});

socket.on("push mcquestion", function (prompt, answer_choices, end_time) {
    curr_prompt = prompt;
    curr_question_type = "mcquestion";

    frquestion_form.style.display = "none";
    mcquestion_form.disabled = true;
    mcquestion_form.style.display = form_display_style;
    mcquestion_form.disabled = false;
    codequestion_form.style.display = "none";
    mcquestion_form.disabled = true;

    question_tag.innerText = `Question:  ${prompt}`;
    question_feedback_tag.innerText = '';

    answer_input.disabled = false;
    submit_answer_button.disabled = false;

    let mcquestion_label_tags = document.getElementsByClassName("mcquestion-answer-label");

    for (let i = 0; i < answer_choices.length; ++i) {
        mcquestion_label_tags[i].innerText = answer_choices[i];
    }

    start_timer(end_time);
});

socket.on("push codequestion", function (prompt, template, provided_language, end_time) {
    curr_prompt = prompt;
    curr_question_type = "codequestion";

    frquestion_form.style.display = "none";
    frquestion_form.disabled = true;
    mcquestion_form.style.display = "none";
    mcquestion_form.disabled = true;
    codequestion_form.style.display = form_display_style;
    codequestion_form.disabled = false;

    question_tag.innerText = `Question:  ${prompt}`;
    question_feedback_tag.innerText = '';

    submit_answer_button.disabled = false;

    editor.setValue(template);

    start_timer(end_time);
});

socket.on("close question success", function () {
    answer_input.disabled = true;
    submit_answer_button.disabled = true;
    stop_timer();
});

/*----------------------------------------------------------------------------*/
/* Answer Submissions                                                         */
/*----------------------------------------------------------------------------*/

submit_answer_button.addEventListener("click", function (e) {
    e.preventDefault();
    submit_answer_generic();
})

frquestion_form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit_frquestion_answer();
});

mcquestion_form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit_mcquestion_answer();
});

codequestion_form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit_codequestion_answer();
});

socket.on("submit answer success", function (msg) {
    question_feedback_tag.style.color = 'white';
    question_feedback_tag.innerText = msg;
});

socket.on("submit answer fail", function (msg) {
    question_feedback_tag.innerText = msg;
});

socket.on("answer correct", function (player_answer, correct_answer, num_right, num_wrong) {
    //question_feedback_tag.innerText = `Correct! You answered "${player_answer}". Correct answer is "${correct_answer}"`;
    question_feedback_tag.innerText = 'Correct!';
    question_feedback_tag.style.color = 'green';
    ninja.style.display = 'block';
    setTimeout(function () {
        ninja.style.display = 'none';
    }, 400);
    score_tag.innerText = `${num_right}/${num_right + num_wrong}`;
    results_score_tag.innerText = `Final score: ${score_tag.innerText}`;

    // Add row to the summary table
    addTableRow(curr_prompt, correct_answer, player_answer, true);
});

socket.on("answer incorrect", function (player_answer, correct_answer, num_right, num_wrong) {
    question_feedback_tag.innerText = `Incorrect.You answered "${player_answer}". Correct answer is "${correct_answer}"`;
    question_feedback_tag.style.color = 'red';
    score_tag.innerText = `${num_right} /${num_right + num_wrong}`;
    results_score_tag.innerText = `Final score: ${score_tag.innerText}`;

    // Add row to the summary table
    addTableRow(curr_prompt, correct_answer, player_answer, false);
});

/*----------------------------------------------------------------------------*/
/* Run and Compile Code                                                       */
/*----------------------------------------------------------------------------*/

run_code_button.addEventListener("click", function (e) {
    e.preventDefault();
    socket.emit("compile and run", editor.getValue(), "C");
});

socket.on("compile fail", function (stderr) {
    console.log(stderr);
    output_tag.innerText = stderr;
});

socket.on("run fail", function (stderr) {
    console.log(stderr);
    output_tag.innerText = stderr;
});

socket.on("run timeout", function () {
    output_tag.innerText = "Your code exceeded the standard time.";
});

socket.on("run success", function (stdout) {
    console.log(stdout);
    output_tag.innerText = stdout;
});

/*----------------------------------------------------------------------------*/
/* Show Summary When Session Closes                                           */
/*----------------------------------------------------------------------------*/

socket.on("close session", function () {
    toggle_visibility(false);
});
