const { Vector, Body, Bodies } = require("matter-js");
const Actor = require("./../Actor");
const Ant = require("./Ant");

let MAX_TICKS = 100;
let ANT_FOOD = 100;
class Anthill extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea) {
    let posX =
      antArea.position.x + (Math.random() + 0.2) * antArea.size.x * 0.7;
    let posY =
      antArea.position.y + (Math.random() + 0.2) * antArea.size.y * 0.7;

    super(antArea, Bodies.rectangle(posX, posY, 20, 20), true);

    this.tickCount = 0;
    this.food = 0;
  }

  update() {
    super.update();

    if (this.tickCount > MAX_TICKS) {
      this.tickCount = 0;
      //new Anthill(this.antArea);
      if (this.food > ANT_FOOD) {
        new Ant(this.antArea);
        this.food -= ANT_FOOD;
      }
    }
  }
}

module.exports = Anthill;
