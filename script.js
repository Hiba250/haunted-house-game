const startButton = document.getElementById("startButton");

const welcomeScreen = document.getElementById("welcomeScreen");

const gameScreen = document.getElementById("gameScreen");

startButton.addEventListener("click", function() {

    welcomeScreen.style.display = "none";

    gameScreen.style.display = "block";

});