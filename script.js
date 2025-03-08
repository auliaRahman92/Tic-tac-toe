let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('box'));

let playerScore = 0;
let computerScore = 0;
let playerScoreDisplay = document.getElementById('playerScore');
let computerScoreDisplay = document.getElementById('computerScore');

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = 'O';
const X_TEXT = 'X';
let currentPlayer = O_TEXT;
let spaces = Array(9).fill(null);

const playerScoreContainer = document.querySelector('.score-container:first-child');
const computerScoreContainer = document.querySelector('.score-container:last-child');

function updateScore(winner) {
    if (winner === O_TEXT) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        playerScoreDisplay.classList.add('updated');
        playerScoreContainer.classList.add('active');
        computerScoreContainer.classList.remove('active');
    } else if (winner === X_TEXT) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        computerScoreDisplay.classList.add('updated');
        computerScoreContainer.classList.add('active');
        playerScoreContainer.classList.remove('active');
    }

    // Hapus kelas animasi setelah selesai
    setTimeout(() => {
        playerScoreDisplay.classList.remove('updated');
        computerScoreDisplay.classList.remove('updated');
    }, 500);
}

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
}

// Tambahkan fungsi untuk mengecek seri
function isDraw() {
    return spaces.every(space => space !== null);
}

// Modifikasi fungsi boxClicked
function boxClicked(e) {
    const id = e.target.id;
    if (!spaces[id] && currentPlayer === O_TEXT) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon() !== false) {
            playerText.innerText = `${currentPlayer} has won!`;
            let winning_blocks = playerHasWon();
            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);  
            updateScore(currentPlayer);
            return;
        }

        if (isDraw()) {
            playerText.innerText = "Draw!";
            boxes.forEach(box => {
                box.innerText = '';
                setTimeout(() => {
                    restart();
                }, 1000);
            });
            return;
        }

        currentPlayer = X_TEXT;
        botMove();
    }
}

const winningCombos = [
     [0, 1, 2],
     [3, 4, 5],
     [6, 7, 8],
     [0, 3, 6],
     [1, 4, 7],
     [2, 5, 8],
     [0, 4, 8],
     [2, 4, 6]
]

function playerHasWon() {
    for (const conditions of winningCombos){
        let [a, b, c] = conditions; // Destructuring
        
        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c]) ) {
            return [a, b, c];
        }
    }
    return false;
}

function findBestMove() {
    // Cek kemungkinan menang
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        // Cek apakah bot bisa menang
        if (spaces[a] === X_TEXT && spaces[b] === X_TEXT && spaces[c] === null) return c;
        if (spaces[a] === X_TEXT && spaces[c] === X_TEXT && spaces[b] === null) return b;
        if (spaces[b] === X_TEXT && spaces[c] === X_TEXT && spaces[a] === null) return a;
        
        // Cek apakah perlu memblokir pemain
        if (spaces[a] === O_TEXT && spaces[b] === O_TEXT && spaces[c] === null) return c;
        if (spaces[a] === O_TEXT && spaces[c] === O_TEXT && spaces[b] === null) return b;
        if (spaces[b] === O_TEXT && spaces[c] === O_TEXT && spaces[a] === null) return a;
    }

    // Ambil tengah jika kosong
    if (spaces[4] === null) return 4;

    // Ambil sudut jika kosong
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(corner => spaces[corner] === null);
    if (emptyCorners.length > 0) {
        return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // Ambil sisi yang tersedia
    const sides = [1, 3, 5, 7];
    const emptySides = sides.filter(side => spaces[side] === null);
    if (emptySides.length > 0) {
        return emptySides[Math.floor(Math.random() * emptySides.length)];
    }

    return null;
}

// Modifikasi fungsi botMove
function botMove() {
    setTimeout(() => {
        const move = findBestMove();
        if (move !== null) {
            spaces[move] = currentPlayer;
            boxes[move].innerText = currentPlayer;

            if (playerHasWon() !== false) {
                playerText.innerText = `${currentPlayer} has won!`;
                let winning_blocks = playerHasWon();
                winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);  
                updateScore(currentPlayer);
                return;
            }

            if (isDraw()) {
                playerText.innerText = "Draw!";
                boxes.forEach(box => {
                    box.innerText = '';
                    setTimeout(() => {
                        restart();
                    }, 1500);
                });
                return;
            }

            currentPlayer = O_TEXT;
        }
    }, 700);
}

restartBtn.addEventListener('click', () => {
    restart();
    resetScore();
});

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerText = "Tic Tac Toe";

    currentPlayer = O_TEXT;
}

// Tambahkan fungsi baru untuk reset skor
function resetScore() {
    playerScoreContainer.classList.remove('active');
    computerScoreContainer.classList.remove('active');
}

startGame();
