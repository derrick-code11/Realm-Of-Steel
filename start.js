document.addEventListener("DOMContentLoaded", function () {
  // Get references to the start screen and game canvas

  const startScreen = document.querySelector(".start__screen");
  const mainContainer = document.querySelector(".main__container");
  const healthBar = document.querySelector(".health__bar");

  // Get reference to the start button
  const startButton = document.querySelector(".start__button");

  // Add click event listener to the start button
  startButton.addEventListener("click", function () {
    // Hide the start screen
    startScreen.style.display = "none";

    // Display the game canvas
    canvas.style.display = "block";

    // Display health bar
    healthBar.style.display = "flex";

    // Properly style main container
    mainContainer.style.position = "relative";
    mainContainer.style.display = "inline-block";

    displayTime();
    animate(); // call to start the animation loop
  });
});
