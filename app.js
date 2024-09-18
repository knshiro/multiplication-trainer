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
const languageSelect = document.getElementById('language-select');

// Add these constants at the top of your file, after the element selections
const SESSIONS_PER_PAGE = 5;
let currentPage = 1;

let level = localStorage.getItem('level') || null;
let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let sessionAnswers = [];
let sessionHistory = JSON.parse(localStorage.getItem('sessionHistory')) || [];

// Display current level
if (level) {
    currentLevelDisplay.textContent = `${translations[currentLanguage].level}: ${level}`;
    levelSelection.classList.add('hidden');
    sessionSetup.classList.remove('hidden');
    changeLevelBtn.classList.remove('hidden');
}

// Update the level validation
saveLevelBtn.addEventListener('click', () => {
    level = parseInt(levelInput.value);
    if (level >= 2 && level <= 10) {
        localStorage.setItem('level', level);
        currentLevelDisplay.textContent = `${translations[currentLanguage].level}: ${level}`;
        levelSelection.classList.add('hidden');
        sessionSetup.classList.remove('hidden');
        changeLevelBtn.classList.remove('hidden');
        sessionCountInput.focus(); // Focus on the session count input
    } else {
        alert(translations[currentLanguage].enterLevel);
    }
});

// Add event listener for Enter key on level input
levelInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        saveLevelBtn.click();
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
    levelInput.focus();
    
    // Reset session variables
    currentQuestion = 0;
    correctAnswers = 0;
    sessionAnswers = [];
    questions = [];
});

// Add this new function to focus on the session count input
function focusSessionCountInput() {
    sessionCountInput.focus();
}

// Modify the window load event listener
window.addEventListener('load', async () => {
    await setLanguage(detectLanguage());
    languageSelect.value = currentLanguage;
    
    if (!level) {
        levelInput.focus();
    } else {
        focusSessionCountInput();
    }
});

// Start session
startSessionBtn.addEventListener('click', () => {
    const count = parseInt(sessionCountInput.value);
    if (count > 0) {
        // Reset session variables
        currentQuestion = 0;
        correctAnswers = 0;
        sessionAnswers = [];
        
        generateQuestions(count);
        sessionSetup.classList.add('hidden');
        quizSection.classList.remove('hidden');
        displayQuestion();
    } else {
        alert(translations[currentLanguage].enterLevel);
    }
});

// Update the session count validation and add Enter key support
sessionCountInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        startSessionBtn.click();
    }
});

// Generate questions
function generateQuestions(count) {
    questions = [];
    for (let i = 0; i < count; i++) {
        const a = Math.floor(Math.random() * (level - 1)) + 2; // This ensures a is between 2 and level
        const b = Math.floor(Math.random() * 9) + 2; // This ensures b is between 2 and 10
        questions.push({ a, b });
    }
}

// Display question
function displayQuestion() {
    const q = questions[currentQuestion];
    questionDisplay.textContent = `${q.a} x ${q.b} = ?`;
    questionCounter.textContent = `${translations[currentLanguage].question} ${currentQuestion + 1} ${translations[currentLanguage].outOf} ${questions.length}`;
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
        feedback.textContent = translations[currentLanguage].correct;
        correctAnswers++;
        setTimeout(moveToNextQuestion, 1000);
    } else {
        feedback.style.color = '#ff4500';
        feedback.textContent = `${translations[currentLanguage].incorrect} ${correctAnswer}.`;
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
    resultSummary.textContent = `${translations[currentLanguage].sessionComplete} ${correctAnswers} ${translations[currentLanguage].outOf} ${totalQuestions} ${translations[currentLanguage].correct2} (${percentage}%).`;

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
    focusSessionCountInput();
});

// Update parent summary
function updateParentSummary() {
    if (sessionHistory.length > 0) {
        const lastSession = sessionHistory[sessionHistory.length - 1];
        parentSummary.textContent = `${translations[currentLanguage].lastSession} ${lastSession.correctAnswers} ${translations[currentLanguage].outOf} ${lastSession.totalQuestions} ${translations[currentLanguage].correct2} (${lastSession.percentage}%).`;
    } else {
        parentSummary.textContent = translations[currentLanguage].noSessionsYet;
    }
}

