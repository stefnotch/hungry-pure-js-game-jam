const Actor = require("./Actor");

class RenderCall {
  constructor() {
    //this.zIndex = 0;
    this.position = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };

    /** @type {Actor[]} */
    this.actors = [];
  }

  render(renderData) {
    var engine = renderData.engine,
      world = engine.world,
      canvas = renderData.canvas;
    /** @type {CanvasRenderingContext2D} */
    let ctx = renderData.context;
    let options = renderData.options;

    for (let i = 0; i < this.actors.length; i++) {
      let actor = this.actors[i];
      actor.update();
    }
    //console.log(this.actors);
    /*,
    allBodies = Composite.allBodies(world),
    allConstraints = Composite.allConstraints(world),
    background = options.wireframes
      ? options.wireframeBackground
      : options.background,
    bodies = [],
    constraints = [],
    i;*/
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(this.position.x, this.position.y, 100, 100);
  }
}

module.exports = RenderCall;
