const states = {
  IDLERIGHT: 0,
  RUNRIGHT: 1,
  JUMPRIGHT: 2,
  FALLRIGHT: 3,
  IDLELEFT: 4,
  RUNLEFT: 5,
  JUMPLEFT: 6,
  FALLLEFT: 7,
  MAGICRIGHT: 8,
  MAGICLEFT: 9,
}

const doNotResetFrames = false;

const sigmaOptions = {
  al: {
    imageWidth: 16,
    imageHeight: 16,
    dx: -16,
    dy: 16,
    workingTime: 4 * 4 - 1,
    name: "bullet"
  },
  sl: {
    imageWidth: 16,
    imageHeight: 64,
    dx: -16,
    dy: 0,
    workingTime: 4 * 6 - 1,
    name: "cone"
  },
  dl: {
    imageWidth: 256,
    imageHeight: 16,
    dx:-320,
    dy: 64 - 8,
    workingTime: 4 * 8 - 1,
    name: "area"
  },
  ar: {
    imageWidth: 16,
    imageHeight: 16,
    dx: 64,
    dy: 16,
    workingTime: 4 * 4 - 1,
    name: "bullet"
  },
  sr: {
    imageWidth: 16,
    imageHeight: 64,
    dx: 64,
    dy: 0,
    workingTime: 4 * 6 - 1,
    name: "cone"
  },
  dr: {
    imageWidth: 256,
    imageHeight: 16,
    dx: 128,
    dy: 64 - 8,
    workingTime: 4 * 8 - 1,
    name: "area"
  }
};

class State {
  constructor(state) {
    this.state = state;
  }
}

class IdleRight extends State {
  constructor(player) {
    super("IDLERIGHT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 0;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.RUNLEFT);
    else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.RUNRIGHT);
    else if (input.includes("ArrowUp") && input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.JUMPLEFT);
    else if (input.includes("ArrowUp")) this.player.setState(states.JUMPRIGHT);
    else if (input.includes("KeyA") || input.includes("KeyS") || input.includes("KeyD")) this.player.setState(states.MAGICRIGHT);
  }
}

class RunRight extends State {
  constructor(player) {
    super("RUNRIGHT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 1;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (this.player.onGround() && input.includes("ArrowUp") && input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.JUMPLEFT);
    else if (this.player.onGround() && input.includes("ArrowUp")) this.player.setState(states.JUMPRIGHT);
    else if (!input.includes("ArrowLeft") && !input.includes("ArrowRight") || input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.IDLERIGHT);
    else if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.RUNLEFT);
  }
}

class JumpRight extends State {
  constructor(player) {
    super("JUMPRIGHT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 2;
    this.player.maxFrame = 3;
    if (isResetFrames) this.player.dy = -this.player.jumpForce;
  }

  handleInput(input) {
    if (this.player.dy < 0 && input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.JUMPLEFT, doNotResetFrames);
    else if (this.player.dy >= 0) this.player.setState(states.FALLRIGHT);
  }
}

class FallRight extends State {
  constructor(player) {
    super("FALLRIGHT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 3;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (this.player.onGround()) {
      if (input.includes("ArrowUp") && input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.JUMPLEFT);
      else if (input.includes("ArrowUp")) this.player.setState(states.JUMPRIGHT);
      else if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.RUNLEFT);
      else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.RUNRIGHT);
      else if ((!input.includes("ArrowLeft") && !input.includes("ArrowRight") || input.includes("ArrowLeft") && input.includes("ArrowRight"))) this.player.setState(states.IDLERIGHT);
    } else {
      if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.FALLLEFT, doNotResetFrames);
    }
  }
}

class IdleLeft extends State {
  constructor(player) {
    super("IDLELEFT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 4;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.RUNLEFT);
    else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.RUNRIGHT);
    else if (input.includes("ArrowUp") && !input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.JUMPRIGHT);
    else if (input.includes("ArrowUp")) this.player.setState(states.JUMPLEFT);
    else if (input.includes("KeyA") || input.includes("KeyS") || input.includes("KeyD")) this.player.setState(states.MAGICLEFT);
  }
}

class RunLeft extends State {
  constructor(player) {
    super("RUNLEFT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 5;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (this.player.onGround() && input.includes("ArrowUp") && input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.JUMPLEFT);
    else if (this.player.onGround() && input.includes("ArrowUp")) this.player.setState(states.JUMPRIGHT);
    else if (!input.includes("ArrowLeft") && !input.includes("ArrowRight") || input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.IDLELEFT);
    else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.RUNRIGHT);
  }
}

class JumpLeft extends State {
  constructor(player) {
    super("JUMPLEFT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 6;
    this.player.maxFrame = 3;
    if (isResetFrames) this.player.dy = -this.player.jumpForce;
  }

  handleInput(input) {
    if (this.player.dy < 0 && !input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.JUMPRIGHT, doNotResetFrames);
    else if (this.player.dy >= 0) this.player.setState(states.FALLLEFT);
  }
}

class FallLeft extends State {
  constructor(player) {
    super("FALLLEFT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 7;
    this.player.maxFrame = 3;
  }

  handleInput(input) {
    if (this.player.onGround()) {
      if (input.includes("ArrowUp") && !input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.JUMPRIGHT);
      else if (input.includes("ArrowUp")) this.player.setState(states.JUMPLEFT);
      else if (input.includes("ArrowLeft") && !input.includes("ArrowRight")) this.player.setState(states.RUNLEFT);
      else if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.RUNRIGHT);
      else if ((!input.includes("ArrowLeft") && !input.includes("ArrowRight") || input.includes("ArrowLeft") && input.includes("ArrowRight"))) this.player.setState(states.IDLELEFT);
    } else {
      if (!input.includes("ArrowLeft") && input.includes("ArrowRight")) this.player.setState(states.FALLRIGHT, doNotResetFrames);
    }
  }
}

class MagicRight extends State {
  constructor(player) {
    super("MAGICRIGHT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 8;
    this.player.maxFrame = 3;

    const input = this.player.game.input.keys;

    if (input.includes("KeyA")) {
      this.player.game.sigma.start(sigmaOptions.ar);
    } else if (input.includes("KeyS")) {
      this.player.game.sigma.start(sigmaOptions.sr);
    } else if (input.includes("KeyD")) {
      this.player.game.sigma.start(sigmaOptions.dr);
    }
  }

  handleInput(input) {
    if (!this.player.game.sigma.magic) this.player.setState(states.IDLERIGHT);
  }
}

class MagicLeft extends State {
  constructor(player) {
    super("MAGICLEFT");
    this.player = player;
  }

  enter(isResetFrames) {
    if (isResetFrames) this.player.frameX = 0;
    this.player.frameY = 9;
    this.player.maxFrame = 3;

    const input = this.player.game.input.keys;

    if (input.includes("KeyA")) {
      this.player.game.sigma.start(sigmaOptions.al);
    } else if (input.includes("KeyS")) {
      this.player.game.sigma.start(sigmaOptions.sl);
    } else if (input.includes("KeyD")) {
      this.player.game.sigma.start(sigmaOptions.dl);
    }
  }

  handleInput(input) {
    if (!this.player.game.sigma.magic) this.player.setState(states.IDLELEFT);
  }
}