// NOTE: util.js is loaded before this file. This file uses functions defiend in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const create_room_button = document.getElementById("create-room-button");
const question_input = document.getElementById("question-input");
const answer_input = document.getElementById("answer-input");
const push_question_button = document.getElementById("push-question-button");
const close_question_button = document.getElementById("close-question-button");
const player_table = document.getElementById("player-table");

// Ensure that the question and answer input is disabled to start
question_input.disabled = true;
answer_input.disabled = true;
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
    alert(msg); // Successfully created room <roomid>
    room_input.disabled = true;
    create_room_button.disabled = true;

    question_input.disabled = false;
    answer_input.disabled = false;
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

    console.log("new question " + question_input.value + " " + answer_input.value);
    socket.emit("new question", question_input.value, answer_input.value);

});

socket.on("new question success", function (msg) {
    alert(msg); // successfully pushed question
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
    alert(msg);
    push_question_button.disabled = false;
    close_question_button.disabled = true;
});

socket.on("close question fail", function (msg) {
    error_message(msg);
});


/*----------------------------------------------------------------------------*/
/* Sockets                                                                    */
/*----------------------------------------------------------------------------*/

// The following two arrays record how many correct/incorrect answers each player submits
// Both arrays are keyed by the socket id string
let player_correct_total = [];
let player_incorrect_total = [];

socket.on("player join", function (socket_id, nickname) {
    console.log("player join " + socket_id);

    // Add to player table
    let table_row = document.createElement("tr");
    table_row.setAttribute("id", socket_id);
    player_table.appendChild(table_row);

    let table_entry = document.createElement("td");
    table_entry.setAttribute("class", "socket-id");
    table_entry.textContent = socket_id;
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "nickname");
    table_entry.textContent = nickname;
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "num-right");
    table_entry.textContent = "0";
    table_row.appendChild(table_entry);

    table_entry = document.createElement("td");
    table_entry.setAttribute("class", "num-wrong");
    table_entry.textContent = "0";
    table_row.appendChild(table_entry);

    player_correct_total[socket_id] = 0;
    player_incorrect_total[socket_id] = 0;


    // window.scrollTo(0, document.body.scrollHeight);
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

// Change player list when a player leaves
socket.on("player leave", function (socket_id) {
    console.log("player leave " + socket_id);
    document.getElementById(socket_id).remove();
});
