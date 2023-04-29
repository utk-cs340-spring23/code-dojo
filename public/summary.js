let questionCount = 0; // Keep track of the number of questions

function addTableRow(question, correctAnswer, studentAnswer) {
  // Get the table body
  const tableBody = document.querySelector('tbody');

  // Create a new table row
  const newRow = document.createElement('tr');

  // Create table cells for the question number, question, correct answer, and student answer
  const questionNumberCell = document.createElement('td');
  questionNumberCell.textContent = ++questionCount;
  newRow.appendChild(questionNumberCell);

  const questionCell = document.createElement('td');
  questionCell.textContent = question;
  newRow.appendChild(questionCell);

  const correctAnswerCell = document.createElement('td');
  correctAnswerCell.textContent = correctAnswer;
  newRow.appendChild(correctAnswerCell);

  const studentAnswerCell = document.createElement('td');
  studentAnswerCell.textContent = studentAnswer;
  newRow.appendChild(studentAnswerCell);

  // Append the new row to the table body
  tableBody.appendChild(newRow);

  // Resize the table to fit all rows
  const tableHeight = tableBody.getBoundingClientRect().height;
  const windowHeight = window.innerHeight;
  if (tableHeight > windowHeight) {
    // If the table is taller than the window, set the table height to the window height minus 100 pixels for padding
    tableBody.style.height = windowHeight - 100 + 'px';
    tableBody.style.overflowY = 'scroll';
  }
}

// Hardcoded example data
const question = 'What is the capital of France?';
const correctAnswer = 'Paris';
const studentAnswer = 'Paris';

// Add the row to the table
addTableRow(question, correctAnswer, studentAnswer);

function toggle_visibility(showQuestions) {
    // let showQuestions = true; // boolean variable to determine whether to show the question or result area
    if (showQuestions) {
    document.getElementById("question-area").style.display = "block";
    document.getElementById("results-area").style.display = "none";
    } else {
    document.getElementById("question-area").style.display = "none";
    document.getElementById("results-area").style.display = "block";
    }
}