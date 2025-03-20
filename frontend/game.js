const boardSize = 5;
const board = document.getElementById("game-board");
const moveCounter = document.getElementById("move-counter");
const restartBtn = document.getElementById("restart-btn");

// 🔹 Initial Game State
const initialPlayerPos = { x: 0, y: 0 };
const goalPos = { x: 4, y: 4 };
const obstacles = [
    { x: 2, y: 1 },
    { x: 1, y: 3 },
    { x: 3, y: 2 },
    { x: 3, y: 4 }
];

// 🔹 Game State
let playerPos = { ...initialPlayerPos };
let moves = 0;
let gameWon = false;

// 🔹 Render the Game Grid
function renderBoard() {
    board.innerHTML = "";
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add("player");
                cell.innerText = "🟢";
            } else if (x === goalPos.x && y === goalPos.y) {
                cell.classList.add("goal");
                cell.innerText = "🟡";
            } else if (obstacles.some(ob => ob.x === x && ob.y === y)) {
                cell.classList.add("obstacle");
                cell.innerText = "🔴";
            }

            board.appendChild(cell);
        }
    }
}

// 🔹 Move Player
function movePlayer(direction) {
    if (gameWon) return;
    
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (direction === "up" && newY > 0) newY--;
    if (direction === "down" && newY < boardSize - 1) newY++;
    if (direction === "left" && newX > 0) newX--;
    if (direction === "right" && newX < boardSize - 1) newX++;

    // Check if the move is valid (not hitting an obstacle)
    if (!obstacles.some(ob => ob.x === newX && ob.y === newY)) {
        // Only count as a move if position actually changed
        if (newX !== playerPos.x || newY !== playerPos.y) {
            playerPos.x = newX;
            playerPos.y = newY;
            moves++;
            moveCounter.textContent = moves;
            
            // Add visual feedback for the move
            board.classList.add("scale-95");
            setTimeout(() => {
                board.classList.remove("scale-95");
            }, 100);
        }
    }

    renderBoard();

    // Check for win condition
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y && !gameWon) {
        gameWon = true;
        setTimeout(() => {
            showWinMessage();
        }, 300);
    }
}

// 🔹 Show Win Message
function showWinMessage() {
    const winModal = document.createElement("div");
    winModal.className = "fixed inset-0 flex items-center justify-center bg-black/70 z-50";
    winModal.innerHTML = `
        <div class="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-xl text-white text-center max-w-sm mx-4 transform scale-100 animate-bounce">
            <h2 class="text-3xl font-bold mb-4">🎉 Deadlock Prevented! 🎉</h2>
            <p class="text-xl mb-6">You allocated resources safely in ${moves} moves!</p>
            <button id="play-again" class="bg-white text-cyan-700 px-6 py-2 rounded-full font-bold hover:bg-cyan-100 transition-colors">
                Play Again
            </button>
        </div>
    `;
    document.body.appendChild(winModal);
    
    document.getElementById("play-again").addEventListener("click", () => {
        document.body.removeChild(winModal);
        restartGame();
    });
}

// 🔹 Restart Game
function restartGame() {
    playerPos = { ...initialPlayerPos };
    moves = 0;
    gameWon = false;
    moveCounter.textContent = moves;
    renderBoard();
}

// 🔹 Keyboard Controls
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") movePlayer("up");
    if (event.key === "ArrowDown") movePlayer("down");
    if (event.key === "ArrowLeft") movePlayer("left");
    if (event.key === "ArrowRight") movePlayer("right");
});

// 🔹 Touch Controls
document.getElementById("btn-up").addEventListener("click", () => movePlayer("up"));
document.getElementById("btn-down").addEventListener("click", () => movePlayer("down"));
document.getElementById("btn-left").addEventListener("click", () => movePlayer("left"));
document.getElementById("btn-right").addEventListener("click", () => movePlayer("right"));

// 🔹 Restart Button
restartBtn.addEventListener("click", restartGame);

// 🔹 Start Game
renderBoard();

// 🔹 Add swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;

board.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

board.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Determine swipe direction based on which difference is greater
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 30) {
            movePlayer("right");
        } else if (diffX < -30) {
            movePlayer("left");
        }
    } else {
        // Vertical swipe
        if (diffY > 30) {
            movePlayer("down");
        } else if (diffY < -30) {
            movePlayer("up");
        }
    }
}, false);