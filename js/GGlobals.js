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
    mouseIcon: `url("./css/MaterialIcons/baseline_thumb_down_black_18dp.png"), auto `,
    mouseDown: () => {}
  },
  Changedirectory: {
    mouseIcon: "pointer",
    mouseDown: () => {}
  },
  setWeapon: weapon => {
    if (weapon.mouseIcon) {
      document.body.style.cursor = weapon.mouseIcon;
    } else {
      document.body.style.removeProperty("cursor");
    }
    weapons._selectedWeapon = weapon;
  },
  _selectedWeapon: undefined,
  affectedActors: [],
  mouseBounds: {
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 }
  }
};

weapons._selectedWeapon = weapons.Nothing;

module.exports = {
  osWindowsContainer: osWindowsContainer,
  engine: engine,
  allActors: allActors,
  addFood: addFood,
  tryRemoveFood: tryRemoveFood,
  foodCallbacks: foodCallbacks,
  weapons: weapons
};
