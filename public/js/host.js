// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const create_room_button = document.getElementById("create-room-button");

const question_type_input = document.getElementById("question-type-input");
const frquestion_input = document.getElementById("frquestion-input");
const frquestion_form = document.getElementById("frquestion-form");
const mcquestion_form = document.getElementById("mcquestion-form");
const codequestion_form = document.getElementById("codequestion-form");
const frquestion_answer_input = document.getElementById("frquestion-answer-input");
const timer_input = document.getElementById("timer-input");

const push_question_button = document.getElementById("push-question-button");
const close_question_button = document.getElementById("close-question-button");
const question_timer_tag = document.getElementById("question-timer");
const player_table = document.getElementById("player-table");
const player_table_body = document.getElementById("player-table-body");

const form_display_style = "flex";
const timer_update_frequency = 25;  // in milliseconds

/* Ensure that the question and answer input is disabled to start */
question_type_input.disabled = true;
frquestion_input.disabled = true;
frquestion_answer_input.disabled = true;
timer_input.disabled = true;
push_question_button.disabled = true;
close_question_button.disabled = true;

mcquestion_form.style.display = "none";

/*----------------------------------------------------------------------------*/
/* "Global Variables"                                                         */
/*----------------------------------------------------------------------------*/
let timer_interval_id = 0;
let question_type = "";
let mcquestion_input_tags;
let mcquestion_checkbox_tags;

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/
function update_mcquestion_tags() {
    mcquestion_input_tags = document.getElementsByClassName("mcquestion-answer-input");
    mcquestion_checkbox_tags = document.getElementsByClassName("mcquestion-answer-checkbox");
}

function enable_input_fields(bool) {
    question_type_input.disabled = !bool;
    frquestion_input.disabled = !bool;
    frquestion_answer_input.disabled = !bool;
    timer_input.disabled = !bool;
}

function update_question_type() {
    question_type = question_type_input.value;
    update_mcquestion_tags();

    switch (question_type) {
        case "frquestion":
            frquestion_form.style.display = form_display_style;
            mcquestion_form.style.display = "none";
            codequestion_form.style.display = "none";

            frquestion_answer_input.required = true;
            Array.from(mcquestion_input_tags).forEach(input => {
                input.required = false;
            });

            break;

        case "mcquestion":
            frquestion_form.style.display = "none";
            mcquestion_form.style.display = form_display_style;
            codequestion_form.style.display = "none";

            frquestion_answer_input.required = false;
            Array.from(mcquestion_input_tags).forEach(input => {
                input.required = true;
            });

            break;

        case "codequestion":
            frquestion_form.style.display = "none";
            mcquestion_form.style.display = "none";
            codequestion_form.style.display = form_display_style;

            frquestion_answer_input.required = false;
            Array.from(mcquestion_input_tags).forEach(input => {
                input.required = false;
            });
            break;

        default:
            break;
    }
}

function update_timer(end_time) {
    question_timer_tag.innerText = ms_to_formatted_string(end_time - Date.now());
}

/*----------------------------------------------------------------------------*/
/* When Window Loads                                                          */
/*----------------------------------------------------------------------------*/
window.onload = function () {
    update_question_type();
};

/*----------------------------------------------------------------------------*/
/* Create Room                                                                */
/*----------------------------------------------------------------------------*/

document.getElementById("room-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (room_input.value == null || room_input.value == "") {
        error_message("room id cannot be empty");
        return;
    }

    console.log("create room " + room_input.value);
    socket.emit("create room", room_input.value);
});

socket.on("create room success", function (msg) {
    console.log(msg);
    room_input.disabled = true;
    create_room_button.disabled = true;

    enable_input_fields(true);
    push_question_button.disabled = false;
});

socket.on("create room fail", function (msg) {
    error_message(msg);
});


