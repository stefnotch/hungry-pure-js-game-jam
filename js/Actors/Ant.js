const { Vector, Body, Bodies } = require("matter-js");
const Actor = require("./../Actor");

const States = {
  searching: 0,
  searchingExtended: 1,
  eating: 2,
  backHome: 3
};

let TARGET_TICKS = 100;
let SPEED = 0.02;
class Ant extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea, position) {
    super(
      antArea,
      Bodies.rectangle(position.x, position.y + 20, 20, 10),
      false
    );

    this.tickCount = 0;

    this.state = States.searching;
    this.direction = Vector.create(
      Math.cos(this.body.angle),
      Math.sin(this.body.angle)
    );

    /** @type {Vector} */
    this.target = antArea.randomPosition();
  }

  update() {
    super.update();

    if (this.tickCount > TARGET_TICKS) {
      this.tickCount = 0;
      this.target = this.antArea.randomPosition();
    }

    let dir = Vector.sub(this.target, this.body.position);
    // TODO: Slow angular velocity
    this.body.angle = (this.body.angle + Math.atan2(dir.y, dir.x)) / 2;

    this.direction = Vector.create(
      Math.cos(this.body.angle) * SPEED,
      Math.sin(this.body.angle) * SPEED
    );

    Vector.add(this.body.position, this.direction, this.body.position);
  }

  draw(ctx) {
    let pos = this.body.position;

    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.body.angle);
    //ctx.translate(-pos.x, -pos.y);

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.ellipse(7, 0, 3, 2, 0, 0, 2 * Math.PI);
    ctx.ellipse(0, 0, 5, 2, 0, 0, 2 * Math.PI);
    ctx.ellipse(-7, 0, 4, 2.5, 0, 0, 2 * Math.PI);
    ctx.fill();
    //ctx.strokeStyle = "black";
    //ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

module.exports = Ant;
