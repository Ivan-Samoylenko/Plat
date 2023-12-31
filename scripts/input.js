class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.xDown = null;
    this.yDown = null;

    window.addEventListener("keydown", (e)=> {
      if ((e.code === "ArrowDown" ||
           e.code === "ArrowUp" ||
           e.code === "ArrowRight" ||
           e.code === "ArrowLeft" ||
           e.code === "KeyQ" ||
           e.code === "KeyE" ||
           e.code === "KeyA" ||
           e.code === "KeyS" ||
           e.code === "KeyD"
          ) && this.keys.indexOf(e.code) === -1) {
        this.keys.push(e.code);
      };
    });

    window.addEventListener("keyup", (e)=> {
      if (e.code === "ArrowDown" ||
          e.code === "ArrowUp" ||
          e.code === "ArrowRight" ||
          e.code === "ArrowLeft" ||
          e.code === "KeyQ" ||
          e.code === "KeyE" ||
          e.code === "KeyA" ||
          e.code === "KeyS" ||
          e.code === "KeyD"
          ) {
        this.keys.splice(this.keys.indexOf(e.code), 1);
      };
    });

    window.addEventListener("touchstart", (e)=>{
      const rect = canvas.getBoundingClientRect();
      const firstTouch = e.touches[0];

      this.xDown = firstTouch.clientX;
      this.yDown = firstTouch.clientY;

      const scale = (rect.width - 8) / 1024;
      const x = (this.xDown - rect.x) / scale;
      const y = (this.yDown - rect.y) / scale;

      if (this.touchQ(x, y)) this.keys.push("KeyQ");
      else if (this.touchE(x, y)) this.keys.push("KeyE");
      else if (this.touchA(x, y)) this.keys.push("KeyA");
      else if (this.touchS(x, y)) this.keys.push("KeyS");
      else if (this.touchD(x, y)) this.keys.push("KeyD");
    });

    window.addEventListener("touchmove", (e)=>{
      if (!this.xDown || !this.yDown) return;

      //do not need to move if you touch action buttons
      const rect = canvas.getBoundingClientRect();
      const scale = (rect.width - 8) / 1024;
      const x = (this.xDown - rect.x) / scale;
      const y = (this.yDown - rect.y) / scale;
      if (this.touchQ(x, y) || this.touchE(x, y) || this.touchA(x, y) || this.touchS(x, y) || this.touchD(x, y)) return;

      //main logic
      const xDiff = this.xDown - e.touches[0].clientX;
      const yDiff = this.yDown - e.touches[0].clientY;

      const diff = Math.abs(xDiff/yDiff)

      this.keys.length = 0;
      if (diff > 0.5 && diff < 2) {
        this.keys.push(xDiff < 0 ? "ArrowRight" : "ArrowLeft")
        this.keys.push(yDiff > 0 ? "ArrowUp" : "ArrowDown")
      } else if (diff <= 0.5) {
        this.keys.push(yDiff > 0 ? "ArrowUp" : "ArrowDown")
      } else {
        this.keys.push(xDiff < 0 ? "ArrowRight" : "ArrowLeft")
      }
    });

    window.addEventListener("touchend", ()=>{
      this.xDown = null;
      this.yDown = null;
      this.keys.length = 0;
    });
  };

  touchQ(x,y) {
    const minX = this.game.magicSelection.qX - 10;
    const maxX = this.game.magicSelection.qX + this.game.magicSelection.buttonWidth + 10;
    const minY = this.game.magicSelection.y - 10;
    const maxY = this.game.magicSelection.y + this.game.magicSelection.height + 10;

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
  };

  touchE(x,y) {
    const minX = this.game.magicSelection.eX - 10;
    const maxX = this.game.magicSelection.eX + this.game.magicSelection.buttonWidth + 10;
    const minY = this.game.magicSelection.y - 10;
    const maxY = this.game.magicSelection.y + this.game.magicSelection.height + 10;

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
  };

  touchA(x,y) {
    const info = this.game.magicInsertion;
    const minX = info.x - 10;
    const maxX = info.x + info.width + 10;
    const minY = info.y - 10;
    const maxY = info.y + info.height + 10;

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
  };

  touchS(x,y) {
    const info = this.game.magicInsertion;
    const minX = info.x + info.width + info.gap - 10;
    const maxX = info.x + info.width + info.gap + info.width + 10;
    const minY = info.y - 10;
    const maxY = info.y + info.height + 10;

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
  };

  touchD(x,y) {
    const info = this.game.magicInsertion;
    const minX = info.x + (info.width + info.gap) / 2 - 10;
    const maxX = info.x + (info.width + info.gap) / 2 + info.width + 10;
    const minY = info.y + info.height + info.gap - 10;
    const maxY = info.y + info.height + info.gap + info.height + 10;

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
  };
};