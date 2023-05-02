// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const session_id_tag = document.getElementById("session-id");
const num_players_tag = document.getElementById("num-players");
const answer_count_tag = document.getElementById("answer-count");
const question_timer_tag = document.getElementById("question-timer");
const question_tag = document.getElementById("question");
const player_list_tag = document.getElementById("player-list");
const answer_tag = document.getElementById("answer");
const chart_container_tag = document.getElementById("chart-container");
const chart_tag = document.getElementById("myChart");

chart_container_tag.style.display = "none";
answer_count_tag.style.display = "none";

/*----------------------------------------------------------------------------*/
/* Global Variables                                                           */
/*----------------------------------------------------------------------------*/
let num_players = 0;
let num_players_answered = 0;

/*----------------------------------------------------------------------------*/
/* Functions                                                                  */
/*----------------------------------------------------------------------------*/

function update_answer_count_tag() {
    answer_count_tag.innerText = `${num_players_answered} / ${num_players} answered`;
}

function append_player_list(nickname) {
    const player_tag = document.createElement("div");
    player_tag.innerText = nickname;
    player_tag.setAttribute("id", nickname);
    player_list_tag.prepend(player_tag);
}

function remove_player_list(nickname) {
    const player_tag = document.getElementById(nickname);

    if (player_tag != null) {
        player_tag.remove();
    }
}

/*----------------------------------------------------------------------------*/
/* Room Joining                                                               */
/*----------------------------------------------------------------------------*/
const params = new URLSearchParams(window.location.search);
const roomid_param = params.get("roomid");


if (roomid_param == null || roomid_param == "") {
    error_message("Enter a room id");
    window.location.href = 'teacherPage.html';
}

socket.emit("spectate room", roomid_param);

socket.on("spectate room success", function (msg, _num_players, nicknames) {
    num_players = _num_players

    session_id_tag.innerText = `Session ID: ${roomid_param}`;
    num_players_tag.innerText = `${num_players} players`;

    console.log(nicknames);

    for (const nickname of nicknames) {
        console.log(nickname);
        append_player_list(nickname);
    }
});

socket.on("spectate room fail", function (msg) {
    error_message(msg);
    window.location.href = 'teacherPage.html';
});

/*----------------------------------------------------------------------------*/
/* Update Player Count                                                        */
/*----------------------------------------------------------------------------*/
socket.on("num players", function (_num_players) {
    num_players = _num_players;
    num_players_tag.innerText = `${num_players} players`;
});

/*----------------------------------------------------------------------------*/
/* Initial Player List                                                        */
/*----------------------------------------------------------------------------*/
// This player list is only visible before the host pushes any questions, similar to Kahoot
socket.on("player join", function (socket_id, nickname) {
    ++num_players;
    append_player_list(nickname);
    update_answer_count_tag();
});

socket.on("player leave", function (socket_id, nickname) {
    --num_players;
    remove_player_list(nickname);
    update_answer_count_tag();
});

/*----------------------------------------------------------------------------*/
/* Handle Questions                                                           */
/*----------------------------------------------------------------------------*/

socket.on("push frquestion", function (prompt, end_time) {
    num_players_answered = 0;
    update_answer_count_tag();
    answer_count_tag.style.display = "block";
    player_list_tag.style.display = "none";
    question_tag.innerText = `Question: ${prompt}`;
    answer_tag.innerText = "";
    chart_container_tag.style.display = "none";
    start_timer(end_time);
});

socket.on("push mcquestion", function (prompt, answer_choices, end_time) {
    num_players_answered = 0;
    update_answer_count_tag();
    answer_count_tag.style.display = "block";
    player_list_tag.style.display = "none";
    question_tag.innerText = `Question: ${prompt}`;
    answer_tag.innerText = "";
    chart_container_tag.style.display = "none";
    start_timer(end_time);

});

socket.on("push codequestion", function (prompt, template, provided_language, end_time) {
    num_players_answered = 0;
    update_answer_count_tag();
    answer_count_tag.style.display = "block";
    player_list_tag.style.display = "none";
    question_tag.innerText = `Question: ${prompt}`;
    answer_tag.innerText = "";
    chart_container_tag.style.display = "none";
    start_timer(end_time);
});

socket.on("correct answer", function (answer) {
    answer_tag.innerText = `Answer: ${answer}`;
})

socket.on("close question success", function () {
    stop_timer();
});

//

socket.on("new answer", function (_num_players_answered) {
    num_players_answered = _num_players_answered;
    update_answer_count_tag();
});

/*----------------------------------------------------------------------------*/
/* Bar Chart                                                                  */
/*----------------------------------------------------------------------------*/

const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
const values = [12, 19, 3, 5, 2, 3];
let data = {
    labels: labels,
    datasets: [{
        label: 'Number of answers',
        data: values,
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    },
};

const ctx = chart_tag.getContext('2d');
const myBarChart = new Chart(ctx, config);

socket.on("question results", function (results, num_right) {
    answer_count_tag.innerText = `${num_players_answered} / ${num_players} answered, ${num_right} correct`;

    let new_labels = [];
    let new_values = [];

    for (const [answer, frequency] of Object.entries(results)) {
        if (frequency == null) {
            continue;
        }

        new_labels.push(answer);
        new_values.push(frequency);
    }

    data.labels = new_labels;
    data.datasets[0].data = new_values;

    chart_container_tag.style.display = "block";
    myBarChart.update();
});
