// 🔊 sound effects
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let gameMode = "pvp"; // default mode

const HUMAN = "X";
const AI = "O";

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// add click listeners
cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

// 🎮 mode switch
function setMode(mode) {
    gameMode = mode;
    resetGame();

    if (mode === "pvp") {
        statusText.textContent = "Player X's turn";
    } else {
        statusText.textContent = "Your turn (X)";
    }
}

function handleClick() {
    const index = this.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    // 👥 PvP mode
    if (gameMode === "pvp") {
        makeMove(index, currentPlayer);
        return;
    }

    // 🤖 AI mode (human plays X)
    if (gameMode === "ai" && currentPlayer === HUMAN) {
        makeMove(index, HUMAN);

        if (gameActive) {
            statusText.textContent = "Computer thinking...";
            setTimeout(aiMove, 500);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    // 🔊 click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // 🏆 check win
    if (checkWinner(player)) {
        winSound.play();

        if (gameMode === "ai") {
            statusText.textContent =
                player === HUMAN ? "🎉 You Win!" : "🤖 Computer Wins!";
        } else {
            statusText.textContent = `🎉 Player ${player} Wins!`;
        }

        gameActive = false;
        return;
    }

    // 🤝 check draw
    if (!board.includes("")) {
        drawSound.play();
        statusText.textContent = "🤝 It's a Draw!";
        gameActive = false;
        return;
    }

    // 🔄 switch player
    currentPlayer = player === "X" ? "O" : "X";

    if (gameMode === "pvp") {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    } else {
        statusText.textContent =
            currentPlayer === HUMAN
                ? "Your turn (X)"
                : "Computer's turn (O)";
    }
}

function aiMove() {
    if (!gameActive) return;

    let emptyCells = board
        .map((val, idx) => (val === "" ? idx : null))
        .filter(v => v !== null);

    let randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomIndex, AI);
}

function checkWinner(player) {
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === player)
    );
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    cells.forEach(cell => (cell.textContent = ""));

    if (gameMode === "pvp") {
        statusText.textContent = "Player X's turn";
    } else {
        statusText.textContent = "Your turn (X)";
    }
}