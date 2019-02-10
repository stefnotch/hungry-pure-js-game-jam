const { Vector, Body } = require("./matter");
const { allActors } = require("./GGlobals");

class Actor {
  /**
   *
   * @param {*} antArea
   * @param {Body} body
   * @param {boolean} isStatic
   */
  constructor(antArea, body, isStatic) {
    this.antArea = antArea;
    this.body = body;
    this.isStatic = isStatic;

    if (this.isStatic) {
      this.positionDelta = Vector.sub(this.body.position, antArea.position);
    }

    this.antArea.addActor(this);
    this.tickCount = 0;

    this.body.label = this;
    this.type = "Actor";

    allActors.add(this);
  }

  remove() {
    allActors.delete(this);
    this.antArea.removeActor(this);
    this.antArea = null;
  }

  update() {
    this.tickCount++;
  }

  draw(ctx) {}

  collision(other) {}

  collisionStay(other) {}
}

module.exports = Actor;
