
document.addEventListener("DOMContentLoaded", function () {

    const startButton = document.getElementById("startButton");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameScreen = document.getElementById("gameScreen");

    const player = document.getElementById("player");
    const room = document.querySelector(".room");
    const door = document.getElementById("door");
    const key = document.getElementById("key");
    const ghost = document.getElementById("ghost");
    const gameMessage = document.getElementById("gameMessage");

    let playerX = 50;
    let ghostX = 5;
    let hasKey = false;
    let gameFinished = false;
    let ghostInterval = null;

    // Calculate distance between objects
    function getDistance(element1, element2) {

        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        const center1 = rect1.left + rect1.width / 2;
        const center2 = rect2.left + rect2.width / 2;

        return Math.abs(center1 - center2);
    }

    // Start game
    startButton.addEventListener("click", function () {

        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";

        playerX = 50;
        ghostX = 5;
        hasKey = false;
        gameFinished = false;

        player.style.left = playerX + "%";
        ghost.style.left = ghostX + "%";

        key.style.display = "block";
        door.classList.remove("unlocked");

        gameMessage.classList.remove("game-over", "game-win");
        gameMessage.textContent =
            "Find the key and escape before the ghost catches you!";

        // Stop any previous ghost movement
        clearInterval(ghostInterval);

        // Start ghost movement
        ghostInterval = setInterval(moveGhost, 150);
    });

    // Move the ghost toward the player
    function moveGhost() {

        if (gameFinished) {
            return;
        }

        // Ghost follows the player's position
        if (ghostX < playerX) {
            ghostX += 0.35;
        } else if (ghostX > playerX) {
            ghostX -= 0.35;
        }

        ghost.style.left = ghostX + "%";

        // Check if ghost catches player
        if (getDistance(ghost, player) < 35) {

            gameFinished = true;
            clearInterval(ghostInterval);

            gameMessage.textContent =
                "👻 GAME OVER! The ghost caught you!";

            gameMessage.classList.add("game-over");
        }
    }

    // Keyboard controls
    document.addEventListener("keydown", function (event) {

        if (
            getComputedStyle(gameScreen).display === "none" ||
            gameFinished
        ) {
            return;
        }

        // Move player right
        if (event.key === "ArrowRight") {
            playerX += 3;
            event.preventDefault();
        }

        // Move player left
        if (event.key === "ArrowLeft") {
            playerX -= 3;
            event.preventDefault();
        }

        // Keep player inside room
        const roomWidth = room.clientWidth;
        const playerWidth = player.offsetWidth;

        const margin = roomWidth > 0
            ? (playerWidth / 2 / roomWidth) * 100
            : 5;

        playerX = Math.max(
            margin,
            Math.min(100 - margin, playerX)
        );

        player.style.left = playerX + "%";

        // Press E to interact
        if (event.key.toLowerCase() === "e") {

            // Collect golden key
            if (!hasKey && getDistance(player, key) < 65) {

                hasKey = true;
                key.style.display = "none";

                gameMessage.textContent =
                    "🗝️ Key collected! Run to the door!";

                return;
            }

            // Unlock haunted door
            if (getDistance(player, door) < 80) {

                if (hasKey) {

                    gameFinished = true;
                    clearInterval(ghostInterval);

                    door.classList.add("unlocked");

                    gameMessage.textContent =
                        "🎉 YOU ESCAPED THE HAUNTED HOUSE!";

                    gameMessage.classList.add("game-win");

                } else {

                    gameMessage.textContent =
                        "🔒 The door is locked! Find the key.";
                }

            } else {

                gameMessage.textContent = hasKey
                    ? "Run to the door and press E!"
                    : "Find the golden key and press E.";
            }
        }
    });

});
