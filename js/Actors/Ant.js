const { Vector, Body, Bodies } = require("matter-js");
const Actor = require("./../Actor");

let TARGET_TICKS = 100;
class Ant extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea) {
    let posX =
      antArea.position.x + (Math.random() + 0.2) * antArea.size.x * 0.7;
    let posY =
      antArea.position.y + (Math.random() + 0.2) * antArea.size.y * 0.7;

    super(antArea, Bodies.rectangle(posX, posY, 20, 10), true);

    this.tickCount = 0;
  }

  update() {
    super.update();

    if (this.tickCount > TARGET_TICKS) {
      this.tickCount = 0;
    }
  }
}

module.exports = Ant;
