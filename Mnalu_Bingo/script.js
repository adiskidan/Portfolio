// Mnalu_Bingo - Interactive Bingo Game JavaScript with Sound Effects

let calledNumbers = [];
let currentPlayer = null;
let gameActive = false;
let bingoCards = {};
let soundEnabled = true;

// Enhanced sound system with letter announcements
function playSound(type, letter = null, number = null) {
    if (!soundEnabled) return;
    
    try {
        // Create audio context for better browser compatibility
        const audio = new Audio();
        
        // Use different frequencies for different sounds
        switch(type) {
            case 'call':
                // Create number calling sound
                audio.src = createBeepSound(800, 0.3);
                break;
            case 'letter':
                // Create letter announcement sound
                audio.src = createBeepSound(600, 0.2);
                break;
            case 'win':
                // Create a victory sound
                audio.src = createBeepSound(1200, 0.5);
                break;
            case 'bingo':
                // Create a marking sound
                audio.src = createBeepSound(400, 0.15);
                break;
            case 'error':
                // Create an error sound
                audio.src = createBeepSound(300, 0.2);
                break;
        }
        
        audio.volume = 0.7;
        
        // Play with error handling
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log('Sound play failed:', e);
                // Try fallback
                tryFallbackSound();
            });
        }
        
        // Announce letter and number with speech
        if (letter && number) {
            announceLetterAndNumber(letter, number);
        }
        
    } catch (error) {
        console.log('Audio error:', error);
        // Visual feedback as fallback
        showVisualFeedback(type);
    }
}

// Announce letter and number with speech synthesis
function announceLetterAndNumber(letter, number) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Announce letter first
        const letterUtterance = new SpeechSynthesisUtterance(letter);
        letterUtterance.rate = 0.8;
        letterUtterance.pitch = 1.2;
        letterUtterance.volume = 0.8;
        letterUtterance.lang = 'en-US';
        
        // Then announce number
        const numberUtterance = new SpeechSynthesisUtterance(number.toString());
        numberUtterance.rate = 0.9;
        numberUtterance.pitch = 1.1;
        numberUtterance.volume = 0.8;
        numberUtterance.lang = 'en-US';
        
        // Speak letter, then number
        setTimeout(() => {
            window.speechSynthesis.speak(letterUtterance);
        }, 100);
        
        setTimeout(() => {
            window.speechSynthesis.speak(numberUtterance);
        }, 800);
    }
}

// Create simple beep sound using Web Audio API
function createBeepSound(frequency, duration) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.setValueAtTime(0, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        return 'data:audio/wav;base64,UklGRnoGAABXRUJRUgEr';
    } catch (error) {
        console.log('Beep creation failed:', error);
        return 'data:audio/wav;base64,UklGRnoGAABXRUJRUgEr';
    }
}

// Visual feedback for sound issues
function showVisualFeedback(type) {
    const feedback = document.createElement('div');
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.padding = '15px 25px';
    feedback.style.borderRadius = '10px';
    feedback.style.zIndex = '9999';
    
    switch(type) {
        case 'call':
            feedback.style.background = 'linear-gradient(135deg, #4a148c 0%, #c0392b 100%)';
            feedback.innerHTML = '<i class="fas fa-bullhorn"></i> Number Called';
            break;
        case 'win':
            feedback.style.background = 'linear-gradient(135deg, #28a745 0%, #155724 100%)';
            feedback.innerHTML = '<i class="fas fa-trophy"></i> BINGO!';
            break;
        case 'bingo':
            feedback.style.background = 'linear-gradient(135deg, #17a2b8 0%, #28a745 100%)';
            feedback.innerHTML = '<i class="fas fa-check-circle"></i> Number Marked';
            break;
        case 'error':
            feedback.style.background = 'linear-gradient(135deg, #f5c6cb 0%, #721c24 100%)';
            feedback.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
            break;
    }
    
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// Fallback sound using HTML5 audio
function tryFallbackSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXRUJRUgEr');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Fallback sound failed:', e));
    } catch (error) {
        console.log('Fallback sound failed:', error);
    }
}

// Initialize game
function initGame() {
    generateBingoCards();
    updateDisplay();
}

