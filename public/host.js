var socket = io();
var question = document.getElementById("question");
var answer = document.getElementById("answer");
var player_list_tag = document.getElementById("player-list");

// Submit answer to server
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (question.value != "" && answer.value != "") {
        console.log("new question " + question.value + " " + answer.value);
        socket.emit("new question", question.value, answer.value);
    }
});

console.log(socket.id);

// Change player list when a new player joins
socket.on("player join", function (socketID) {
    var item = document.createElement("li");
    item.setAttribute("id", socketID);
    item.textContent = socketID;
    player_list_tag.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// Change player list when a player leaves
socket.on("player leave", function (socketID) {
    var item = document.getElementById(socketID);
    item.remove();
});
