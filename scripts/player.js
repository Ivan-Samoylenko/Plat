class Player {
  constructor(game) {
    this.game = game;
    this.width = 64;
    this.height = 64;
    this.x = 0;
    this.y = this.game.height - this.game.ground - this.height;
    this.dx = 0;
    this.dy = 0;
    this.maxSpeed = 4;
    this.jumpForce = 6;
    this.weight = 0.3;
    this.image = document.getElementById('player');
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 3;
    this.fps = 8;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.states = [new IdleRight(this), new RunRight(this), new JumpRight(this), new FallRight(this), new IdleLeft(this), new RunLeft(this), new JumpLeft(this), new FallLeft(this), new MagicRight(this), new MagicLeft(this)];
    this.currentState = this.states[0];
    this.magicSelectionPressed = false;
    this.mana = new Mana(this);
    this.health = new Health(this);
  }

  update(input, deltaTime) {
    //state menegment
    this.currentState.handleInput(input);

    //movement
    this.x += this.dx;
    this.y += this.dy;
    //horizontal move
    //move
    if (this.notCastingSpell()) {
      if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.dx = -this.maxSpeed;
      else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.dx = this.maxSpeed;
      else this.dx = 0;
      //borders
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
      //vertical move
      //borders
      if (!this.onGround()) this.dy += this.weight;
      else this.dy = 0;
    }

    //change ground border
    if (this.x + this.dx !== this.x) {
      const index = Math.floor((this.x + this.width * 0.5) / 8);

      this.game.ground = this.game.height - this.game.bcg.wall[index].y;

      if (this.currentState.state === 'RUNRIGHT' || this.currentState.state === 'RUNLEFT') this.y = this.game.height - this.game.ground - this.height;
    }

    //sprite animation
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      // reset frame timer
      this.frameTimer = 0;

      //change frames
      if (this.frameX < this.maxFrame) this.frameX += 1;
      else this.frameX = 0;
    }

    //change magic elements
    if (this.notCastingSpell() && (input.includes("KeyQ") || input.includes("KeyE"))) {
      if (!this.magicSelectionPressed) {
        if (input.includes("KeyQ")) this.game.magicSelection.qPressed = true;
        else if (input.includes("KeyE")) this.game.magicSelection.ePressed = true;
        this.game.magicSelection.select();
        this.game.magicInsertion.resetImage();
      }
      this.magicSelectionPressed = true;
    } else {
      this.magicSelectionPressed = false;
      this.game.magicSelection.qPressed = false;
      this.game.magicSelection.ePressed = false;
    }

    //mana update
    this.mana.update();
    this.health.update();
  }

  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  onGround() {
    return this.y + this.height + this.dy >= this.game.height - this.game.ground;
  }

  notCastingSpell() {
    return this.currentState.state !== 'MAGICRIGHT' && this.currentState.state !== 'MAGICLEFT';
  }

  setState(state, isResetFrames = true) {
    this.currentState = this.states[state];
    this.currentState.enter(isResetFrames);
  }
}