/*----------------------------------------------------------------------------*/
/* Push New Questions                                                         */
/*----------------------------------------------------------------------------*/
document.getElementById("question-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (frquestion_input.value == "") {
        error_message("Question cannot be empty");
        return;
    }

    let prompt = frquestion_input.value;
    let time_limit_s = parseInt(timer_input.value);

    console.log("Codequestion");

    update_question_type();
    switch (question_type) {
        case "frquestion": {
            if (frquestion_answer_input.value == "") {
                error_message("Answer cannot be empty");
                return;
            }

            socket.emit("new frquestion", prompt, frquestion_answer_input.value.split(","), time_limit_s);
            break;
        }

        case "mcquestion": {
            let mcquestion_input_tags = document.getElementsByClassName("mcquestion-answer-input");
            let mcquestion_checkbox_tags = document.getElementsByClassName("mcquestion-answer-checkbox");

            if (mcquestion_input_tags.length != mcquestion_checkbox_tags.length) {
                error_message("Number of MCQuestion inputs not the same as number of MCQuestion checkboxes");
            }

            let answer_choices = [];
            let correct_answer_indices = [];

            for (let i = 0; i < mcquestion_input_tags.length; ++i) {
                answer_choices.push(mcquestion_input_tags[i].value);

                if (mcquestion_checkbox_tags[i].checked) {
                    correct_answer_indices.push(i);
                }
            }

            socket.emit("new mcquestion", prompt, answer_choices, correct_answer_indices, time_limit_s);
            break;
        }

        case "codequestion": {
            console.log("Codequestion");

            // TODO: implement inputs and test cases
            let inputs = ["1", "2", "3"];
            let expected_outputs = ["1", "2", "3"];
            let language = "C";

            socket.emit("new codequestion", prompt, inputs, expected_outputs, language, time_limit_s);
            break;
        }

        default: {
            error_message("Unknown question type");
        }
    }
});

socket.on("new question success", function (msg, end_time) {
    console.log(msg);
    enable_input_fields(false);
    push_question_button.disabled = true;
    close_question_button.disabled = false;

    console.log(end_time);

    if (!Number.isNaN(end_time) && end_time != null) {
        timer_interval_id = setInterval(update_timer, timer_update_frequency, end_time);
    } else {
        question_timer_tag.innerText = "";
    }
});

socket.on("new question fail", function (msg) {
    error_message(msg);
});

/*----------------------------------------------------------------------------*/
/* Close Current Question                                                     */
/*----------------------------------------------------------------------------*/
close_question_button.addEventListener("click", function (e) {
    e.preventDefault();
    socket.emit("close question");
})

socket.on("close question success", function (msg) {
    console.log(msg);
    enable_input_fields(true);
    push_question_button.disabled = false;
    close_question_button.disabled = true;
    clearInterval(timer_interval_id);

});

socket.on("close question fail", function (msg) {
    error_message(msg);
});

/*----------------------------------------------------------------------------*/
/* Record Player Answers and Stats                                            */
/*----------------------------------------------------------------------------*/

/* The following two arrays record how many correct/incorrect answers each player submits. Both arrays are keyed by the socket id string */
let player_correct_total = [];
let player_incorrect_total = [];

socket.on("player join", function (socket_id, nickname) {
    console.log("player join " + socket_id);

    // Add to player table
    let table_row = document.createElement("tr");
    table_row.setAttribute("id", socket_id);
    player_table_body.appendChild(table_row);

    let table_entry = document.createElement("td");
    table_entry.setAttribute("class", "socket-id grid-item");
    table_entry.textContent = socket_id;
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "nickname grid-item");
    table_entry.textContent = nickname;
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "num-right grid-item");
    table_entry.textContent = "0";
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "num-wrong grid-item");
    table_entry.textContent = "0";
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "current-answer grid-item");
    table_entry.textContent = "";
    table_row.appendChild(table_entry);

    player_correct_total[socket_id] = 0;
    player_incorrect_total[socket_id] = 0;

    // player_table.style.position = "absolute";
    // player_table.style.left = "25%";

});

socket.on("player submit answer", function (socket_id, player_answer) {
    let table_entry = document.getElementById(socket_id).getElementsByClassName("current-answer")[0];
    table_entry.textContent = player_answer;
});

socket.on("player answer correct", function (socket_id) {
    ++player_correct_total[socket_id];

    let table_entry = document.getElementById(socket_id).getElementsByClassName("num-right")[0];
    table_entry.textContent = player_correct_total[socket_id];
});

socket.on("player answer incorrect", function (socket_id) {
    ++player_incorrect_total[socket_id];

    let table_entry = document.getElementById(socket_id).getElementsByClassName("num-wrong")[0];
    table_entry.textContent = player_incorrect_total[socket_id];
});

/* When a player leaves, remove them from the player list */
socket.on("player leave", function (socket_id) {
    console.log("player leave " + socket_id);
    document.getElementById(socket_id).remove();
});
