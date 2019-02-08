const Matter = require("matter-js");
const { Engine, World, Bodies } = Matter;
const CRender = require("./js/CustomRender");
const { engine, render, canvas, ctx } = require("./js/MatterSetup");

/**
 * Renders the given `engine`'s `Matter.World` object.
 * This is the entry point for all rendering and should be called every time the scene changes.
 * @method world
 * @param {render} render
 */
/*
CRender.world = function(render) {
  var engine = render.engine,
    world = engine.world,
    canvas = render.canvas,
    context = render.context,
    options = render.options,
    allBodies = Composite.allBodies(world),
    allConstraints = Composite.allConstraints(world),
    background = options.wireframes
      ? options.wireframeBackground
      : options.background,
    bodies = [],
    constraints = [],
    i;

  var event = {
    timestamp: engine.timing.timestamp
  };

  Events.trigger(render, "beforeRender", event);

  // apply background if it has changed
  if (render.currentBackground !== background)
    _applyBackground(render, background);

  // clear the canvas with a transparent fill, to allow the canvas background to show
  context.globalCompositeOperation = "source-in";
  context.fillStyle = "transparent";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";

  // handle bounds
  if (options.hasBounds) {
    // filter out bodies that are not in view
    for (i = 0; i < allBodies.length; i++) {
      var body = allBodies[i];
      if (Bounds.overlaps(body.bounds, render.bounds)) bodies.push(body);
    }

    // filter out constraints that are not in view
    for (i = 0; i < allConstraints.length; i++) {
      var constraint = allConstraints[i],
        bodyA = constraint.bodyA,
        bodyB = constraint.bodyB,
        pointAWorld = constraint.pointA,
        pointBWorld = constraint.pointB;

      if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
      if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

      if (!pointAWorld || !pointBWorld) continue;

      if (
        Bounds.contains(render.bounds, pointAWorld) ||
        Bounds.contains(render.bounds, pointBWorld)
      )
        constraints.push(constraint);
    }

    // transform the view
    CRender.startViewTransform(render);

    // update mouse
    if (render.mouse) {
      Mouse.setScale(render.mouse, {
        x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
        y: (render.bounds.max.y - render.bounds.min.y) / render.options.height
      });

      Mouse.setOffset(render.mouse, render.bounds.min);
    }
  } else {
    constraints = allConstraints;
    bodies = allBodies;

    if (render.options.pixelRatio !== 1) {
      render.context.setTransform(
        render.options.pixelRatio,
        0,
        0,
        render.options.pixelRatio,
        0,
        0
      );
    }
  }

  if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
    // fully featured rendering of bodies
    CRender.bodies(render, bodies, context);
  } else {
    if (options.showConvexHulls)
      CRender.bodyConvexHulls(render, bodies, context);

    // optimised method for wireframes only
    CRender.bodyWireframes(render, bodies, context);
  }

  if (options.showBounds) CRender.bodyBounds(render, bodies, context);

  if (options.showAxes || options.showAngleIndicator)
    CRender.bodyAxes(render, bodies, context);

  if (options.showPositions) CRender.bodyPositions(render, bodies, context);

  if (options.showVelocity) CRender.bodyVelocity(render, bodies, context);

  if (options.showIds) CRender.bodyIds(render, bodies, context);

  if (options.showSeparations)
    CRender.separations(render, engine.pairs.list, context);

  if (options.showCollisions)
    CRender.collisions(render, engine.pairs.list, context);

  if (options.showVertexNumbers) CRender.vertexNumbers(render, bodies, context);

  if (options.showMousePosition)
    CRender.mousePosition(render, render.mouse, context);

  CRender.constraints(constraints, context);

  if (options.showBroadphase && engine.broadphase.controller === Grid)
    CRender.grid(render, engine.broadphase, context);

  if (options.showDebug) CRender.debug(render, context);

  if (options.hasBounds) {
    // revert view transforms
    CRender.endViewTransform(render);
  }

  Events.trigger(render, "afterRender", event);
};*/

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
CRender.run(render);
