const Matter = require("matter-js");
const { World, Bodies } = Matter;
const { engine } = require("./GGlobals");
const CRender = require("./CustomRender");
const canvasOverlayElement = document.getElementById("canvasOverlay");

let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

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

module.exports = {
  engine: engine,
  render: render,
  canvas: canvas,
  ctx: ctx
};
