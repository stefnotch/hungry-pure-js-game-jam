const Matter = require("matter-js");
const { Engine, Render, World, Bodies } = Matter;
const canvasOverlayElement = document.getElementById("canvasOverlay");
let engine = Engine.create();

let render = Render.create({
  element: canvasOverlayElement,
  engine: engine
});

let resizeTimeout;
let resizeCanvas = function() {
  render.canvas.width = canvasOverlayElement.offsetWidth;
  render.canvas.height = canvasOverlayElement.offsetHeight;
};
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 300);
});
resizeCanvas();

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

//Render.setPixelRatio(render, "auto");
// run the renderer
Render.run(render);
