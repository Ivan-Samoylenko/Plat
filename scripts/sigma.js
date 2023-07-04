class Sigma {
  constructor(game) {
    this.game = game;
    this.width = 64;
    this.height = 64;
    this.imageWidth = 256;
    this.imageHeight = 16;
    this.dx = 10;
    this.dy = -20;
    this.x = this.game.player.x + this.dx;
    this.y = this.game.player.y + this.dy;
    this.image = document.getElementById('sigma');
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 3;
    this.fps = 60;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.magic = false;
    this.timer = 0;
    this.workingTime = 4 * 16 - 1; //must be 4 times some number minus 1
    this.name = null;
  }

  update(deltaTime) {
    //change coordinates
    this.x = this.game.player.x + this.dx;
    this.y = this.game.player.y + this.dy;

    //sprite animation
    if (this.magic) {
      if (this.frameTimer < this.frameInterval) {
        this.frameTimer += deltaTime;
      } else {
        //reset frame timer
        this.frameTimer = 0;

        //move sigma timer
        this.timer += 1;

        //horizontal sprites change
        if (this.frameX < this.maxFrame) this.frameX += 1;
        else this.frameX = 0;

        //vertical sprites change
        if (this.timer < 4) this.frameY = 0; //start
        else if (this.timer >= 4 && this.timer <= this.workingTime - 4) this.frameY = 1; //working
        else this.frameY = 2; //end
      
        //end of animation
        if (this.timer >= this.workingTime) {
          const direction = this.game.player.currentState.state === "MAGICRIGHT" ? 1 : -1;

          this.magic = false;
          this.frameX = 0;
          this.frameY = 0;
          this.timer = 0;

          if (this.name === "bullet") this.game.addMagicBullet(direction);
          else if(this.name === "cone") this.game.addMagicCone(direction);
          else if(this.name === "area") this.game.addMagicArea();
        }
      }  
    }
  }

  draw(context) {
    if (this.magic) context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.imageWidth, this.imageHeight);
  }

  start({imageWidth, imageHeight, dx, dy, workingTime, name}) {
    this.magic = true;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.dx = dx;
    this.dy = dy;
    this.workingTime = workingTime;
    this.name = name;
  }
}