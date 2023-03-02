var socket = io();
var room_input = document.getElementById("room-input");
var answer_input = document.getElementById("answer-input");
var question_tag = document.getElementById("question");

// Handle room joining
document.getElementById("room-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (room_input.value != null) {
        console.log("join room as player" + answer_input.value);
        socket.emit("join room as player", room_input.value);
    }
});

socket.on("join room fail", function (room_id) {
    alert("Error: no room with id " + room_id);
});

socket.on("join room success", function (room_id) {
    alert("Joined " + room_id);
});

// Handle answer submissions
document.getElementById("answer-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (answer_input.value != null) {
        console.log("submit answer " + answer_input.value);
        socket.emit("submit answer", answer_input.value);
    }
});

// Get new question from host
socket.on("push question", function (question) {
    console.log("push question " + question);
    question_tag.innerText = "Question: " + question;
});


// If the server tells us our answer was correct
socket.on("answer correct", function () {
    console.log("answer correct");
    alert("CORRECT!!!");
});

// If the server tells us our answer was wrong
socket.on("answer incorrect", function () {
    console.log("answer incorrect");
    alert("INOCRRECT!!!");
});
