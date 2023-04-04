// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const create_room_button = document.getElementById("create-room-button");
const question_input = document.getElementById("question-input");
const answer_input = document.getElementById("answer-input");
const timer_input = document.getElementById("timer-input");
const push_question_button = document.getElementById("push-question-button");
const close_question_button = document.getElementById("close-question-button");
const player_table = document.getElementById("player-table");
const player_table_body = document.getElementById("player-table-body");

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/
function enable_input_fields(bool) {
    question_input.disabled = !bool;
    answer_input.disabled = !bool;
    timer_input.disabled = !bool;

}

/* Ensure that the question and answer input is disabled to start */
enable_input_fields(false);
push_question_button.disabled = true;
close_question_button.disabled = true;

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
    if (question_input.value == "") {
        error_message("Question cannot be empty");
        return;
    }

    if (answer_input.value == "") {
        error_message("Answer cannot be empty");
        return;
    }

    socket.emit("new question", question_input.value, answer_input.value, parseInt(timer_input.value));
});

socket.on("new question success", function (msg) {
    console.log(msg);
    enable_input_fields(false);
    push_question_button.disabled = true;
    close_question_button.disabled = false;
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
});

socket.on("close question fail", function (msg) {
    error_message(msg);
});

/*----------------------------------------------------------------------------*/
/* Socket IO                                                                  */
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
