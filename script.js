const canvas = document.querySelector("canvas");
const gameTime = document.querySelector(".timer");
const gameResult = document.querySelector(".game__result");
const ctx = canvas.getContext("2d");
let time = 60;
let timeId;

canvas.width = 1280;
canvas.height = 720;

ctx.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/Horizontal Battle Background.png",
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  imgSrc: "./assets/Ember/Idle.png",
  totalFrames: 8,
  scale: 3.0,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/Ember/Idle.png",
      totalFrames: 8,
    },
    run: {
      imgSrc: "./assets/Ember/Run.png",
      totalFrames: 8,
    },
    jump: {
      imgSrc: "./assets/Ember/Jump.png",
      totalFrames: 2,
    },
    fall: {
      imgSrc: "./assets/Ember/Fall.png",
      totalFrames: 2,
    },
    attack1: {
      imgSrc: "./assets/Ember/Attack1.png",
      totalFrames: 6,
    },
    takeHit: {
      imgSrc: "./assets/Ember/Take hit - white silhouette.png",
      totalFrames: 4,
    },
    death: {
      imgSrc: "./assets/Ember/Death.png",
      totalFrames: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 178,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "green",
  imgSrc: "./assets/Xander/Idle.png",
  totalFrames: 4,
  scale: 3.0,
  offset: {
    x: 215,
    y: 173,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/Xander/Idle.png",
      totalFrames: 4,
    },
    run: {
      imgSrc: "./assets/Xander/Run.png",
      totalFrames: 8,
    },
    jump: {
      imgSrc: "./assets/Xander/Jump.png",
      totalFrames: 2,
    },
    fall: {
      imgSrc: "./assets/Xander/Fall.png",
      totalFrames: 2,
    },
    attack1: {
      imgSrc: "./assets/Xander/Attack1.png",
      totalFrames: 4,
    },
    takeHit: {
      imgSrc: "./assets/Xander/Take hit.png",
      totalFrames: 3,
    },
    death: {
      imgSrc: "./assets/Xander/Death.png",
      totalFrames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -250,
      y: 50,
    },
    width: 178,
    height: 50,
  },
});

// list of keys for controlling game
const controls = {
  a: {
    isPressed: false,
  },
  d: {
    isPressed: false,
  },
  w: {
    isPressed: false,
  },
  ArrowRight: {
    isPressed: false,
  },
  ArrowLeft: {
    isPressed: false,
  },
  ArrowUp: {
    isPressed: false,
  },
};

displayTime();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.updateScreen();
  player.updateScreen();
  enemy.updateScreen();

  player.velocity.x = enemy.velocity.x = 0;

  // conditions for accurate player movement
  if (controls.a.isPressed && player.lastKeyPressed === "a") {
    player.velocity.x = -5;
    player.changeSprite("run");
  } else if (controls.d.isPressed && player.lastKeyPressed === "d") {
    player.velocity.x = 5;
    player.changeSprite("run");
  } else {
    player.changeSprite("idle");
  }

  // player jump and fall
  if (player.velocity.y < 0) {
    player.changeSprite("jump");
  } else if (player.velocity.y > 0) {
    player.changeSprite("fall");
  }

  // conditions for accurate enemy movement
  if (controls.ArrowLeft.isPressed && enemy.lastKeyPressed === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.changeSprite("run");
  } else if (
    controls.ArrowRight.isPressed &&
    enemy.lastKeyPressed === "ArrowRight"
  ) {
    enemy.velocity.x = 5;
    enemy.changeSprite("run");
  } else {
    enemy.changeSprite("idle");
  }

  // enemy jump and fall
  if (enemy.velocity.y < 0) {
    enemy.changeSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.changeSprite("fall");
  }

  // detecting collision and enemy gets hit
  if (
    characterCollision({ char1: player, char2: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('.enemy__show__health',{
        width: enemy.health + '%'
    })
  }

  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  // detecting collision and player gets hit
  if (
    characterCollision({ char1: enemy, char2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('.player__show__health',{
        width: player.health + '%'
    })
  }

  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    showWinner({ player, enemy, timeId });
  }
}

animate();

// adding event listeners for keydown events
window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        controls.d.isPressed = true;
        player.lastKeyPressed = "d";
        break;
      case "a":
        controls.a.isPressed = true;
        player.lastKeyPressed = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowRight":
        controls.ArrowRight.isPressed = true;
        enemy.lastKeyPressed = "ArrowRight";
        break;
      case "ArrowLeft":
        controls.ArrowLeft.isPressed = true;
        enemy.lastKeyPressed = "ArrowLeft";
        break;
      case "ArrowUp":
        controls.ArrowUp.isPressed = true;
        enemy.velocity.y = -20;
        break;
      case "Enter":
        enemy.attack();
        break;
    }
  }
});

// adding event listeners for keyup events
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      controls.d.isPressed = false;
      break;
    case "a":
      controls.a.isPressed = false;
      break;
    case "w":
      controls.w.isPressed = false;
      break;
    case "ArrowRight":
      controls.ArrowRight.isPressed = false;
      break;
    case "ArrowLeft":
      controls.ArrowLeft.isPressed = false;
      break;
    case "ArrowUp":
      controls.ArrowUp.isPressed = false;
      break;
  }
});
