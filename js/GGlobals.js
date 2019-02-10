const OSWindowsContainer = require("./OSWindowsContainer");
const { Engine, Bounds, Vector } = require("./matter");

let osWindowsContainer = new OSWindowsContainer();
let engine = Engine.create();
let allActors = new Set();
let collectedFood = 0;
let foodCallbacks = [];
function tryRemoveFood(food) {
  if (collectedFood > food) {
    collectedFood -= food;
    foodCallbacks.forEach(c => c(collectedFood, collectedFood - food));
    return true;
  }
  return false;
}
function addFood(food) {
  collectedFood += food;
  // Food and previous food
  foodCallbacks.forEach(c => c(collectedFood, collectedFood - food));
}

let weapons = {
  Nothing: {},
  Downvote: {
    mouseIcon: "./css/MaterialIcons/baseline_thumb_down_black_18dp.png",
    mouseDown: () => {}
  },
  setWeapon: weapon => {
    if (weapon.mouseIcon) {
      document.body.style.cursor = `url("${weapon.mouseIcon}"), auto`;
    } else {
      document.body.style.removeProperty("cursor");
    }
    weapons._selectedWeapon = weapon;
  },
  _selectedWeapon: {},
  affectedActors: [],
  mouseBounds: {
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 }
  }
};

module.exports = {
  osWindowsContainer: osWindowsContainer,
  engine: engine,
  allActors: allActors,
  addFood: addFood,
  tryRemoveFood: tryRemoveFood,
  foodCallbacks: foodCallbacks,
  weapons: weapons
};
