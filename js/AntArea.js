const { Vector } = require("matter-js");
const { engine } = require("./GGlobals");
let collGroupIndex = 0;
function getNextIndex() {
  collGroupIndex++;
  return collGroupIndex;
}

class AntArea {
  constructor(renderCall) {
    this.collisionGroup = getNextIndex();
    this.renderCall = renderCall;

    this.updateBoundingBox();
  }

  updateBoundingBox() {
    /*
    this.renderCall.position.x = renderRect.x;
    this.renderCall.position.y = renderRect.y;
    this.renderCall.size.x = renderRect.width;
    this.renderCall.size.y = renderRect.height;
    */
  }
}

module.exports = AntArea;
