class RenderCall {
  constructor() {
    //this.zIndex = 0;
    this.position = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
  }

  render(renderData) {
    var engine = renderData.engine,
      world = engine.world,
      canvas = renderData.canvas,
      ctx = renderData.context,
      options = renderData.options;
    /*,
    allBodies = Composite.allBodies(world),
    allConstraints = Composite.allConstraints(world),
    background = options.wireframes
      ? options.wireframeBackground
      : options.background,
    bodies = [],
    constraints = [],
    i;*/

    ctx.fillRect(0, 0, 10, 10);
  }
}

module.exports = RenderCall;
