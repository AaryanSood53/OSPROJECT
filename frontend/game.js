const boardSize = 5;
const board = document.getElementById("game-board");

// 🔹 Player & Goal Position
let playerPos = { x: 0, y: 0 };
const goalPos = { x: 4, y: 4 };

// 🔹 Obstacles Representing "Deadlock"
const obstacles = [
    { x: 2, y: 1 },
    { x: 1, y: 3 },
    { x: 3, y: 2 },
    { x: 3, y: 4 }
];

// 🔹 Render the Game Grid
function renderBoard() {
    board.innerHTML = "";
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add("player");
                cell.innerText = "⬜";
            } else if (x === goalPos.x && y === goalPos.y) {
                cell.classList.add("goal");
                cell.innerText = "⭐";
            } else if (obstacles.some(ob => ob.x === x && ob.y === y)) {
                cell.classList.add("obstacle");
                cell.innerText = "🚧";
            }

            board.appendChild(cell);
        }
    }
}

// 🔹 Move Player with Arrow Keys
document.addEventListener("keydown", function(event) {
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (event.key === "ArrowUp" && newY > 0) newY--;
    if (event.key === "ArrowDown" && newY < boardSize - 1) newY++;
    if (event.key === "ArrowLeft" && newX > 0) newX--;
    if (event.key === "ArrowRight" && newX < boardSize - 1) newX++;

    if (!obstacles.some(ob => ob.x === newX && ob.y === newY)) {
        playerPos.x = newX;
        playerPos.y = newY;
    }

    renderBoard();

    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
        alert("🎉 You escaped the deadlock!");
    }
});

// 🔹 Start Game
renderBoard();
