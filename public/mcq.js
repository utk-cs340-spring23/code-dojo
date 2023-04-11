/*const questions = [
    {
      question: "What is the capital of France?",
      options: {
        a: "London",
        b: "Paris",
        c: "Madrid",
        d: "Rome"
      },
      answer: "b"
    }
  ];
  
  const questionEl = document.getElementById("question");
  const optionAEl = document.getElementById("option-a");
  const optionBEl = document.getElementById("option-b");
  const optionCEl = document.getElementById("option-c");
  const optionDEl = document.getElementById("option-d");
  const nextBtn = document.getElementById("next-btn");
  const addQuestionBtn = document.getElementById("add-question-btn");
  
  let currentQuestion = 0;
  function loadQuestion() {
    const currentQuizQuestion = questions[currentQuestion];
    questionEl.textContent = currentQuizQuestion.question;
    optionAEl.textContent = currentQuizQuestion.options.a;
    optionBEl.textContent = currentQuizQuestion.options.b;
    optionCEl.textContent = currentQuizQuestion.options.c;
    optionDEl.textContent = currentQuizQuestion.options.d;
    }
    
    loadQuestion();
    
    function getSelectedOption() {
    const answerEls = document.getElementsByName("answer");
    let selectedOption = undefined;
    
    answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
    selectedOption = answerEl.value;
    }
    });
    
    return selectedOption;
    }
    
    let score = 0;
    
    nextBtn.addEventListener("click", () => {
    const selectedOption = getSelectedOption();
    
    if (selectedOption) {
    if (selectedOption === questions[currentQuestion].answer) {
    score++;
    }
    currentQuestion++;

if (currentQuestion < questions.length) {
  loadQuestion();
} else {
  alert(`Quiz Completed! Your score is ${score}/${questions.length}.`);
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}
} else {
    alert("Please select an option.");
    }
    });
    
    addQuestionBtn.addEventListener("click", () => {
    const newQuestion = prompt("Enter a new question:");
    const newOptionA = prompt("Enter option A:");
    const newOptionB = prompt("Enter option B:");
    const newOptionC = prompt("Enter option C:");
    const newOptionD = prompt("Enter option D:");
    const newAnswer = prompt("Enter the correct answer (a, b, c or d):");
    
    const newQuizQuestion = {
    question: newQuestion,
    options: {
    a: newOptionA,
    b: newOptionB,
    c: newOptionC,
    d: newOptionD
    },
    answer: newAnswer
    };
    
    questions.push(newQuizQuestion);
    });*/