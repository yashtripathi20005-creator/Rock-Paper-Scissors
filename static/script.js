// DOM Elements
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const resultMessageEl = document.getElementById('result-message');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const tieScoreEl = document.getElementById('tie-score');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('reset-btn');

// State
let scores = {
    player: 0,
    computer: 0,
    tie: 0
};

// Event Listeners
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.dataset.choice;
        playGame(choice);
    });
});

resetBtn.addEventListener('click', resetScore);

// Game Functions
async function playGame(playerChoice) {
    // Disable buttons during request
    setButtonsDisabled(true);
    
    try {
        const response = await fetch('/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ choice: playerChoice })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        updateUI(data);
        updateScore(data.result);
        
    } catch (error) {
        console.error('Error:', error);
        resultMessageEl.textContent = 'Oops! Something went wrong. 😅';
        resultMessageEl.style.color = '#ff6b6b';
    } finally {
        setButtonsDisabled(false);
    }
}

function updateUI(data) {
    // Update choice displays
    const playerEmoji = playerChoiceEl.querySelector('.choice-emoji');
    const computerEmoji = computerChoiceEl.querySelector('.choice-emoji');
    
    // Add animation
    playerEmoji.classList.remove('animate-shake');
    computerEmoji.classList.remove('animate-shake');
    
    // Trigger reflow for animation restart
    void playerEmoji.offsetWidth;
    
    playerEmoji.textContent = data.player_emoji;
    computerEmoji.textContent = data.computer_emoji;
    
    playerEmoji.classList.add('animate-shake');
    computerEmoji.classList.add('animate-shake');
    
    // Update result message with color
    resultMessageEl.textContent = data.message;
    resultMessageEl.classList.remove('animate-fade');
    void resultMessageEl.offsetWidth;
    resultMessageEl.classList.add('animate-fade');
    
    // Set result color
    if (data.result === 'win') {
        resultMessageEl.style.color = '#00b894';
    } else if (data.result === 'lose') {
        resultMessageEl.style.color = '#ff6b6b';
    } else {
        resultMessageEl.style.color = '#fdcb6e';
    }
    
    // Highlight selected button
    choiceButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.choice === data.player_choice) {
            btn.classList.add('selected');
        }
    });
}

function updateScore(result) {
    if (result === 'win') {
        scores.player++;
        playerScoreEl.textContent = scores.player;
        // Add animation to score
        playerScoreEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
            playerScoreEl.style.transform = 'scale(1)';
        }, 200);
    } else if (result === 'lose') {
        scores.computer++;
        computerScoreEl.textContent = scores.computer;
        computerScoreEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
            computerScoreEl.style.transform = 'scale(1)';
        }, 200);
    } else if (result === 'tie') {
        scores.tie++;
        tieScoreEl.textContent = scores.tie;
        tieScoreEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
            tieScoreEl.style.transform = 'scale(1)';
        }, 200);
    }
}

function resetScore() {
    scores.player = 0;
    scores.computer = 0;
    scores.tie = 0;
    
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    tieScoreEl.textContent = '0';
    
    // Reset UI
    playerChoiceEl.querySelector('.choice-emoji').textContent = '❓';
    computerChoiceEl.querySelector('.choice-emoji').textContent = '❓';
    resultMessageEl.textContent = 'Score reset! Make your move.';
    resultMessageEl.style.color = '#333';
    
    choiceButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Send reset request to server (optional)
    fetch('/reset_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error('Reset error:', error));
}

function setButtonsDisabled(disabled) {
    choiceButtons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.6' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const keyMap = {
        '1': 'rock',
        '2': 'paper',
        '3': 'scissors',
        'r': 'rock',
        'p': 'paper',
        's': 'scissors'
    };
    
    const choice = keyMap[e.key.toLowerCase()];
    if (choice) {
        e.preventDefault();
        playGame(choice);
    }
    
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetScore();
    }
});

// Initial state
console.log('🎮 Rock Paper Scissors loaded!');
console.log('🖱️ Click buttons or use keyboard: 1/R=Rock, 2/P=Paper, 3/S=Scissors');
console.log('⌨️ Ctrl+R to reset score');
