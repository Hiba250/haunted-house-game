
document.addEventListener("DOMContentLoaded", function () {

    const startButton = document.getElementById("startButton");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameScreen = document.getElementById("gameScreen");
    const player = document.getElementById("player");
    const room = document.querySelector(".room");

    let playerX = 50;

    console.log("Game JavaScript loaded!");

    // START GAME button
    startButton.addEventListener("click", function () {
        console.log("START GAME clicked!");

        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";

        playerX = 50;
        player.style.left = playerX + "%";
    });

    // Keyboard movement
    document.addEventListener("keydown", function (event) {

        if (getComputedStyle(gameScreen).display === "none") {
            return;
        }

        if (event.key === "ArrowRight") {
            playerX += 3;
            event.preventDefault();
        }

        if (event.key === "ArrowLeft") {
            playerX -= 3;
            event.preventDefault();
        }

        playerX = Math.max(5, Math.min(95, playerX));
        player.style.left = playerX + "%";
    });

});
