const { Vector, Body, Bodies } = require("./../matter");
const Actor = require("./../Actor");
class Food extends Actor {
  /**
   *
   * @param {*} antArea
   * @param {Vector} position
   * @param {number} food
   * @param {(food: Food) => void} eatingCallback
   */
  constructor(antArea, position, food, eatingCallback = undefined) {
    let body = Bodies.rectangle(position.x, position.y, 10, 10);
    body.isSensor = true;
    super(antArea, body, true);
    this.type = "Food";

    this.maxFood = food || 0;
    this.food = food || 0;

    this.eatingCallback = eatingCallback;
  }

  collisionStay(other) {
    if (this.food <= 0) return;
    if (other.label instanceof Actor && other.label.type == "Ant") {
      let ant = other.label;
      ant.state = 2;
      ant.food++;
      this.food--;

      if (this.eatingCallback) this.eatingCallback(this);
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    let c = ctx;
    let body = this.body;

    c.beginPath();

    // handle compound parts
    for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
      let part = body.parts[k];

      c.moveTo(part.vertices[0].x, part.vertices[0].y);

      for (let j = 1; j < part.vertices.length; j++) {
        if (!part.vertices[j - 1].isInternal || showInternalEdges) {
          c.lineTo(part.vertices[j].x, part.vertices[j].y);
        } else {
          c.moveTo(part.vertices[j].x, part.vertices[j].y);
        }

        if (part.vertices[j].isInternal && !showInternalEdges) {
          c.moveTo(
            part.vertices[(j + 1) % part.vertices.length].x,
            part.vertices[(j + 1) % part.vertices.length].y
          );
        }
      }

      c.lineTo(part.vertices[0].x, part.vertices[0].y);
    }

    c.lineWidth = 2;
    c.fillStyle = "rgba(0, 0, 100, 0.4)";
    c.fill();
  }
}

module.exports = Food;
