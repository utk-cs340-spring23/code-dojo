function error_message(msg) {
    alert("Error: " + msg);
}

function ms_to_formatted_string(ms) {
    return new Date(ms).toISOString().slice(14, 23);
}
