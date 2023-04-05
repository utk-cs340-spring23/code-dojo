// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const roomid_input = document.getElementById("room-input");
const nickname_input = document.getElementById("nickname-input");
const join_room_form = document.getElementById("join-room-form");

/*----------------------------------------------------------------------------*/
/* Handle URL Parameters                                                      */
/*----------------------------------------------------------------------------*/
const params = new URLSearchParams(window.location.search);
const roomid_param = params.get("roomid");
const nickname_param = params.get("nickname");

roomid_input.value = roomid_param;
nickname_input.value = nickname_param;

/*----------------------------------------------------------------------------*/
/* Handle Room Joining                                                        */
/*----------------------------------------------------------------------------*/
join_room_form.addEventListener("submit", function (e) {
    e.preventDefault();

    let params = new URLSearchParams();
    params.append('roomid', roomid_input.value);
    params.append('nickname', nickname_input.value);

    const url = 'quizPage.html?' + params.toString();
    window.location.href = url;
});
