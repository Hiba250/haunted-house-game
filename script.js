
document.addEventListener("DOMContentLoaded", function () {

    const startButton = document.getElementById("startButton");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameScreen = document.getElementById("gameScreen");

    const player = document.getElementById("player");
    const room = document.querySelector(".room");
    const door = document.getElementById("door");
    const key = document.getElementById("key");
    const gameMessage = document.getElementById("gameMessage");

    let playerX = 50;
    let hasKey = false;
    let gameFinished = false;

    // Start game
    startButton.addEventListener("click", function () {

        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";

        playerX = 50;
        hasKey = false;
        gameFinished = false;

        player.style.left = playerX + "%";
        key.style.display = "block";
        door.classList.remove("unlocked");

        gameMessage.textContent =
            "Find the hidden golden key!";
    });

    // Calculate horizontal distance between elements
    function getDistance(element1, element2) {

        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        const center1 = rect1.left + rect1.width / 2;
        const center2 = rect2.left + rect2.width / 2;

        return Math.abs(center1 - center2);
    }

    // Keyboard controls
    document.addEventListener("keydown", function (event) {

        if (getComputedStyle(gameScreen).display === "none"
            || gameFinished) {
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

        // Keep player inside the room
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

            // Collect the key
            if (!hasKey && getDistance(player, key) < 65) {

                hasKey = true;
                key.style.display = "none";

                gameMessage.textContent =
                    "🗝️ Key collected! Go to the door.";

                return;
            }

            // Interact with the door
            if (getDistance(player, door) < 80) {

                if (hasKey) {

                    door.classList.add("unlocked");
                    gameFinished = true;

                    gameMessage.textContent =
                        "🎉 You unlocked the door! You escaped!";

                } else {

                    gameMessage.textContent =
                        "🔒 Door locked! Find the golden key.";
                }

            } else {

                gameMessage.textContent = hasKey
                    ? "Move to the door and press E."
                    : "Find the key and press E.";
            }
        }
    });

});
