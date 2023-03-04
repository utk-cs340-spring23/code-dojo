var socket = io();
var room_input = document.getElementById("room-input");
var question_input = document.getElementById("question-input");
var answer_input = document.getElementById("answer-input");
var player_table = document.getElementById("player-table");

// Create room
document.getElementById("room-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (room_input.value != null) {
        console.log("join room as host " + room_input.value);
        socket.emit("join room as host", room_input.value);
    }
});

// Push new question to room
document.getElementById("question-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (question_input.value != "" && answer_input.value != "") {
        console.log("new question " + question_input.value + " " + answer_input.value);
        socket.emit("new question", question_input.value, answer_input.value);
    }
});

// Change player list when a new player joins
let player_correct_total = [];
let player_incorrect_total = [];


socket.on("player join", function (socket_id, nickname) {
    console.log("player join " + socket_id);

    var table_row = document.createElement("tr");
    table_row.setAttribute("id", socket_id);
    player_table.appendChild(table_row);

    var table_entry = document.createElement("td");
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
    var table_entry = document.getElementById(socket_id).getElementsByClassName("num-right")[0];
    table_entry.textContent = player_correct_total[socket_id];
});

socket.on("player answer incorrect", function (socket_id) {
    ++player_incorrect_total[socket_id];
    var table_entry = document.getElementById(socket_id).getElementsByClassName("num-wrong")[0];
    table_entry.textContent = player_incorrect_total[socket_id];

});


// Change player list when a player leaves
socket.on("player leave", function (socket_id) {
    console.log("player leave " + socket_id);
    var item = document.getElementById(socket_id);
    item.remove();
});
