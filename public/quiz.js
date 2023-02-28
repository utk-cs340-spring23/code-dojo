var socket = io();
var input = document.getElementById('input');

// Whenever we submit an answer, send the answer to the server
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value != null) {
        console.log("Submit answer");
        socket.emit('submit answer', input.value);
    }
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
