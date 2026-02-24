const board = document.getElementById("board");
const statusText = document.getElementById("status");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cells = [];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp";

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// 🔊 safe sound play
function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// 🎮 create board
function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

// 🖱️ player click
function handleCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (cell.textContent !== "" || !gameActive) return;

  cell.textContent = currentPlayer;
  playSound(clickSound);

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    playSound(winSound);
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "🤝 It's a Draw!";
    playSound(drawSound);
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  // 🤖 AI move
  if (mode === "ai" && currentPlayer === "O" && gameActive) {
    setTimeout(aiMove, 400);
  }
}

// 🤖 simple AI
function aiMove() {
  let emptyCells = cells
    .map((cell, i) => cell.textContent === "" ? i : null)
    .filter(v => v !== null);

  if (emptyCells.length === 0) return;

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  cells[randomIndex].textContent = "O";
  playSound(clickSound);

  if (checkWinner()) {
    statusText.textContent = "🤖 Computer Wins!";
    playSound(winSound);
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "🤝 It's a Draw!";
    playSound(drawSound);
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
}

// 🏆 winner check
function checkWinner() {
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    );
  });
}

// 🤝 draw check
function isDraw() {
  return cells.every(cell => cell.textContent !== "");
}

// 🔄 reset
function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
  createBoard();
}

// 🎛️ mode switch
function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
}

// 🚀 start game
createBoard();
