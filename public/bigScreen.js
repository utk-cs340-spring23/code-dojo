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
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        }
    };
}

async function loadData() {
    const data = await fetchDataFromBackend();

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
