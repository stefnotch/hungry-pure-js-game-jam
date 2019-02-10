const Matter = require("./js/matter");
const { Engine, World, Bodies, Events, Runner } = Matter;
const CRender = require("./js/CustomRender");
const { engine, render, canvas, ctx } = require("./js/MatterSetup");
const OSWindow = require("./js/OSWindow");
const Actor = require("./js/Actor");
const Anthill = require("./js/Actors/Anthill");
const {
  allActors,
  foodCallbacks,
  addFood,
  tryRemoveFood,
  weapons
} = require("./js/GGlobals");

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxB, ground]);

let runner = Runner.create({
  delta: 1000 / 60,
  isFixed: true,
  enabled: true
});
Runner.run(runner, engine);

// run the engine
//Engine.run(engine);

Events.on(runner, "beforeTick", callback => {
  allActors.forEach(a => {
    a.update();
  });
});

Events.on(engine, "beforeUpdate", ev => {
  ev.source.world.bodies.forEach(b => {
    if (b.label instanceof Actor && b.label.type == "AntArea") {
      b.isStatic = true;
    }
  });
});

function getActualPosition(body) {
  let pos = Vector.create(0, 0);
  body.parts.forEach(p => {
    let partPos = Vector.create(0, 0);
    p.vertices.forEach(v => {
      partPos.x += v.x;
      partPos.y += v.y;
    });

    partPos.x /= p.vertices.length;
    partPos.y /= p.vertices.length;

    pos.x += partPos.x;
    pos.y += partPos.y;
  });
  pos.x /= body.parts.length;
  pos.y /= body.parts.length;

  return pos;
}

Events.on(engine, "afterUpdate", ev => {
  ev.source.world.bodies.forEach(b => {
    if (b.label instanceof Actor && b.label.type == "AntArea") {
      b.isStatic = false;
    }
  });
});

Events.on(engine, "collisionStart", ev => {
  ev.pairs.forEach(pair => {
    if (pair.bodyA.label instanceof Actor) {
      pair.bodyA.label.collision(pair.bodyB);
    }

    if (pair.bodyB.label instanceof Actor) {
      pair.bodyB.label.collision(pair.bodyA);
    }
  });
});

Events.on(engine, "collisionActive", ev => {
  ev.pairs.forEach(pair => {
    if (pair.bodyA.label instanceof Actor) {
      pair.bodyA.label.collisionStay(pair.bodyB);
    }

    if (pair.bodyB.label instanceof Actor) {
      pair.bodyB.label.collisionStay(pair.bodyA);
    }
  });
});

// run the renderer
CRender.run(render);

const foodDisplay = document.querySelector("#taskbar .food-display");
foodDisplay.innerText = 0;
foodCallbacks.push((food, newlyAddedFood) => {
  foodDisplay.innerText = food;
});

document.querySelectorAll(".explanation span").forEach((node, index) => {
  setTimeout(() => {
    node.style.opacity = "1";
  }, index * 900);
});

let gameStarted = false;
document.querySelector(".start-button").addEventListener("click", () => {
  document.querySelector(".explanation").style.display = "none";

  var y = new OSWindow({
    position: Matter.Vector.create(10, 10),
    size: Matter.Vector.create(300, 300),
    filePath: "./../"
  });

  new Actor(y.antArea, boxA, false);

  new Anthill(y.antArea);
  tryRemoveFood(2500);
  gameStarted = true;
});
// TODO: Remove this:
//document.querySelector(".start-button").click();

document.querySelector(".taskbar-buggo").addEventListener("mouseup", ev => {
  if (!gameStarted) {
    //alert("Nice try");
  }
  for (const actor of allActors) {
    if (actor.type == "Anthill") {
      actor.food += 300;
      addFood(500);
      break;
    }
  }
});

weapons.Downvote.mouseDown = () => {
  weapons.affectedActors
    .filter(body => body.label instanceof Actor)
    .forEach(body => {
      if (body.label.type == "Ant") {
        body.label.remove();
      }
    });
  weapons.setWeapon(weapons.Nothing);
};

weapons.Changedirectory.mouseDown = () => {
  weapons.setWeapon(weapons.Nothing);
};

const taskbar = document.body.querySelector("#taskbar");
document.body.addEventListener("mousedown", ev => {
  if (ev.target == taskbar || taskbar.contains(ev.target)) {
    return;
  }
  if (weapons._selectedWeapon.mouseDown) {
    weapons._selectedWeapon.mouseDown();
  }
});

document
  .querySelector(".taskbar-downvote")
  .addEventListener("mousedown", ev => {
    if (weapons._selectedWeapon == weapons.Nothing && tryRemoveFood(400)) {
      weapons.setWeapon(weapons.Downvote);
    }
  });

document
  .querySelector(".taskbar-changedir")
  .addEventListener("mousedown", ev => {
    if (weapons._selectedWeapon == weapons.Nothing && tryRemoveFood(1400)) {
      weapons.setWeapon(weapons.Changedirectory);
    }
  });
