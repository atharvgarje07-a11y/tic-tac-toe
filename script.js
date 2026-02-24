const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const twoPlayerBtn = document.getElementById("twoPlayer");
const aiBtn = document.getElementById("aiMode");

const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");

let currentPlayer = "X";
let gameActive = true;
let vsAI = false;
let board = ["", "", "", "", "", "", "", "", ""];

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(cell, index));
});

twoPlayerBtn.addEventListener("click", () => {
  vsAI = false;
  resetGame();
});

aiBtn.addEventListener("click", () => {
  vsAI = true;
  resetGame();
});

resetBtn.addEventListener("click", resetGame);

function handleClick(cell, index) {
  if (board[index] !== "" || !gameActive) return;

  makeMove(cell, index, currentPlayer);
  clickSound.play();

  if (checkWinner()) return;
  if (checkDraw()) return;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function makeMove(cell, index, player) {
  board[index] = player;
  cell.textContent = player;
  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
  let emptyIndices = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(v => v !== null);

  if (emptyIndices.length === 0) return;

  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(cells[randomIndex], randomIndex, "O");
  clickSound.play();

  checkWinner();
  checkDraw();
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `🎉 Player ${board[a]} wins!`;
      gameActive = false;
      winSound.play();
      return true;
    }
  }
  return false;
}

function checkDraw() {
  if (!board.includes("") && gameActive) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    drawSound.play();
    return true;
  }
  return false;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
}