// Generate Ethiopian bingo cards with B-I-N-G-O structure
function generateBingoCards() {
    // B-I-N-G-O column ranges
    const bingoRanges = {
        'B': [1, 15],    // 1-15
        'I': [16, 30],   // 16-30
        'N': [31, 45],   // 31-45
        'G': [46, 60],   // 46-60
        'O': [61, 75]    // 61-75
    };
    
    // Use specific bingo numbers as requested
    const specificNumbers = [23, 45, 54, 9]; // B, I, N, G
    const numbers = [];
    
    // Add specific numbers first
    specificNumbers.forEach(num => numbers.push(num));
    
    // Fill remaining numbers randomly
    for (let i = 1; i <= 75; i++) {
        if (!specificNumbers.includes(i)) {
            numbers.push(i);
        }
    }
    
    // Shuffle all numbers
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    // Create bingo cards with proper B-I-N-G-O structure
    const cardCount = 2;
    for (let i = 0; i < cardCount; i++) {
        const card = [];
        const letters = ['B', 'I', 'N', 'G', 'O'];
        
        for (let col = 0; col < 5; col++) {
            const column = [];
            for (let row = 0; row < 5; row++) {
                const letter = letters[col];
                const range = bingoRanges[letter];
                
                let cellValue;
                if (col === 2 && row === 2) {
                    cellValue = 'FREE'; // Center free space
                } else {
                    // Get random number from appropriate range
                    const rangeNumbers = numbers.filter(n => n >= range[0] && n <= range[1]);
                    if (rangeNumbers.length > 0) {
                        const randomIndex = Math.floor(Math.random() * rangeNumbers.length);
                        cellValue = rangeNumbers[randomIndex];
                        // Remove used number
                        const usedIndex = numbers.indexOf(cellValue);
                        if (usedIndex !== -1) {
                            numbers.splice(usedIndex, 1);
                        }
                    } else {
                        cellValue = range[0] + row; // Fallback
                    }
                    
                    // Use specific numbers for key positions
                    if (cellValue === 23 && letter === 'B') cellValue = 23; // B
                    else if (cellValue === 45 && letter === 'I') cellValue = 45; // I
                    else if (cellValue === 54 && letter === 'N') cellValue = 54; // N
                    else if (cellValue === 9 && letter === 'G') cellValue = 9;  // G
                }
                
                column.push(cellValue);
            }
            card.push(column);
        }
        bingoCards[`player${i + 1}`] = card;
    }
}

// Start new game
function startGame() {
    gameActive = true;
    calledNumbers = [];
    currentPlayer = 'player1';
    generateBingoCards();
    displayBingoCards();
    showMessage('Game started! Good luck!', 'success');
}

// Call a random number with B-I-N-G-O letter announcement
function callNumber() {
    if (!gameActive) {
        playSound('error');
        showMessage('Please start the Game first!', 'error');
        return;
    }
    
    if (calledNumbers.length >= 75) {
        playSound('error');
        showMessage('All numbers have been called!', 'error');
        return;
    }
    
    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(number));
    
    calledNumbers.push(number);
    updateCalledNumbers();
    checkAutoWin();
    
    try {
        // Determine B-I-N-G-O letter
        let letter;
        if (number >= 1 && number <= 15) letter = 'B';
        else if (number >= 16 && number <= 30) letter = 'I';
        else if (number >= 31 && number <= 45) letter = 'N';
        else if (number >= 46 && number <= 60) letter = 'G';
        else if (number >= 61 && number <= 75) letter = 'O';
        else letter = 'Unknown';
        
        // Play call sound
        playSound('call');
        
        // Announce with letter and number
        showMessage(`🎯 ${letter} ${number} called!`, 'success');
        
        // Announce letter and number with speech
        announceLetterAndNumber(letter, number);
        
    } catch (error) {
        console.log('Sound error:', error);
        showMessage('Sound error, but number called!', 'error');
    }
}

// Update called numbers display
function updateCalledNumbers() {
    const display = document.getElementById('calledNumbers');
    display.innerHTML = calledNumbers.map(num => 
        `<span class="called-number">${num}</span>`
    ).join(' ');
}

