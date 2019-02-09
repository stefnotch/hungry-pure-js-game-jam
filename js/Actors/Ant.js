const { Vector, Body, Bodies } = require("matter-js");
const Actor = require("./../Actor");

const States = {
  searching: 0,
  searchingExtended: 1,
  eating: 2,
  backHome: 3
};

let TARGET_TICKS = 100;
let SPEED = 0.1;
class Ant extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea, position) {
    super(antArea, Bodies.rectangle(position.x, position.y, 20, 10), false);

    this.tickCount = 0;

    this.state = States.searching;
    this.direction = Vector.create(
      Math.cos(this.body.angle),
      Math.sin(this.body.angle)
    );

    this.target = antArea.randomPosition();
  }

  update() {
    super.update();

    if (this.tickCount > TARGET_TICKS) {
      this.tickCount = 0;
      this.target = this.antArea.randomPosition();
    }

    this.direction = Vector.create(
      Math.cos(this.body.angle) * SPEED,
      Math.sin(this.body.angle) * SPEED
    );

    Vector.add(this.body.position, this.direction, this.body.position);
  }

  draw(ctx) {
    let pos = this.body.position;
    ctx.fillStyle = "red";
    ctx.fillRect(pos.x, pos.y, 10, 10);
  }
}

module.exports = Ant;
