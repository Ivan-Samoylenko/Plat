class Mana {
  constructor(player) {
    this.player = player;
    this.amount = 100;
    this.maxAmount = 100;
    this.regen = 0.1;
    this.width = 300;
    this.height = 40;
    this.x = this.player.game.width / 2 + 20;
    this.y = 20;
    this.image = document.getElementById('bar');
    this.barWidth = this.width - 8 * 2;
    this.barHeight = this.height - 8 * 2;
  }

  update() {
    if (this.amount < this.maxAmount) {
      if (this.amount + this.regen > this.maxAmount) this.amount = this.maxAmount;
      else this.amount +=this.regen;
    }
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y);
    this.drawBar(context);
  }

  dry(value) {
    if (this.amount - value >= 0) this.amount -= value;
  }

  scaleBarWidth() {
    return this.barWidth * (this.amount / this.maxAmount);
  }

  drawBar(context) {
    context.beginPath();
    context.fillStyle = "rgba(0,0,200, 0.6)";
    context.rect(this.x + 8, this.y + 8, this.scaleBarWidth(), this.barHeight);
    context.fill();
    context.closePath();
  }
}

class Health {
  constructor(player) {
    this.player = player;
    this.amount = 100;
    this.maxAmount = 105;
    this.regen = 0.01;
    this.width = 300;
    this.height = 40;
    this.x = this.player.game.width / 2 - this.width - 20;
    this.y = 20;
    this.image = document.getElementById('bar');
    this.barWidth = this.width - 8 * 2;
    this.barHeight = this.height - 8 * 2;
  }

  update() {
    if (this.amount < this.maxAmount) {
      if (this.amount + this.regen > this.maxAmount) this.amount = this.maxAmount;
      else this.amount +=this.regen;
    }
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y);
    this.drawBar(context);
  }

  dry(value) {
    if (this.amount - value >= 0) this.amount -= value;
  }

  scaleBarWidth() {
    return this.barWidth * (this.amount / this.maxAmount);
  }

  drawBar(context) {
    context.beginPath();
    context.fillStyle = "rgba(200,0,0, 0.6)";
    context.rect(this.x + 8, this.y + 8, this.scaleBarWidth(), this.barHeight);
    context.fill();
    context.closePath();
  }
}