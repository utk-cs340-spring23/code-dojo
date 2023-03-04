const socket = io();
const room_input = document.getElementById("room-input");
const nickname_input = document.getElementById("nickname-input");
const answer_input = document.getElementById("answer-input");
const submit_answer_button = document.getElementById("submit-answer-button");
const question_tag = document.getElementById("question");

function update_question(question) {
    question_tag.innerText = "Question: " + question;
    answer_input.disabled = false;
    submit_answer_button.disabled = false;
}

// Handle room joining
document.getElementById("room-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (room_input.value == null || room_input.value == "") {
        error_message("Enter a room id");
        return;
    }

    if (nickname_input.value == null || nickname_input.value == "") {
        error_message("Enter a nickname");
        return;
    }

    console.log("join room" + answer_input.value);
    socket.emit("join room", room_input.value, nickname_input.value);
});

socket.on("join room fail", function (msg) {
    error_message(msg);
});

socket.on("join room success", function (room_id, question) {
    if (question != null && question != "") {
        update_question(question);
    } else {
        question_tag.innerText = "Waiting for host...";
    }
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
    update_question(question);
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
