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

const ninja = document.getElementById("ninja-slash");

const timer_update_frequency = 25;  // in milliseconds

// Ensure that the answer input is disabled to start
answer_input.disabled = true;
submit_answer_button.disabled = true;

/*----------------------------------------------------------------------------*/
/* "Global Variables"                                                         */
/*----------------------------------------------------------------------------*/
let timer_interval_id = 0;

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/
function update_timer(end_time) {
    question_timer_tag.innerText = ms_to_formatted_string(end_time - Date.now());
}

/*----------------------------------------------------------------------------*/
/* Room Joining                                                               */
/*----------------------------------------------------------------------------*/
// document.getElementById("room-form").addEventListener("submit", function (e) {
//     e.preventDefault();
//     if (room_input.value == null || room_input.value == "") {
//         error_message("Enter a room id");
//         return;
//     }

//     if (nickname_input.value == null || nickname_input.value == "") {
//         error_message("Enter a nickname");
//         return;
//     }

//     console.log("join room" + answer_input.value);
//     socket.emit("join room", room_input.value, nickname_input.value);
// });

const params = new URLSearchParams(window.location.search);
const roomid_param = params.get("roomid");
const nickname_param = params.get("nickname");

if (roomid_param == null || roomid_param == "") {
    error_message("Enter a room id");
    window.location.href = "index.html";
}

if (nickname_param == null || nickname_param == "") {
    error_message("Enter a nickname");
    window.location.href = "index.html";
}

socket.emit("join room", roomid_param, nickname_param);

socket.on("join room fail", function (msg) {
    error_message(msg);
    window.location.href = "index.html";
});

socket.on("join room success", function (msg) {
    question_tag.innerText = msg;
});

/*----------------------------------------------------------------------------*/
/* Update Question                                                            */
/*----------------------------------------------------------------------------*/
socket.on("push question", function (prompt, end_time) {
    question_tag.innerText = "Question: " + prompt;
    question_feedback_tag.innerText = '';
    answer_input.disabled = false;
    submit_answer_button.disabled = false;

    if (!Number.isNaN(end_time) && end_time != null) {
        timer_interval_id = setInterval(update_timer, timer_update_frequency, end_time);
    } else {
        question_timer_tag.innerText = "";
    }

});

socket.on("close question success", function () {
    answer_input.disabled = true;
    submit_answer_button.disabled = true;
    clearInterval(timer_interval_id);
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
    question_feedback_tag.style.color = 'white';
    question_feedback_tag.innerText = msg;
});

socket.on("submit answer fail", function (msg) {
    question_feedback_tag.innerText = msg;
});

socket.on("answer correct", function (player_answer, correct_answer) {
    //question_feedback_tag.innerText = `Correct! You answered "${player_answer}". Correct answer is "${correct_answer}"`;
    question_feedback_tag.innerText = 'Correct!';
    question_feedback_tag.style.color = 'green';
    ninja.style.display = 'block';
    setTimeout(function () {
        ninja.style.display = 'none';
    }, 400);
});

socket.on("answer incorrect", function (player_answer, correct_answer) {
    question_feedback_tag.innerText = `Incorrect. You answered "${player_answer}". Correct answer is "${correct_answer}"`;
    question_feedback_tag.style.color = 'red';
});
