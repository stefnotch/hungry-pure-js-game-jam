const OSWindowsContainer = require("./OSWindowsContainer");
const { Engine } = require("matter-js");

let osWindowsContainer = new OSWindowsContainer();
let engine = Engine.create();

module.exports = { osWindowsContainer: osWindowsContainer, engine: engine };