// Display bingo cards with B-I-N-G-O letters and proper Ethiopian styling
function displayBingoCards() {
    const board = document.getElementById('bingoBoard');
    if (!board) return;
    
    board.innerHTML = '';
    
    Object.keys(bingoCards).forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'bingo-card';
        playerDiv.innerHTML = `
            <h4>${player}</h4>
            <div class="bingo-header">
                ${['B', 'I', 'N', 'G', 'O'].map(letter => 
                    `<div class="bingo-letter">${letter}</div>`
                ).join('')}
            </div>
            <div class="bingo-grid">
                ${bingoCards[player].map((row, rowIndex) => 
                    `<div class="bingo-row">
                        ${row.map((cell, colIndex) => 
                            `<div class="bingo-cell ${cell === 'FREE' ? 'free-space' : ''}" 
                                 data-player="${player}"
                                 data-row="${rowIndex}" 
                                 data-col="${colIndex}"
                                 onclick="markNumber('${player}', ${rowIndex}, ${colIndex})">
                                ${cell === 'FREE' ? '<i class="fas fa-star"></i>' : cell}
                            </div>`
                        ).join('')}
                    </div>`
                ).join('')}
            </div>
        `;
        board.appendChild(playerDiv);
    });
}

// Mark number on bingo card
function markNumber(player, row, col) {
    if (!gameActive) {
        showMessage('Please start the game first!', 'error');
        return;
    }
    
    const cell = document.querySelector(`[data-player="${player}"][data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    
    const number = bingoCards[player][row][col];
    if (number === 'FREE' || calledNumbers.includes(parseInt(number))) {
        cell.classList.add('marked');
        playSound('bingo');
        checkWin();
    } else {
        showMessage('Number not found on your card!', 'error');
    }
}

// Check for win with proper bingo patterns
function checkWin() {
    if (!gameActive) return;
    
    Object.keys(bingoCards).forEach(player => {
        const card = bingoCards[player];
        let markedCount = 0;
        
        // Check rows
        for (let i = 0; i < 5; i++) {
            if (card[i].every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
                markedCount++;
            }
        }
        
        // Check columns
        for (let i = 0; i < 5; i++) {
            if (card.every(row => row[i] === 'FREE' || calledNumbers.includes(parseInt(row[i])))) {
                markedCount++;
            }
        }
        
        // Check diagonals
        const diagonal1 = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]];
        const diagonal2 = [card[0][4], card[1][3], card[2][2], card[3][1], card[4][0]];
        
        if (diagonal1.every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
            markedCount++;
        }
        if (diagonal2.every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
            markedCount++;
        }
        
        // Check for bingo (5 marks in a row/column/diagonal)
        if (markedCount >= 5) {
            showMessage(`BINGO! ${player} wins!`, 'success');
            playSound('win');
            gameActive = false;
            updateScores(player, true);
            return;
        }
    });
    
    showMessage('Keep playing! No bingo yet.', 'error');
}

// Auto check for wins
function checkAutoWin() {
    // This would contain actual bingo logic in a real implementation
    // For demo, just random check
}

// Reset game
function resetGame() {
    gameActive = false;
    calledNumbers = [];
    currentPlayer = null;
    bingoCards = {};
    
    document.getElementById('calledNumbers').innerHTML = '';
    document.getElementById('bingoBoard').innerHTML = '';
    
    showMessage('Game reset. Ready to start new game!', 'success');
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '15px 20px';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.animation = 'fadeIn 0.5s ease-out';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// Update display
function updateDisplay() {
    // Update game statistics
    updateScores();
}

// Update scores (demo)
function updateScores() {
    const topPlayers = document.getElementById('topPlayers');
    const recentGames = document.getElementById('recentGames');
    
    if (topPlayers) {
        topPlayers.innerHTML = `
            <div class="player-item">
                <i class="fas fa-user"></i> Player1 - 5 wins
            </div>
            <div class="player-item">
                <i class="fas fa-user"></i> Player2 - 3 wins
            </div>
        `;
    }
    
    if (recentGames) {
        recentGames.innerHTML = `
            <div class="game-result">
                <i class="fas fa-trophy"></i> Game 1 - Player1 Won
            </div>
            <div class="game-result">
                <i class="fas fa-medal"></i> Game 2 - Player2 Won
            </div>
        `;
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    const status = document.getElementById('soundStatus');
    status.textContent = soundEnabled ? 'ON' : 'OFF';
    status.style.color = soundEnabled ? '#4a148c' : '#f5c6cb';
}

// Enhanced game features
function checkForBingo(player) {
    const card = bingoCards[player];
    let markedCount = 0;
    let bingoPatterns = [];
    
    // Check rows
    for (let i = 0; i < 5; i++) {
        if (card[i].every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
            markedCount++;
            bingoPatterns.push(`Row ${i + 1}`);
        }
    }
    
    // Check columns
    for (let i = 0; i < 5; i++) {
        if (card.every(row => row[i] === 'FREE' || calledNumbers.includes(parseInt(row[i])))) {
            markedCount++;
            bingoPatterns.push(`Column ${i + 1}`);
        }
    }
    
    // Check diagonals
    const diagonal1 = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]];
    const diagonal2 = [card[0][4], card[1][3], card[2][2], card[3][1], card[4][0]];
    
    if (diagonal1.every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
        markedCount++;
            bingoPatterns.push(`Diagonal 1`);
    }
    if (diagonal2.every(cell => cell === 'FREE' || calledNumbers.includes(parseInt(cell)))) {
        markedCount++;
            bingoPatterns.push(`Diagonal 2`);
    }
    
    // Check for corners (4 corners)
    if (card[0][0] !== 'FREE' && calledNumbers.includes(parseInt(card[0][0]))) markedCount++;
    if (card[0][4] !== 'FREE' && calledNumbers.includes(parseInt(card[0][4]))) markedCount++;
    if (card[4][0] !== 'FREE' && calledNumbers.includes(parseInt(card[4][0]))) markedCount++;
    if (card[4][4] !== 'FREE' && calledNumbers.includes(parseInt(card[4][4]))) markedCount++;
    
    // Full house (all 15 cells)
    const allCells = card.flat().filter(cell => cell !== 'FREE');
    if (allCells.every(cell => calledNumbers.includes(parseInt(cell)))) {
        markedCount = 15;
        bingoPatterns.push('Full House');
    }
    
    if (markedCount >= 5) {
        showMessage(`🎉 BINGO! ${player} wins with ${bingoPatterns.join(', ')}!`, 'success');
        playSound('win');
        gameActive = false;
        updateScores(player, true);
        return true;
    }
    
    return false;
}

// Enhanced start game function
function startGame() {
    gameActive = true;
    calledNumbers = [];
    currentPlayer = 'player1';
    generateBingoCards();
    displayBingoCards();
    showMessage('🎮 Game started! Good luck, ' + currentGameMode + '!', 'success');
    playSound('call');
}

// Game modes
let currentGameMode = 'Standard';
const gameModes = ['Standard', 'Speed', 'Pattern'];

function changeGameMode(mode) {
    currentGameMode = mode;
    showMessage(`Game mode: ${mode}`, 'success');
}

// Enhanced game functions
function quickCall() {
    if (!gameActive) {
        showMessage('Please start game first!', 'error');
        return;
    }
    
    // Call 3 numbers quickly
    for (let i = 0; i < 3; i++) {
        setTimeout(() => callNumber(), i * 1000);
    }
}

function autoMark() {
    if (!gameActive) {
        showMessage('Please start game first!', 'error');
        return;
    }
    
    // Auto-mark called numbers
    Object.keys(bingoCards).forEach(player => {
        const card = bingoCards[player];
        card.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell !== 'FREE' && calledNumbers.includes(parseInt(cell))) {
                    const cellElement = document.querySelector(`[data-player="${player}"][data-row="${rowIndex}"][data-col="${colIndex}"]`);
                    if (cellElement && !cellElement.classList.contains('marked')) {
                        cellElement.classList.add('marked');
                    }
                }
            });
        });
    });
    
    showMessage('Auto-marked all called numbers!', 'success');
    playSound('bingo');
}

function checkAllBingo() {
    if (!gameActive) {
        showMessage('Please start game first!', 'error');
        return;
    }
    
    let anyBingo = false;
    Object.keys(bingoCards).forEach(player => {
        if (checkForBingo(player)) {
            anyBingo = true;
        }
    });
    
    if (!anyBingo) {
        showMessage('No bingo yet for any player!', 'error');
    }
}

// Update game statistics
let gameStartTime = null;
let totalGamesPlayed = 0;

function updateStats() {
    // Update time elapsed
    if (gameStartTime && gameActive) {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeElapsed').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update total games
    document.getElementById('totalGames').textContent = totalGamesPlayed;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Update stats every second
    setInterval(updateStats, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            callNumber();
        } else if (e.key === 'r') {
            resetGame();
        } else if (e.key === 's') {
            toggleSound();
        } else if (e.key === 'q') {
            quickCall();
        } else if (e.key === 'a') {
            autoMark();
        } else if (e.key === 'c') {
            checkAllBingo();
        }
    });
});
