const { Vector, Body } = require("matter-js");

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
  }

  remove() {
    this.antArea.removeActor(this);
    this.antArea = null;
  }
}

module.exports = Actor;
