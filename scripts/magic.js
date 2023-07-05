class MagicSelection {
  constructor() {
    this.image = document.getElementById("magic_elements");
    this.x = 20;
    this.y = 20;
    this.width = 160;
    this.height = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.qPressed = false;
    this.ePressed = false;
    this.qX = this.x;
    this.buttonWidth = 32;
    this.eX = this.x + this.buttonWidth * 4;
    this.buttonFrameX = 0;
    this.maxFrame = 4;
    this.fps = 60;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    // buttons animation
    if (this.qPressed && !this.ePressed || !this.qPressed && this.ePressed) {
      if (this.frameTimer < this.frameInterval) {
        this.frameTimer += deltaTime;
      } else {
        // reset frame timer
        this.frameTimer = 0;

        if (this.buttonFrameX < this.maxFrame) this.buttonFrameX += 1;
        else this.buttonFrameX = this.maxFrame;
      }
    } else {
      this.buttonFrameX = 0;
    }
  }

  draw(context) {
    context.drawImage(this.image, 0, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    if (this.qPressed && !this.ePressed) context.drawImage(this.image, this.buttonFrameX * this.buttonWidth, 3 * this.height, this.buttonWidth, this.height, this.qX, this.y, this.buttonWidth, this.height);
    else if (!this.qPressed && this.ePressed) context.drawImage(this.image, this.buttonFrameX * this.buttonWidth, 4 * this.height, this.buttonWidth, this.height, this.eX, this.y, this.buttonWidth, this.height);
  }

  select() {
    if (!this.qPressed && this.ePressed) {
      if (this.frameY < 2) this.frameY +=1;
      else this.frameY = 0;
    } else if (this.qPressed && !this.ePressed) {
      if (this.frameY > 0) this.frameY -=1;
      else this.frameY = 2;
    }
  }
}

class MagicInsertion {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById("magic_types");
    this.width = 32;
    this.height = 32;
    this.gap = 40;
    this.x = this.game.width - (this.width + this.gap) * 2;
    this.y = 120;
    this.frameX = 0;
    this.frameY = this.game.magicSelection.frameY;
    this.maxFrame = 4;
    this.fps = 60;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.changed = false;
    this.scale = 1;
  }

  update(deltaTime) {
    //change display of magic when seelect another type
    this.frameY = this.game.magicSelection.frameY;

    // buttons animation
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      // reset frame timer
      this.frameTimer = 0;

      if (this.scale < 1) this.scale += 0.2;
      else this.scale = 1;
    }
  }

  draw(context) {
    //darw bullet button
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
    //darw cone button
    context.drawImage(this.image, (this.frameX + 1) * this.width, this.frameY * this.height, this.width, this.height, this.x + this.width + this.gap, this.y, this.width * this.scale, this.height * this.scale);
    //darw area button
    context.drawImage(this.image, (this.frameX + 2) * this.width, this.frameY * this.height, this.width, this.height, this.x + (this.width + this.gap) / 2, this.y + this.height + this.gap, this.width * this.scale, this.height * this.scale);
  }

  resetImage() {
    this.scale = 0;
  };
}

class MagicBullet {
  constructor(game, direction) {
    this.delete = false;
    this.game = game;
    this.x = this.game.sigma.x;
    this.y = this.game.sigma.y;
    this.direction = direction;
    this.dx = 6;
    this.width = 16;
    this.height = 16;
    this.image = document.getElementById("magic_bullets");
    this.frameX = 0;
    this.frameY = direction === 1 ? this.game.magicSelection.frameY * 2 : this.game.magicSelection.frameY * 2 + 1;
    this.maxFrame = 5;
    this.fps = 15;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    this.x += this.dx * this.direction;

    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      // reset frame timer
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) this.frameX += 1;
      else this.frameX = 0;
    }

    //delete bullets behind the screen
    if (this.x < -this.width || this.x > this.game.width) {
      this.delete = true;
      this.game.deleteMagic();
    }
  }

  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

class MagicCone {
  constructor(game, direction) {
    this.delete = false;
    this.game = game;
    this.direction = direction;
    this.width = 96;
    this.height = 64;
    this.x = direction === 1 ? this.game.sigma.x : this.game.sigma.x - this.width + 16;
    this.y = this.game.sigma.y;
    this.image = document.getElementById("magic_cones");
    this.frameX = 0;
    this.frameY = direction === 1 ? this.game.magicSelection.frameY * 2 : this.game.magicSelection.frameY * 2 + 1;
    this.maxFrame = 5;
    this.fps = 20;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      // reset frame timer
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) {
        this.frameX += 1;
      } else {
        //delete magic
        this.delete = true;
        this.game.deleteMagic();
      }
    }
  }

  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

class MagicArea {
  constructor(game) {
    this.delete = false;
    this.game = game;
    this.width = 256;
    this.height = this.game.magicSelection.frameY === 2 ? 576 : 128;
    this.x = this.game.sigma.x;
    this.y = this.game.magicSelection.frameY === 2 ? this.game.sigma.y - 576 + 40 : (this.game.sigma.y - this.height + 8);
    this.image = document.getElementById("magic_areas");
    this.frameX = 0;
    this.frameY = this.game.magicSelection.frameY === 2 ? 0.5 : this.game.magicSelection.frameY;
    this.maxFrame = 3;
    this.minFrame = 2;
    this.fps = 20;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.lifeTimer = 0;
    this.maxLife = 15;
  }

  update(deltaTime) {
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      // reset frame timer
      this.frameTimer = 0;
      this.lifeTimer += 1;

      if (this.lifeTimer >= this.maxLife) this.maxFrame = 4;

      if (this.frameX === 4) {
        this.delete = true;
        this.game.deleteMagic();
      };

      if (this.frameX < this.maxFrame) {
        this.frameX += 1;
      } else {
        this.frameX = this.minFrame;
      }
    }
  }

  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}