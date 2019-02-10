const OSWindowsContainer = require("./OSWindowsContainer");
const { Engine } = require("./matter");

let osWindowsContainer = new OSWindowsContainer();
let engine = Engine.create();
let allActors = new Set();

module.exports = {
  osWindowsContainer: osWindowsContainer,
  engine: engine,
  allActors: allActors
};
