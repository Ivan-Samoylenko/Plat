class Block {
  constructor(x, y) {
    this.width = 8;
    this.height = 8;
    this.x = x;
    this.y = y;
    this.image = document.getElementById('block');
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Hill {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = document.getElementById('hill');
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Field {
  constructor(game) {
    this.game = game;
    this.width = 1024;
    this.height = 256;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.image = document.getElementById('field');
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Sky {
  constructor(bcg) {
    this.bcg = bcg;
    this.width = this.bcg.game.width;
    this.height = this.bcg.game.height;
    this.frameX = 0;
    this.frameY = 2048 - this.bcg.game.height;
    this.maxFrameY = 2048 - this.bcg.game.height;
    this.deltaFrameY = this.maxFrameY / (12 / this.bcg.deltaTime);
    this.x = 0;
    this.y = 0;
    this.image = document.getElementById('sky');
  }

  update() {
    if (this.bcg.time > 12) this.frameY -= this.deltaFrameY;
    else this.frameY += this.deltaFrameY;

    if (this.frameY < 0) this.frameY = 0;
    if (this.frameY > this.maxFrameY) this.frameY = this.maxFrameY;
  }

  draw(context) {
    context.drawImage(this.image, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

class Sun {
  constructor(bcg) {
    this.bcg = bcg;
    this.width = 64;
    this.height = 64;
    this.x = (this.bcg.game.width - this.width) / 2;
    this.y = 0;
    this.a = this.bcg.game.width / 2 + this.width * 2;
    this.b = this.bcg.game.height / 2;
    this.dx = (this.bcg.game.width + this.width) / (12 / this.bcg.deltaTime);
    this.image = document.getElementById('sun');
  }

  update() {
    if (this.bcg.time > 6 - this.bcg.deltaTime && this.bcg.time < 6 + this.bcg.deltaTime) {
      this.x = -this.width;
      this.y = this.maxY;
    }

    if (this.bcg.time > 6 - this.bcg.deltaTime && this.bcg.time < 18 + this.bcg.deltaTime) {
      this.x += this.dx;
      this.y = -Math.sqrt((1 - (this.x - this.bcg.game.width / 2) * (this.x - this.bcg.game.width / 2) / (this.a * this.a)) * (this.b * this.b)) + this.b;
    }
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Front {
  constructor(game) {
    this.game = game;
    this.frontHills = [new Hill(-80, 576 - 28, 225, 28), new Hill(180, 576 - 35, 256, 35), new Hill(380, 576 - 26, 140, 26), new Hill(580, 576 - 39, 180, 39), new Hill(780, 576 - 16, 240, 16), new Hill(980, 576 - 26, 240, 26)];
  }

  draw(context) {
    this.frontHills.forEach(hill => hill.draw(context))
  }
}

class Bcg {
  constructor(game) {
    this.game = game;
    this.time = 12;
    this.maxTime = 24;
    this.deltaTime = 0.01;
    this.wall = makeRoad(this.game.height);
    this.blocks = this.wall.map(({x,y}) => new Block(x,y))
    this.backHills = [new Hill(480, 576-240, 256, 48), new Hill(280, 576-230, 256, 58), new Hill(80, 576-235, 256, 64), new Hill(-80, 576-230, 256, 40), new Hill(880, 576-230, 256, 40), new Hill(680, 576-235, 256, 64)];
    this.field = new Field(this.game);
    this.sky = new Sky(this);
    this.sun = new Sun(this);
  }

  update(deltaTime) {
    if (this.time < this.maxTime) this.time += this.deltaTime;
    else this.time = 0;

    this.sky.update();
    this.sun.update();
  }

  draw(context) {
    this.sky.draw(context);
    if (this.time >= 6 && this.time <= 18) this.sun.draw(context);
    this.backHills.forEach(hill => hill.draw(context));
    this.field.draw(context);
    this.blocks.forEach(block => block.draw(context));
  }
}

function makeRoad(height) {
  let prevY = [];

  const road = Array(1024/8).fill(0).map((_,index) => ({x: 8 * index, y: getY(prevY, height)}));

  return road;
}

function getY(prevY, height) {
   let y = null;

   if (prevY.length === 0) {
     y = height - (Math.floor(Math.random() * 10) + 1) * 8;

     prevY.unshift(y)

     return y;
   } else if (prevY.length > 0 && prevY.length < 9) {
     y = prevY[0];

     prevY.unshift(y)

     return y;
   } else {
     if (prevY.findIndex(el => el !== prevY[0]) !== -1) {
       y = prevY[0];

       prevY.length = 8;
       prevY.unshift(y)

       return y;
     } else {
       const random = Math.floor(Math.random() * 3);

       if (random === 0) y = prevY[0] - 8;
       else if (random === 1) y = prevY[0];
       else if (random === 2) y = prevY[0] >= 568 ? prevY[0] - 8 : prevY[0] + 8;

       prevY.length = 8;
       prevY.unshift(y)

       return y;
     }
   }
};