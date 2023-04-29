function error_message(msg) {
    alert("Error: " + msg);
}

function ms_to_formatted_string(ms) {
    return new Date(ms).toISOString().slice(14, 23);
}

let timer_interval_id = 0;
const timer_update_frequency = 25;  // in milliseconds

function start_timer(end_time) {
    if (!Number.isNaN(end_time) && end_time != null) {
        timer_interval_id = setInterval(update_timer, timer_update_frequency, end_time);
    } else {
        question_timer_tag.innerText = "";
    }
}

function update_timer(end_time) {
    question_timer_tag.innerText = ms_to_formatted_string(end_time - Date.now());
}