// Add new function to display session history
function displaySessionHistory(append = false) {
    if (!append) {
        historyContainer.innerHTML = '';
        sessionDetailsContainer.innerHTML = ''; // Clear previous details
    }

    // Sort sessions by date descending
    const sortedSessions = sessionHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    const startIndex = (currentPage - 1) * SESSIONS_PER_PAGE;
    const endIndex = startIndex + SESSIONS_PER_PAGE;
    const sessionsToDisplay = sortedSessions.slice(startIndex, endIndex);

    sessionsToDisplay.forEach((session, index) => {
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('session-item');
        sessionElement.innerHTML = `
            <h3>${translations[currentLanguage].sessionHistory} ${sortedSessions.length - (startIndex + index)} - ${session.date}</h3>
            <p>${translations[currentLanguage].level} ${session.level}</p>
            <p>${translations[currentLanguage].score} ${session.correctAnswers}/${session.totalQuestions} (${session.percentage}%)</p>
            <button class="view-details" data-index="${startIndex + index}" data-i18n="viewDetails">${translations[currentLanguage].viewDetails}</button>
        `;
        historyContainer.appendChild(sessionElement);
    });

    // Remove existing "Load More" button if it exists
    const existingLoadMoreButton = document.getElementById('load-more');
    if (existingLoadMoreButton) {
        existingLoadMoreButton.remove();
    }

    // Add "Load More" button if there are more sessions
    if (endIndex < sortedSessions.length) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = translations[currentLanguage].loadMore;
        loadMoreButton.id = 'load-more';
        loadMoreButton.addEventListener('click', loadMoreSessions);
        historyContainer.appendChild(loadMoreButton);
    }

    // Add event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const sessionIndex = e.target.getAttribute('data-index');
            displaySessionDetails(sessionIndex);
        });
    });
}

// Add a new function to load more sessions
function loadMoreSessions() {
    currentPage++;
    displaySessionHistory(true);
}

// Modify the parentAccessBtn event listener
parentAccessBtn.addEventListener('click', () => {
    document.getElementById('parent-section').classList.add('hidden');
    document.getElementById('history-section').classList.remove('hidden');
    currentPage = 1; // Reset to first page when accessing history
    displaySessionHistory(false);
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

// Modify the displaySessionDetails function
function displaySessionDetails(index) {
    const session = sessionHistory[index];
    sessionDetailsContainer.innerHTML = `
        <div class="overlay">
            <div class="popup">
                <h3 data-i18n="sessionHistory">${translations[currentLanguage].sessionHistory}</h3>
                <p>${translations[currentLanguage].date} ${session.date}</p>
                <p>${translations[currentLanguage].level} ${session.level}</p>
                <p>${translations[currentLanguage].score} ${session.correctAnswers}/${session.totalQuestions} (${session.percentage}%)</p>
                <h4 data-i18n="questionsAndAnswers">${translations[currentLanguage].questionsAndAnswers}</h4>
                <ul>
                    ${session.answers.map(answer => `
                        <li>
                            ${answer.question} = ${answer.userAnswer}
                            ${answer.isCorrect ? '✅' : `❌ (${translations[currentLanguage].correct}: ${answer.correctAnswer})`}
                        </li>
                    `).join('')}
                </ul>
                <button id="hide-details" data-i18n="close">${translations[currentLanguage].close}</button>
            </div>
        </div>
    `;
    sessionDetailsContainer.classList.add('visible');
    translatePage();

    // Add event listener for the hide details button
    document.getElementById('hide-details').addEventListener('click', hideSessionDetails);

    // Add event listener to close the popup when clicking outside
    sessionDetailsContainer.querySelector('.overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay')) {
            hideSessionDetails();
        }
    });
}

function hideSessionDetails() {
    sessionDetailsContainer.classList.remove('visible');
}

// Add this after the languageSelect definition
languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
});
