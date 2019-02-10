const { Vector } = require("./matter");
const { engine } = require("./GGlobals");
const { World, Body, Bodies } = require("./matter");
const Actor = require("./Actor");
const CorpseActor = require("./Actors/CorpseActor");

let collGroupIndex = 0;
function getNextIndex() {
  collGroupIndex++;
  return collGroupIndex;
}

const TOP_BAR_HEIGHT = 25;

class AntArea {
  constructor(renderCall) {
    this.collisionGroup = getNextIndex();
    this.renderCall = renderCall;

    /** @type {Actor[]} */
    this.actors = [];

    /** @type {Actor} */
    this.bbActor = undefined; // new Actor();
    this.bbParts = {
      top: [],
      left: [],
      right: [],
      bottom: []
    };
    this.bbPartsHealth = {
      top: [],
      left: [],
      right: [],
      bottom: []
    };
    this.bbPartsDead = {
      top: [],
      left: [],
      right: [],
      bottom: []
    };

    this.position = Vector.clone(renderCall.position);
    this.size = Vector.clone(renderCall.size);

    this.updateBoundingBox();
    this.createBoundingBox();
  }

  containsPoint(pointX, pointY) {
    return (
      this.position.x <= pointX &&
      pointX <= this.position.x + this.size.x &&
      this.position.y <= pointY &&
      pointY <= this.position.y + this.size.y
    );
  }

  createBoundingBox() {
    this.removeActor(this.bbActor);
    this.bbPartsDead.right.forEach(p => this.removeActor(p));
    this.bbPartsDead.right = [];
    this.bbPartsDead.left.forEach(p => this.removeActor(p));
    this.bbPartsDead.left = [];
    // 3 to 5 segments
    let leftCount =
      this.bbParts.left.length || 3 + Math.floor(Math.random() * 3);
    // 3 to 5 segments
    let rightCount =
      this.bbParts.right.length || 3 + Math.floor(Math.random() * 3);

    this.bbParts = {
      top: [],
      left: [],
      right: [],
      bottom: []
    };
    let thiccness = 10;

    let top = Bodies.rectangle(
      this.position.x + this.size.x / 2,
      this.position.y + TOP_BAR_HEIGHT / 2,
      this.size.x - thiccness * 4,
      TOP_BAR_HEIGHT
    );

    this.bbParts.top.push(top);

    let leftSegmentSize = (1 / leftCount) * this.size.y;
    for (let i = 0; i < leftCount; i++) {
      let spawnCorpse = false;
      if (this.bbPartsHealth.left[i] <= 0) {
        if (this.bbPartsDead.left[i] === undefined) {
          // Spawn a wall-corpse
          spawnCorpse = true;
        }
      }
      let left = Bodies.rectangle(
        this.position.x + this.size.x - thiccness / 2,
        this.position.y + i * leftSegmentSize + leftSegmentSize / 2,
        thiccness,
        leftSegmentSize
      );

      if (spawnCorpse) {
        this.bbPartsDead.left[i] = new CorpseActor(this, left);
      } else {
        this.bbParts.left.push(left);
      }
    }

    let rightSegmentSize = (1 / rightCount) * this.size.y;
    for (let i = 0; i < rightCount; i++) {
      let spawnCorpse = false;
      if (this.bbPartsHealth.right[i] <= 0) {
        if (this.bbPartsDead.right[i] === undefined) {
          // Spawn a wall-corpse
          spawnCorpse = true;
        }
      }
      let right = Bodies.rectangle(
        this.position.x + thiccness / 2,
        this.position.y + i * rightSegmentSize + rightSegmentSize / 2,
        thiccness,
        rightSegmentSize
      );

      if (spawnCorpse) this.bbPartsDead.right[i] = new CorpseActor(this, right);
      else this.bbParts.right.push(right);
    }

    let bottom = Bodies.rectangle(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y - TOP_BAR_HEIGHT / 2,
      this.size.x - thiccness * 4,
      TOP_BAR_HEIGHT
    );
    this.bbParts.bottom.push(bottom);

    let bbBody = Body.create({
      parts: this.bbParts.top.concat(
        this.bbParts.left,
        this.bbParts.right,
        this.bbParts.bottom
      ),
      restitution: 1
    });

    this.bbActor = new Actor(this, bbBody, true);
    this.bbActor.body.parts.forEach(p => (p.label = this.bbActor));
    this.bbActor.type = "AntArea";
  }

  updateBoundingBox() {
    let positionDelta = Vector.sub(this.renderCall.position, this.position);
    this.actors
      .filter(actor => actor.isStatic)
      .forEach(actor => {
        Body.setPosition(
          actor.body,
          Vector.add(this.renderCall.position, actor.positionDelta)
        );
      });

    this.position.x = this.renderCall.position.x;
    this.position.y = this.renderCall.position.y;
    if (
      this.size.x != this.renderCall.size.x ||
      this.size.y != this.renderCall.size.y
    ) {
      this.size.x = this.renderCall.size.x;
      this.size.y = this.renderCall.size.y;

      this.createBoundingBox();
    }
  }

  /**
   *
   * @param {Actor} actor
   */
  addActor(actor) {
    // Only add actor if it hasn't already been added
    let index = this.actors.indexOf(actor);
    if (index !== -1) return actor;

    actor.antArea = this;
    this.actors.push(actor);
    let body = actor.body;
    body.collisionFilter.group = this.collisionGroup;
    body.collisionFilter.mask = 0;
    World.add(engine.world, [body]);

    return actor;
  }

  /**
   *
   * @param {Actor} actor
   */
  removeActor(actor) {
    if (actor === undefined || actor === null) return;

    let index = this.actors.indexOf(actor);
    if (index !== -1) this.actors.splice(index, 1);

    let body = actor.body;
    World.remove(engine.world, [body], true);
    actor.antArea = null;
  }

  randomPosition() {
    return Vector.create(
      this.position.x + (Math.random() + 0.1) * this.size.x * 0.75,
      this.position.y + (Math.random() + 0.2) * this.size.y * 0.7
    );
  }
}

module.exports = AntArea;
