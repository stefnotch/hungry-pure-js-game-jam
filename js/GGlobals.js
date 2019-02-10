const OSWindowsContainer = require("./OSWindowsContainer");
const { Engine } = require("./matter");

let osWindowsContainer = new OSWindowsContainer();
let engine = Engine.create();
let allActors = new Set();
let collectedFood = 0;
let foodCallbacks = [];
function addFood(food) {
  collectedFood += food;
  // Food and previous food
  foodCallbacks.forEach(c => c(collectedFood, collectedFood - food));
}

module.exports = {
  osWindowsContainer: osWindowsContainer,
  engine: engine,
  allActors: allActors,
  addFood: addFood,
  collectedFood: collectedFood,
  foodCallbacks: foodCallbacks
};
