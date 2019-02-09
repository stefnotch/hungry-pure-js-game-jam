const { Vector } = require("matter-js");
const { engine } = require("./GGlobals");
const { World, Body } = require("matter-js");
const Actor = require("./Actor");

let collGroupIndex = 0;
function getNextIndex() {
  collGroupIndex++;
  return collGroupIndex;
}

class AntArea {
  constructor(renderCall) {
    this.collisionGroup = getNextIndex();
    this.renderCall = renderCall;

    /** @type {Actor[]} */
    this.actors = [];

    this.position = Vector.clone(renderCall.position);
    this.size = Vector.clone(renderCall.size);

    this.updateBoundingBox();
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
    this.size.x = this.renderCall.size.x;
    this.size.y = this.renderCall.size.y;
  }
  /**
   *
   * @param {Actor} actor
   */
  addActor(actor) {
    actor.antArea = this;
    this.actors.push(actor);
    let body = actor.body;
    body.collisionFilter.group = this.collisionGroup;
    body.collisionFilter.mask = 0;
    World.add(engine.world, [body]);
  }

  /**
   *
   * @param {Actor} actor
   */
  removeActor(actor) {
    this.actors.splice(this.actors.indexOf(actor), 1);

    let body = actor.body;
    World.remove(engine.world, [body]);

    actor.antArea = null;
  }
}

module.exports = AntArea;
