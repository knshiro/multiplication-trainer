// Get elements
const levelInput = document.getElementById('level-input');
const saveLevelBtn = document.getElementById('save-level');
const currentLevelDisplay = document.getElementById('current-level');
const sessionSetup = document.getElementById('session-setup');
const levelSelection = document.getElementById('level-selection');
const sessionCountInput = document.getElementById('session-count');
const startSessionBtn = document.getElementById('start-session');
const quizSection = document.getElementById('quiz-section');
const questionDisplay = document.getElementById('question-display');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer');
const feedback = document.getElementById('feedback');
const questionCounter = document.getElementById('question-counter');
const resultSection = document.getElementById('result-section');
const resultSummary = document.getElementById('result-summary');
const restartSessionBtn = document.getElementById('restart-session');
const parentSummary = document.getElementById('parent-summary');
const changeLevelBtn = document.getElementById('change-level');

let level = localStorage.getItem('level') || null;
let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let sessionAnswers = [];

// Display current level
if (level) {
    currentLevelDisplay.textContent = `Current Level: ${level}`;
    levelSelection.classList.add('hidden');
    sessionSetup.classList.remove('hidden');
    changeLevelBtn.classList.remove('hidden');
}

// Save level
saveLevelBtn.addEventListener('click', () => {
    level = parseInt(levelInput.value);
    if (level >= 1 && level <= 12) {
        localStorage.setItem('level', level);
        currentLevelDisplay.textContent = `Current Level: ${level}`;
        levelSelection.classList.add('hidden');
        sessionSetup.classList.remove('hidden');
        changeLevelBtn.classList.remove('hidden');
    } else {
        alert('Please enter a level between 1 and 12.');
    }
});

// Change level
changeLevelBtn.addEventListener('click', () => {
    levelSelection.classList.remove('hidden');
    sessionSetup.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    changeLevelBtn.classList.add('hidden');
    levelInput.value = level;
});

// Start session
startSessionBtn.addEventListener('click', () => {
    const count = parseInt(sessionCountInput.value);
    if (count > 0) {
        generateQuestions(count);
        sessionSetup.classList.add('hidden');
        quizSection.classList.remove('hidden');
        displayQuestion();
    } else {
        alert('Please enter a valid number of questions.');
    }
});

// Generate questions
function generateQuestions(count) {
    questions = [];
    for (let i = 0; i < count; i++) {
        const a = Math.floor(Math.random() * level) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        questions.push({ a, b });
    }
}

// Display question
function displayQuestion() {
    const q = questions[currentQuestion];
    questionDisplay.textContent = `${q.a} x ${q.b} = ?`;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    answerInput.value = '';
    feedback.textContent = '';
}

// Submit answer
submitAnswerBtn.addEventListener('click', () => {
    const q = questions[currentQuestion];
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = q.a * q.b;

    if (userAnswer === correctAnswer) {
        feedback.style.color = '#32cd32';
        feedback.textContent = 'Correct!';
        correctAnswers++;
    } else {
        feedback.style.color = '#ff4500';
        feedback.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
    }

    sessionAnswers.push({
        question: `${q.a} x ${q.b}`,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer
    });

    currentQuestion++;
    if (currentQuestion < questions.length) {
        setTimeout(displayQuestion, 1000);
    } else {
        setTimeout(showResults, 1000);
    }
});

// Show results
function showResults() {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    const totalQuestions = questions.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    resultSummary.textContent = `You got ${correctAnswers} out of ${totalQuestions} correct (${percentage}%).`;

    // Update parent summary
    updateParentSummary();
}

// Restart session
restartSessionBtn.addEventListener('click', () => {
    currentQuestion = 0;
    correctAnswers = 0;
    sessionAnswers = [];
    resultSection.classList.add('hidden');
    sessionSetup.classList.remove('hidden');
});

// Update parent summary
function updateParentSummary() {
    const total = sessionAnswers.length;
    const correct = sessionAnswers.filter(ans => ans.isCorrect).length;
    parentSummary.textContent = `Last session: ${correct} out of ${total} correct.`;
}
