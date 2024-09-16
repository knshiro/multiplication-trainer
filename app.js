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
const parentAccessBtn = document.getElementById('parent-access');
const backToChildModeBtn = document.getElementById('back-to-child-mode');
const historyContainer = document.getElementById('history-container');
const sessionDetailsContainer = document.getElementById('session-details');

let level = localStorage.getItem('level') || null;
let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let sessionAnswers = [];
let sessionHistory = JSON.parse(localStorage.getItem('sessionHistory')) || [];

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
    answerInput.focus(); // Focus on the answer input
}

// Add event listener for Enter key on answer input
answerInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});

// Submit answer function (extracted from the click event listener)
function submitAnswer() {
    const q = questions[currentQuestion];
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = q.a * q.b;

    if (userAnswer === correctAnswer) {
        feedback.style.color = '#32cd32';
        feedback.textContent = 'Correct!';
        correctAnswers++;
        setTimeout(moveToNextQuestion, 1000);
    } else {
        feedback.style.color = '#ff4500';
        feedback.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        setTimeout(moveToNextQuestion, 5000); // Increased to 5 seconds
    }

    sessionAnswers.push({
        question: `${q.a} x ${q.b}`,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer
    });
}

function moveToNextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// Update submit answer button event listener
submitAnswerBtn.addEventListener('click', submitAnswer);

// Show results
function showResults() {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    const totalQuestions = questions.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    resultSummary.textContent = `You got ${correctAnswers} out of ${totalQuestions} correct (${percentage}%).`;

    // Save session data
    const sessionData = {
        date: new Date().toLocaleString(),
        level: level,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        percentage: percentage,
        answers: sessionAnswers
    };
    sessionHistory.push(sessionData);
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));

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
    if (sessionHistory.length > 0) {
        const lastSession = sessionHistory[sessionHistory.length - 1];
        parentSummary.textContent = `Last session: ${lastSession.correctAnswers} out of ${lastSession.totalQuestions} correct (${lastSession.percentage}%).`;
    } else {
        parentSummary.textContent = 'No sessions completed yet.';
    }
}

// Add new function to display session history
function displaySessionHistory() {
    historyContainer.innerHTML = '';

    sessionHistory.forEach((session, index) => {
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('session-item');
        sessionElement.innerHTML = `
            <h3>Session ${index + 1} - ${session.date}</h3>
            <p>Level: ${session.level}</p>
            <p>Score: ${session.correctAnswers}/${session.totalQuestions} (${session.percentage}%)</p>
            <button class="view-details" data-index="${index}">View Details</button>
        `;
        historyContainer.appendChild(sessionElement);
    });

    // Add event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const sessionIndex = e.target.getAttribute('data-index');
            displaySessionDetails(sessionIndex);
        });
    });
}

// Add new function to display session details
function displaySessionDetails(index) {
    const session = sessionHistory[index];
    sessionDetailsContainer.innerHTML = `
        <h3>Session Details</h3>
        <p>Date: ${session.date}</p>
        <p>Level: ${session.level}</p>
        <p>Score: ${session.correctAnswers}/${session.totalQuestions} (${session.percentage}%)</p>
        <h4>Questions and Answers:</h4>
        <ul>
            ${session.answers.map(answer => `
                <li>
                    ${answer.question} = ${answer.userAnswer}
                    ${answer.isCorrect ? '✅' : `❌ (Correct: ${answer.correctAnswer})`}
                </li>
            `).join('')}
        </ul>
    `;
    sessionDetailsContainer.classList.remove('hidden');
}

// Add event listener for the parent access button
parentAccessBtn.addEventListener('click', () => {
    document.getElementById('parent-section').classList.add('hidden');
    document.getElementById('history-section').classList.remove('hidden');
    displaySessionHistory();
});

// Add event listener for the back to child mode button
backToChildModeBtn.addEventListener('click', () => {
    document.getElementById('history-section').classList.add('hidden');
    document.getElementById('session-details').classList.add('hidden');
    document.getElementById('parent-section').classList.remove('hidden');
});

// Add keyboard navigation for buttons
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.click();
    }
});
