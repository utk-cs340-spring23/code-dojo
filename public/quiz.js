var socket = io();
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        console.log("Submit answer");
        socket.emit('submit answer', input.value);
    }
});
