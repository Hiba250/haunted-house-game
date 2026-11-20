
document.addEventListener("DOMContentLoaded", function () {

    // Get HTML elements
    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameScreen = document.getElementById("gameScreen");

    const player = document.getElementById("player");
    const room = document.querySelector(".room");
    const door = document.getElementById("door");
    const key = document.getElementById("key");
    const ghost = document.getElementById("ghost");
    const gameMessage = document.getElementById("gameMessage");
     
    const jumpscare = document.getElementById("jumpscare");
    let jumpscareTimeout = null;

    
    const healthDisplay = document.getElementById("healthDisplay");
    let lives = 3;
    let isInvincible = false;
    let invincibleTimeout = null;


    // Game variables
    let playerX = 50;
    let ghostX = 5;
    let hasKey = false;
    let gameFinished = false;
    let ghostInterval = null;

    console.log("Haunted House Game loaded!");

    // Calculate horizontal distance between two objects
    function getDistance(element1, element2) {

        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        const center1 = rect1.left + rect1.width / 2;
        const center2 = rect2.left + rect2.width / 2;

        return Math.abs(center1 - center2);
    }

    // Update the player's remaining lives
    function updateHealth() {
        healthDisplay.textContent =
            "Lives: " + "❤️".repeat(lives) +
            "🖤".repeat(3 - lives);
    }

    // Reset all game settings
    function resetGame() {

        // Stop previous ghost movement
        clearInterval(ghostInterval);
        
        // Stop any previous jumpscare timer
        clearTimeout(jumpscareTimeout);
        jumpscareTimeout = null;

        // Hide jumpscare when restarting
        jumpscare.style.display = "none";

        // Reset positions
        playerX = 50;
        ghostX = 5;

        // Reset game status
        hasKey = false;
        gameFinished = false;


        // Restore all three lives
        lives = 3;
        isInvincible = false;

        // Cancel temporary protection timer
        clearTimeout(invincibleTimeout);
        invincibleTimeout = null;

        // Remove blinking effect
        player.classList.remove("invincible");

        // Refresh health display
        updateHealth();


        player.style.left = playerX + "%";
        ghost.style.left = ghostX + "%";

        // Show golden key
        key.style.display = "block";

        // Lock the door again
        door.classList.remove("unlocked");

        // Reset game message
        gameMessage.classList.remove("game-over", "game-win");
        gameMessage.textContent =
            "Find the key and escape before the ghost catches you!";

        // Hide restart button
        restartButton.style.display = "none";

        // Start ghost movement
        ghostInterval = setInterval(moveGhost, 150);
    }

    // Start Game button
    startButton.addEventListener("click", function () {

        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";

        resetGame();
    });

    // Restart Game button
    restartButton.addEventListener("click", function () {

        resetGame();
    });

    // Move ghost toward the player


// Show scary ghost jumpscare
function showJumpscare() {

    // Display fullscreen ghost
    jumpscare.style.display = "flex";

    // Play scary sound
    playScarySound();

    // Hide jumpscare after 2 seconds
    jumpscareTimeout = setTimeout(function () {

        jumpscare.style.display = "none";

        // Show restart button
        restartButton.style.display = "block";

    }, 2000);
}

// Generate scary sound using Web Audio API
function playScarySound() {

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        500,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        80,
        audioContext.currentTime + 1
    );

    gainNode.gain.setValueAtTime(
        0.12,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioContext.resume().then(function () {
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    });

    oscillator.onended = function () {
        audioContext.close();
    };
}

    function moveGhost() {

        if (gameFinished) {
            return;
        }

        // Ghost follows player
        if (ghostX < playerX) {
            ghostX += 0.35;
        } else if (ghostX > playerX) {
            ghostX -= 0.35;
        }

        ghost.style.left = ghostX + "%";


// Check if ghost catches player
if (
    getDistance(ghost, player) < 35 &&
    !isInvincible
) {

    // Lose one life
    lives--;
    updateHealth();

    if (lives <= 0) {

        // All lives lost
        gameFinished = true;
        clearInterval(ghostInterval);

        gameMessage.textContent =
            "💀 GAME OVER! You lost all three lives!";

        gameMessage.classList.remove("game-win");
        gameMessage.classList.add("game-over");

        // Trigger scary jumpscare
        showJumpscare();

    } else {

        // Temporary protection
        isInvincible = true;
        player.classList.add("invincible");

        gameMessage.textContent =
            "👻 The ghost attacked! " +
            lives + " lives remaining!";

        // Move ghost away from player
        ghostX = 5;
        ghost.style.left = ghostX + "%";

        // Protection lasts 3 seconds
        invincibleTimeout = setTimeout(function () {

            isInvincible = false;
            player.classList.remove("invincible");
            invincibleTimeout = null;

        }, 3000);
    }
}


    }

    // Keyboard controls
    document.addEventListener("keydown", function (event) {

        // Stop controls if game is hidden or finished
        if (
            getComputedStyle(gameScreen).display === "none" ||
            gameFinished
        ) {
            return;
        }

        // Move right
        if (event.key === "ArrowRight") {
            playerX += 3;
            event.preventDefault();
        }

        // Move left
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

            // Interact with haunted door
            if (getDistance(player, door) < 80) {

                if (hasKey) {

                    // Player wins
                    gameFinished = true;
                    clearInterval(ghostInterval);

                    door.classList.add("unlocked");

                    gameMessage.textContent =
                        "🎉 YOU ESCAPED THE HAUNTED HOUSE!";

                    gameMessage.classList.remove("game-over");
                    gameMessage.classList.add("game-win");

                    // Show restart button
                    restartButton.style.display = "block";

                } else {

                    gameMessage.textContent =
                        "🔒 The door is locked! Find the golden key!";
                }

            } else {

                gameMessage.textContent = hasKey
                    ? "Run to the door and press E!"
                    : "Find the golden key and press E.";
            }
        }
    });

});
