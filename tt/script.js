const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const toggleModeButton = document.getElementById('toggle-mode');

let currentPlayer = 'X'; // Human player
let gameActive = true;
let playAgainstAI = false; // New state to track AI mode
const boardState = ['','','','','','','','',''];

function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);
    
    if (boardState[index] !== '' || !gameActive || (playAgainstAI && currentPlayer === 'O')) return; // AI's turn

    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        status.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
    } else if (boardState.every(cell => cell !== '')) {
        status.textContent = 'Draw!';
        gameActive = false;
    } else {
        if (playAgainstAI) {
            currentPlayer = 'O'; // Switch to AI
            status.textContent = "AI's Turn";
            setTimeout(aiMove, 500); // Delay AI move for better user experience
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch to other player
            status.textContent = `${currentPlayer}'s Turn`;
        }
    }
}

function aiMove() {
    if (!gameActive) return;

    // Find all empty cells
    const emptyIndices = boardState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    
    if (emptyIndices.length === 0) return; // No moves left

    // Choose a random empty cell
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
    boardState[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

    if (checkWin()) {
        status.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
    } else if (boardState.every(cell => cell !== '')) {
        status.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = 'X'; // Switch to human
        status.textContent = `${currentPlayer}'s Turn`;
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

function resetGame() {
    boardState.fill('');
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X'; // Human starts first
    gameActive = true;
    status.textContent = `${currentPlayer}'s Turn`;
}

function toggleMode() {
    playAgainstAI = !playAgainstAI;
    resetGame(); // Reset the game when toggling mode
    toggleModeButton.textContent = playAgainstAI ? 'Play vs Human' : 'Play vs AI';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
toggleModeButton.addEventListener('click', toggleMode);

// Initialize the game status
status.textContent = `${currentPlayer}'s Turn`;
toggleModeButton.textContent = 'Play vs AI'; // Default mode
