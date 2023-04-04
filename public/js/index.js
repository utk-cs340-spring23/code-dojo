// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const room_input = document.getElementById("room-input");
const nickname_input = document.getElementById("nickname-input");
const join_room_form = document.getElementById("join-room-form");

/*----------------------------------------------------------------------------*/
/* Handle Room Joining                                                        */
/*----------------------------------------------------------------------------*/
join_room_form.addEventListener("submit", function (e) {
    e.preventDefault();

    let params = new URLSearchParams();
    params.append('roomid', room_input.value);
    params.append('nickname', nickname_input.value);

    const url = 'quizPage.html?' + params.toString();
    window.location.href = url;
});
