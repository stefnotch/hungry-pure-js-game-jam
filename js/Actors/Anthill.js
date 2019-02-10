const { Vector, Body, Bodies } = require("./../matter");
const Actor = require("./../Actor");
const Ant = require("./Ant");

let MAX_TICKS = 50; //TODO: Change to 300
let ANT_FOOD = 100;
let MIN_FOOD = 100;
class Anthill extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea) {
    let pos = antArea.randomPosition();

    super(antArea, Bodies.rectangle(pos.x, pos.y, 20, 20), true);
    this.type = "Anthill";
    this.tickCount = 0;
    this.food = 1500;
    this.body.density = 10000;
    this.body.isSensor = true;
  }

  update() {
    super.update();

    if (this.tickCount > MAX_TICKS) {
      this.tickCount = 0;
      //new Anthill(this.antArea);
      if (this.food > ANT_FOOD + MIN_FOOD) {
        new Ant(this.antArea, this.body.position);
        this.food -= ANT_FOOD;
      }
      this.food -= 1; // Ant hills also naturally consume food

      if (this.food <= 0) {
        this.remove();
        // Ant hill is dead
      }
    }
  }

  collision(other) {
    if (other.label instanceof Ant) {
      /** @type {Ant} */
      let ant = other.label;
      this.food += ant.food;
      ant.food = 0;
      ant.state = 0;
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "#232323";
    ctx.beginPath();
    ctx.ellipse(
      this.body.position.x,
      this.body.position.y,
      15,
      15,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.ellipse(
      this.body.position.x,
      this.body.position.y,
      10,
      10,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "#535353";
    ctx.beginPath();
    ctx.ellipse(
      this.body.position.x,
      this.body.position.y,
      5,
      5,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    let foodbarWidth = (this.food / ANT_FOOD) * 10;
    if (this.food >= ANT_FOOD + MIN_FOOD) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "#b2732a";
    }
    ctx.fillRect(
      this.body.position.x - foodbarWidth / 2,
      this.body.position.y + 20,
      foodbarWidth,
      5
    );
  }
}

module.exports = Anthill;
