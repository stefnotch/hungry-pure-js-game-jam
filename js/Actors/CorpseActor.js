const { Vector, Body, Bodies } = require("./../matter");
const Actor = require("./../Actor");
class CorpseActor extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea, body) {
    super(antArea, body, true);
    this.type = "WallCorpse";
    body.isSensor = true;
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
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fill();
  }
}

module.exports = CorpseActor;
