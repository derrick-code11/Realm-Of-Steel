class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    totalFrames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.totalFrames = totalFrames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  display() {
    ctx.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.totalFrames),
      0,
      this.image.width / this.totalFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.totalFrames) * this.scale,
      this.image.height * this.scale
    );
  }

  // creating a looping animation effect
  animateFrames() {
    this.framesElapsed += 1;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.totalFrames - 1) {
        this.currentFrame += 1;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  updateScreen() {
    this.display();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imgSrc,
    scale = 1,
    totalFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imgSrc,
      scale,
      totalFrames,
      offset,
    });
    this.velocity = velocity;
    this.health = 100;
    this.height = 150;
    this.width = 50;
    this.lastKeyPressed;
    this.isAttacking;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }

  attack() {
    this.changeSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.changeSprite("death");
    } else {
      this.changeSprite("takeHit");
    }
  }

  changeSprite(sprite) {

    // overriding all animations with death animation
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.totalFrames - 1) {
        this.dead = true;
      }
      return;
    }

    // overriding all animations with attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.totalFrames - 1
    )
      return;

    // overriding all animations with takeHIt animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.totalFrames - 1
    )
      return;

    
    // determines the correct sprite to render on the screen
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.totalFrames = this.sprites.idle.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.totalFrames = this.sprites.jump.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.totalFrames = this.sprites.run.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.totalFrames = this.sprites.fall.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.totalFrames = this.sprites.attack1.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.totalFrames = this.sprites.takeHit.totalFrames;
          this.currentFrame = 0;
        }
        break;

      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.totalFrames = this.sprites.death.totalFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }

  updateScreen() {
    this.display();

    if (!this.dead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // prevents game characters from falling off the screen
    if (
      this.position.y + this.velocity.y + this.height >=
      canvas.height - 265
    ) {
      this.velocity.y = 0;
      this.position.y = 305;
    } else {
      this.velocity.y += gravity;
    }
  }
}
