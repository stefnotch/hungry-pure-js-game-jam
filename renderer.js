const Matter = require("matter-js");
const { Engine, World, Bodies } = Matter;
const CRender = require("./js/CustomRender");
const { engine, render, canvas, ctx } = require("./js/MatterSetup");
const OSWindow = require("./js/OSWindow");
const CachedFS = require("./js/CachedFS");
const Actor = require("./js/Actor");

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
CRender.run(render);

var x = new OSWindow(document.querySelector(".os-window-template"), {
  position: Matter.Vector.create(0, 0),
  size: Matter.Vector.create(300, 300),
  filePath: ".",
  render: render
});

var y = new OSWindow(document.querySelector(".os-window-template"), {
  position: Matter.Vector.create(0, 0),
  size: Matter.Vector.create(300, 300),
  filePath: ".",
  render: render
});

y.antArea.addActor(new Actor(y.antArea, boxA, true));
