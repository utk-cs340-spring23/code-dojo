var socket = io();
var room_input = document.getElementById("room-input");
var question_input = document.getElementById("question-input");
var answer_input = document.getElementById("answer-input");
var player_list_tag = document.getElementById("player-list");

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
socket.on("player join", function (socketID) {
    console.log("player join " + socketID);
    var item = document.createElement("li");
    item.setAttribute("id", socketID);
    item.textContent = socketID;
    player_list_tag.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// Change player list when a player leaves
socket.on("player leave", function (socketID) {
    console.log("player leave " + socketID);
    var item = document.getElementById(socketID);
    item.remove();
});
