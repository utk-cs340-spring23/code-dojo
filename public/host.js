var socket = io();
var question = document.getElementById('question');
var answer = document.getElementById('answer');

// Whenever we submit an answer, send the answer to the server
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (question.value != "" && answer.value != "") {
        console.log('new question ' + question.value + ' ' + answer.value);
        socket.emit('new question', question.value, answer.value);
    }
});
