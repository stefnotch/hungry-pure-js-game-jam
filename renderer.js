const Matter = require("matter-js");
const { Engine, World, Bodies } = Matter;
const CRender = require("./js/CustomRender");
const { engine, render, canvas, ctx } = require("./js/MatterSetup");
const OSWindow = require("./js/OSWindow");
const CachedFS = require("./js/CachedFS");

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
CRender.run(render);

var x = new OSWindow(document.querySelector(".os-window-template"), {
  position: Matter.Vector.create(0, 0),
  size: Matter.Vector.create(300, 300),
  filePath: "."
});

var y = new OSWindow(document.querySelector(".os-window-template"), {
  position: Matter.Vector.create(0, 0),
  size: Matter.Vector.create(300, 300),
  filePath: "."
});

var cfs = new CachedFS(".");
console.log(cfs.getFolders());
console.log(cfs.getFiles());
console.log(cfs.folderName);
//cfs.goToFolder("name");
//cfs.goUp();
