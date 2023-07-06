window.addEventListener('load', platformer);

function platformer() {
  const canvas = document.getElementById('canvas');
  const c = canvas.getContext('2d');
  canvas.width = 64 * 16; //1024
  canvas.height = 64 * 9; //576

  class Game {
    constructor() {
      this.width = canvas.width;
      this.height = canvas.height;
      this.bcg = new Bcg(this);
      this.front = new Front(this);
      this.ground = this.height - this.bcg.wall[0].y;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.sigma = new Sigma(this);
      this.magicSelection = new MagicSelection();
      this.magicInsertion = new MagicInsertion(this);
      this.magicShots = [];

      this.coordinates = {x: 0, y: 0};
    }

    update(deltaTime) {
      this.bcg.update();
      this.player.update(this.input.keys, deltaTime);
      this.sigma.update(deltaTime);
      if (this.magicShots.length > 0) this.magicShots.forEach(magic => {magic.update(deltaTime)});
      this.magicSelection.update(deltaTime);
      this.magicInsertion.update(deltaTime);
    }

    draw(context) {
      this.bcg.draw(context);
      this.sigma.draw(context);
      this.player.draw(context);
      if (this.magicShots.length > 0) this.magicShots.forEach(magic => {magic.draw(context)});
      this.front.draw(context);
      this.player.health.draw(context);
      this.player.mana.draw(context);
      this.magicSelection.draw(context);
      this.magicInsertion.draw(context);
    }

    addMagicBullet(direction) {
      this.magicShots.push(new MagicBullet(this, direction));
    }

    addMagicCone(direction) {
      this.magicShots.push(new MagicCone(this, direction));
    }

    addMagicArea() {
      this.magicShots.push(new MagicArea(this));
    }

    deleteMagic() {
      this.magicShots = this.magicShots.filter(magic => !magic.delete);
    }
  }

  const game = new Game();
  console.log(game);

  let lastTime = 0;

  function animation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    c.clearRect(0,0,canvas.width,canvas.height);
    game.update(deltaTime);
    game.draw(c);
    requestAnimationFrame(animation);
  }

  animation(0);
}