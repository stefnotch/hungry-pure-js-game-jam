const Matter = require("./matter");
const { World, Bodies, Vector } = Matter;
const { engine, weapons } = require("./GGlobals");
const CRender = require("./CustomRender");
const canvasOverlayElement = document.getElementById("canvasOverlay");

let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

engine.world.gravity.x = 0;
engine.world.gravity.y = 0;

let render = CRender.create({
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

let mouse = Matter.Mouse.create(document.body);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: true
    }
  }
});

Matter.Events.on(mouseConstraint, "mousemove", ev => {
  let pos = ev.mouse.absolute;
  let oN = 1;
  let oP = 5;
  weapons.mouseBounds = {
    min: { x: pos.x - oN, y: pos.y - oN },
    max: { x: pos.x + oP, y: pos.y + oP }
  };
});
World.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

module.exports = {
  engine: engine,
  render: render,
  canvas: canvas,
  ctx: ctx
};
