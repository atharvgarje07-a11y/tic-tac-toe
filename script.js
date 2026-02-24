e {
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
