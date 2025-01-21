let gameMode;
let numPlayers;
let playerNames = [];
let scores = [];
let currentPlayer = 0;
let matchHistory = [];
let selectedMultiplier = 1; // Global variable to store the selected multiplier

// Function to set up the player names section
function setupPlayerNames() {
    const playerNamesDiv = document.getElementById('player-names');
    playerNamesDiv.innerHTML = ''; // Clear existing content

    for (let i = 1; i <= numPlayers; i++) {
        const label = document.createElement('label');
        label.textContent = `Player ${i} Name:`;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player${i}-name`;
        input.value = `Player ${i}`;
        playerNamesDiv.appendChild(label);
        playerNamesDiv.appendChild(input);
    }
}

// Event listener for when the number of players changes
document.getElementById('num-players').addEventListener('change', function() {
    numPlayers = parseInt(this.value);
    setupPlayerNames();
});

// Event listener for DOMContentLoaded to initialize player names setup
document.addEventListener('DOMContentLoaded', function() {
    numPlayers = parseInt(document.getElementById('num-players').value); // Initialize with default value
    setupPlayerNames(); // Setup player names input fields
});

function startGame() {
    gameMode = document.getElementById('game-mode').value;
    numPlayers = parseInt(document.getElementById('num-players').value);
    playerNames = [];
    scores = [];
    currentPlayer = 0;

    for (let i = 1; i <= numPlayers; i++) {
        const playerName = document.getElementById(`player${i}-name`).value || `Player ${i}`;
        playerNames.push(playerName);
        scores.push(gameMode === 'cricket' ? 0 : parseInt(gameMode)); // Cricket starts at 0, others at game mode value
    }

    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('game-title').textContent = `${gameMode} Game`;

    renderScoreboard();
}

function renderScoreboard() {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = '';

    for (let i = 0; i < numPlayers; i++) {
        const playerSection = document.createElement('div');
        playerSection.classList.add('player-section');
        if (i === currentPlayer) {
            playerSection.style.backgroundColor = '#f0f0f0'; // Highlight current player
        }
        playerSection.innerHTML = `
            <div class="player-name">${playerNames[i]}</div>
            <div class="player-score" id="player-score-${i}">${scores[i]}</div>
        `;
        playersContainer.appendChild(playerSection);
    }
}

// Functions to handle score input from buttons
function handleScoreInput(value) {
    // This function is called when a number button is clicked
    // 'value' is the number clicked (e.g., 1, 20, 25)
    updateScore(value, selectedMultiplier);
    selectedMultiplier = 1; // Reset multiplier to 1 (single)
    resetMultiplierButtons(); // Reset the appearance of multiplier buttons
}

function selectMultiplier(multiplier) {
    // This function is called when the Double or Triple button is clicked
    selectedMultiplier = multiplier;
    updateMultiplierButtons(multiplier); // Update button appearance
}

function updateMultiplierButtons(multiplier) {
    const doubleButton = document.getElementById('doubleButton');
    const tripleButton = document.getElementById('tripleButton');

    // Reset buttons to default style
    doubleButton.classList.remove('selected');
    tripleButton.classList.remove('selected');

    // Highlight the selected button
    if (multiplier === 2) {
        doubleButton.classList.add('selected');
    } else if (multiplier === 3) {
        tripleButton.classList.add('selected');
    }
}

function resetMultiplierButtons() {
    document.getElementById('doubleButton').classList.remove('selected');
    document.getElementById('tripleButton').classList.remove('selected');
}

function updateScore(value, multiplier) {
    const score = value * multiplier;

    if (gameMode === 'cricket') {
        // Implement Cricket scoring logic here
    } else { // X01 games
        scores[currentPlayer] -= score;
        if (scores[currentPlayer] < 0) {
            scores[currentPlayer] += score; // Bust, revert score
        }
    }

    document.getElementById(`player-score-${currentPlayer}`).textContent = scores[currentPlayer];
    checkForWinner();
}

// Attach event listeners to score buttons
const scoreButtons = document.querySelectorAll('.score-buttons button');
scoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = parseInt(button.dataset.value) || parseInt(button.dataset.score); // Use score for 25, miss

        if (button.id === 'doubleButton') {
            selectMultiplier(2); // Select Double
        } else if (button.id === 'tripleButton') {
            selectMultiplier(3); // Select Triple
        } else {
            handleScoreInput(value); // Handle as a regular score input
        }
    });
});

function miss() {
    handleScoreInput(0);
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % numPlayers;
    renderScoreboard();
}

function undo() {
    // Implement undo functionality based on game mode and history
}

function endGame() {
    recordMatch();
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('game-setup').style.display = 'block';
}

function checkForWinner() {
    if (gameMode !== 'cricket' && scores[currentPlayer] === 0) {
        alert(`${playerNames[currentPlayer]} wins!`);
        endGame();
    }
    // Add Cricket winner logic if necessary
}

function recordMatch() {
    const matchRecord = {
        gameMode: gameMode,
        players: playerNames.map((name, index) => ({ name: name, score: scores[index] })),
        winner: gameMode !== 'cricket' && scores.includes(0) ? playerNames[scores.indexOf(0)] : 'N/A'
    };
    matchHistory.push(matchRecord);
    updateMatchHistory();
}

function updateMatchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    matchHistory.forEach(match => {
        const li = document.createElement('li');
        const winnerText = match.winner !== 'N/A' ? `Winner: ${match.winner}` : 'Incomplete';
        li.textContent = `${match.gameMode} - ${match.players.map(p => `${p.name}: ${p.score}`).join(', ')} - ${winnerText}`;
        historyList.appendChild(li);
    });
}