import { timelineData, flashcards, quizData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
    renderFlashcards();
    setupChat();
    setupQuiz();
});

function renderTimeline() {
    const container = document.getElementById('timeline-list');
    if (!container) return;

    container.innerHTML = timelineData.map(item => `
        <div class="timeline-item">
            <div class="timeline-card">
                <span class="timeline-date">${item.date}</span>
                <h3>${item.stage}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
}

function renderFlashcards() {
    const grid = document.getElementById('flashcards-grid');
    if (!grid) return;

    grid.innerHTML = flashcards.map(card => `
        <div class="flashcard">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <h3>${card.term}</h3>
                    <p class="tap-hint">Tap to flip</p>
                </div>
                <div class="flashcard-back">
                    <p>${card.definition}</p>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.flashcard').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

function setupQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const startDiv = document.getElementById('quiz-start');
    const contentDiv = document.getElementById('quiz-content');
    const resultDiv = document.getElementById('quiz-result');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const progressEl = document.getElementById('quiz-progress');
    const scoreEl = document.getElementById('quiz-score');

    let currentQuestionIndex = 0;
    let score = 0;

    const showQuestion = () => {
        const question = quizData[currentQuestionIndex];
        questionEl.textContent = question.question;
        optionsEl.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => handleAnswer(index, btn);
            optionsEl.appendChild(btn);
        });

        progressEl.style.width = `${(currentQuestionIndex / quizData.length) * 100}%`;
    };

    const handleAnswer = (selectedIndex, btn) => {
        const question = quizData[currentQuestionIndex];
        const allBtns = optionsEl.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedIndex === question.correct) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            allBtns[question.correct].classList.add('correct');
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                showQuestion();
            } else {
                showResult();
            }
        }, 1500);
    };

    const showResult = () => {
        contentDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
        progressEl.style.width = '100%';
    };

    startBtn.onclick = () => {
        startDiv.classList.add('hidden');
        contentDiv.classList.remove('hidden');
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    };

    restartBtn.onclick = () => {
        resultDiv.classList.add('hidden');
        startDiv.classList.remove('hidden');
    };
}

function setupChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messages = document.getElementById('chat-messages');
    const chips = document.querySelectorAll('.chip');

    if (!input || !sendBtn || !messages) return;

    const sendMessage = (text) => {
        const query = text || input.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        if (!text) input.value = '';

        setTimeout(() => {
            const response = getMockResponse(query);
            addMessage(response, 'system');
        }, 800);
    };

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => sendMessage(chip.textContent));
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }
}

function getMockResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('register')) {
        return "To register as a voter in India, you must be a citizen and 18+ years old. You can apply online via the Voters' Service Portal (NVSP) or the Voter Helpline App by filling Form 6.";
    }
    if (q.includes('mcc') || q.includes('code of conduct')) {
        return "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI for the conduct of political parties and candidates. It ensures free and fair elections and comes into effect as soon as the election schedule is announced.";
    }
    if (q.includes('evm')) {
        return "Electronic Voting Machines (EVMs) are used to record votes. They consist of a Balloting Unit and a Control Unit. Since 2019, VVPATs are also attached to every EVM for transparency.";
    }
    if (q.includes('eci') || q.includes('commission')) {
        return "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India. It manages everything from voter lists to counting day.";
    }
    if (q.includes('process') || q.includes('how')) {
        return "The Indian election process starts with the announcement by ECI, followed by nominations, scrutiny, campaigning, polling in phases, and finally the counting of votes. Check our 'Election Roadmap' section for a visual guide!";
    }
    if (q.includes('nota')) {
        return "NOTA stands for 'None of the Above'. It's an option on the EVM that allows voters to express their lack of support for all candidates in their constituency.";
    }
    if (q.includes('namaste') || q.includes('hello') || q.includes('hi')) {
        return "Namaste! I'm here to help you understand the Indian Election System. You can ask about EVMs, registration, or the voting process.";
    }
    
    return "That's an interesting point about the Indian electoral system! I can provide more details on voter registration, the Role of ECI, or how EVMs work. Which would you like to explore?";
}
