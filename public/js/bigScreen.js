// NOTE: util.js is loaded before this file. This file uses functions defined in util.js

/*----------------------------------------------------------------------------*/
/* Constants                                                                  */
/*----------------------------------------------------------------------------*/
const socket = io();
const session_id_tag = document.getElementById("session-id");
const num_players_tag = document.getElementById("num-players");
const question_timer_tag = document.getElementById("question-timer");
const question_tag = document.getElementById("question");
const answer_tag = document.getElementById("answer");
const chart_container_tag = document.getElementById("chart-container");
const chart_tag = document.getElementById("myChart");

chart_container_tag.style.display = "none";

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

socket.on("spectate room success", function (msg, num_players) {
    session_id_tag.innerText = `Session ID: ${roomid_param}`;
    num_players_tag.innerText = `${num_players} connected`;
});

socket.on("spectate room fail", function (msg) {
    error_message(msg);
    window.location.href = 'teacherPage.html';
});

/*----------------------------------------------------------------------------*/
/* Update Player Count                                                        */
/*----------------------------------------------------------------------------*/
socket.on("num players", function (num_players) {
    num_players_tag.innerText = `${num_players} connected`;
});

/*----------------------------------------------------------------------------*/
/* Handle Questions                                                           */
/*----------------------------------------------------------------------------*/

socket.on("push frquestion", function (prompt, end_time) {
    question_tag.innerText = prompt;
    answer_tag.innerText = "";
    chart_container_tag.style.display = "none";
    start_timer(end_time);
});

socket.on("push mcquestion", function (prompt, answer_choices, end_time) {
    question_tag.innerText = prompt;
    answer_tag.innerText = "";
    chart_container_tag.style.display = "none";
    start_timer(end_time);

});

socket.on("push codequestion", function (prompt, template, provided_language, end_time) {
    question_tag.innerText = prompt;
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
                beginAtZero: true
            }
        }
    },
};

const ctx = chart_tag.getContext('2d');
const myBarChart = new Chart(ctx, config);

function update_bar_chart(new_data) {
    myBarChart.update();
}

socket.on("question results", function (results) {
    console.log(results);

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
    myBarChart.update();

    chart_container_tag.style.display = "block";

    console.log("Got results!");
});
