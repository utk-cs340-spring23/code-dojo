// Placeholder function to get data from the backend
// Replace this function with your actual API call to fetch data
async function fetchDataFromBackend() {
    return {
        question: 'Sample Question',
        sessionId: 'ABC123',
        timer: '00:00:00',
        barData: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Number of students',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        }
    };
}

// use this function call to make a graph based on data
// async function makeChart(given_question, session_id, time, labels, main_label, data, width) {
//     return {
//         question: given_question, // given_question must be a string
//         sessionId: session_id,  // session_id must be a string
//         timer: time,  // time must be a string
//         barData: {
//             labels: labels, // labels must be an array of strings
//             datasets: [{
//                 label: main_label, // main_label must be a string
//                 data: data, // data must be an array of the info
//                 borderWidth: width // width must be an int
//             }]
//         }
//     };
// }

// test variables
var q = 'test';
var s = '123456';
var t = '00:00:00';
var l = ['a', 'b', 'c'];
var m = '# votes';
var d = [25, 10, 15];
var w = 1;

async function loadData() {
    const data = await fetchDataFromBackend();

    // this is a testing call, replace with call using actual data
    // const data = await makeChart(q, s, t, l, m, d, w);

    document.getElementById('question-placeholder').innerText = data.question;
    document.getElementById('session-id').innerText += ` ${data.sessionId}`;
    document.getElementById('question-timer').innerText = data.timer;

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: data.barData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', loadData);
