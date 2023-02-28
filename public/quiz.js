var socket = io();
var input = document.getElementById('input');
var question_tag = document.getElementById('question');

// Whenever we submit an answer, send the answer to the server
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value != null) {
        console.log('submit answer ' + input.value);
        socket.emit('submit answer', input.value);
    }
});

socket.on('push question', function (question) {
    console.log('push question ' + question);
    question_tag.innerText = question;
});


// If the server tells us our answer was correct
socket.on('answer correct', function () {
    console.log('answer correct');
    alert("CORRECT!!!");
});

// If the server tells us our answer was wrong
socket.on('answer incorrect', function () {
    console.log('answer incorrect');
    alert("INOCRRECT!!!");
});
