// NOTE: util.js is loaded before this file. This file uses functions defiend in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const nickname_input = document.getElementById("nickname-input");
const answer_input = document.getElementById("answer-input");
const submit_answer_button = document.getElementById("submit-answer-button");
const question_tag = document.getElementById("question");

// Ensure that the answer input is disabled to start
answer_input.disabled = true;
submit_answer_button.disabled = true;

// Update the displayed question; also enable answer input
function update_question(question) {
    question_tag.innerText = "Question: " + question;
    answer_input.disabled = false;
    submit_answer_button.disabled = false;
}

/*----------------------------------------------------------------------------*/
/* Room Joining                                                               */
/*----------------------------------------------------------------------------*/
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

/*----------------------------------------------------------------------------*/
/* Update Question                                                            */
/*----------------------------------------------------------------------------*/
socket.on("push question", function (question) {
    update_question(question);
});

/*----------------------------------------------------------------------------*/
/* Answer Submissions                                                         */
/*----------------------------------------------------------------------------*/
document.getElementById("answer-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (answer_input.value != null) {
        console.log("submit answer " + answer_input.value);
        socket.emit("submit answer", answer_input.value);
    }
});

socket.on("submit answer success", function (msg) {
    alert(msg);
});

socket.on("submit answer fail", function (msg) {
    error_message(msg);
});

socket.on("answer correct", function () {
    alert("Correct!");
});

socket.on("answer incorrect", function () {
    alert("Incorrect!");
});
