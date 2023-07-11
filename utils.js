// detects collision of game characters
function characterCollision({ char1, char2 }) {
  return (
    char1.attackBox.position.x + char1.attackBox.width >= char2.position.x &&
    char1.attackBox.position.x <= char2.position.x + char2.width &&
    char1.attackBox.position.y + char1.attackBox.height >= char2.position.y &&
    char1.attackBox.position.y <= char2.position.y + char2.height
  );
}

// determines the winner of the game
function showWinner({ player, enemy, timeId }) {
  clearTimeout(timeId); // stops time if there's a winner before time runs out
  gameResult.style.display = "flex";
  if (player.health === enemy.health) {
    gameResult.innerHTML = "Draw🗿";
  } else {
    player.health > enemy.health
      ? (gameResult.innerHTML = "Ember Wins 🥷🚩🎉")
      : (gameResult.innerHTML = "Xander Wins 🤺🏴‍☠️🎉");
  }
}

// displays game time
function displayTime() {
  if (time > 0) {
    timeId = setTimeout(displayTime, 1000);
    time -= 1;
    gameTime.innerHTML = time;
  }

  if (time === 0) {
    showWinner({ player, enemy, timeId });
  }
}
