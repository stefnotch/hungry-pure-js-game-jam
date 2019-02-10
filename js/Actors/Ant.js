const { Vector, Body, Bodies } = require("matter-js");
const Actor = require("./../Actor");

const States = {
  searching: 0,
  searchingExtended: 1,
  eating: 2,
  backHome: 3
};

let TARGET_TICKS = 100;
let SPEED = 0.02;
let ANGULAR_VELOCITY = 0.001;

// Plus/Minus PI
function normalizeAngle(angle) {
  let TwoPI = Math.PI * 2;

  // reduce the angle
  angle = angle % TwoPI;

  // force it to be the positive remainder, so that 0 <= angle < 360
  angle = (angle + TwoPI) % TwoPI;

  // force into the minimum absolute value residue class, so that -180 < angle <= 180
  if (angle > Math.PI) angle -= TwoPI;

  return angle;
}

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

class Ant extends Actor {
  /**
   *
   * @param {*} antArea
   */
  constructor(antArea, position) {
    super(
      antArea,
      Bodies.rectangle(position.x, position.y + 20, 20, 10),
      false
    );
    this.type = "Ant";
    this.body.frictionAir = 0.02;

    this.tickCount = 0;
    this.health = 3;

    this.state = States.searching;
    this.direction = Vector.create(
      Math.cos(this.body.angle),
      Math.sin(this.body.angle)
    );

    /** @type {Vector} */
    this.target = antArea.randomPosition();
  }

  update() {
    super.update();

    if (this.tickCount > TARGET_TICKS) {
      this.tickCount = 0;
      this.target = this.antArea.randomPosition();

      if (this.health <= 0) {
        this.remove();
      }
    }

    let dir = Vector.sub(this.target, this.body.position);
    let dirAngle = Math.atan2(dir.y, dir.x);
    let bodyAngle = normalizeAngle(this.body.angle);
    let angularVelocity = dirAngle - bodyAngle;
    if (angularVelocity > ANGULAR_VELOCITY) {
      angularVelocity = ANGULAR_VELOCITY;
    } else if (angularVelocity < -ANGULAR_VELOCITY) {
      angularVelocity = -ANGULAR_VELOCITY;
    }
    // Slow angular velocity
    this.body.angle += angularVelocity;

    this.direction = Vector.create(
      Math.cos(this.body.angle) * SPEED,
      Math.sin(this.body.angle) * SPEED
    );

    this.body.position = Vector.add(this.body.position, this.direction);

    //let pos = getActualPosition(this.body);
    //this.body.position = pos;
  }

  draw(ctx) {
    let pos = getActualPosition(this.body);
    //this.body.position = pos;
    //let pos = this.body.position;

    ctx.fillStyle = "red";
    ctx.fillRect(this.target.x, this.target.y, 10, 10);

    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.body.angle);
    //

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.ellipse(7, 0, 3, 2, 0, 0, 2 * Math.PI);
    ctx.ellipse(0, 0, 5, 2, 0, 0, 2 * Math.PI);
    ctx.ellipse(-7, 0, 4, 2.5, 0, 0, 2 * Math.PI);
    ctx.fill();
    //ctx.strokeStyle = "black";
    //ctx.stroke();
    //ctx.translate(-pos.x, -pos.y);
    ctx.resetTransform();

    /*
    let c = ctx;
    let body = this.body;

    ctx.fillStyle = "black";
    ctx.fillRect(pos.x, pos.y, 10, 10);

    c.beginPath();

    // handle compound parts
    for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
      let part = body.parts[k];

      c.moveTo(part.vertices[0].x, part.vertices[0].y);

      for (let j = 1; j < part.vertices.length; j++) {
        if (!part.vertices[j - 1].isInternal || showInternalEdges) {
          c.lineTo(part.vertices[j].x, part.vertices[j].y);
        } else {
          c.moveTo(part.vertices[j].x, part.vertices[j].y);
        }

        if (part.vertices[j].isInternal && !showInternalEdges) {
          c.moveTo(
            part.vertices[(j + 1) % part.vertices.length].x,
            part.vertices[(j + 1) % part.vertices.length].y
          );
        }
      }

      c.lineTo(part.vertices[0].x, part.vertices[0].y);
    }

    c.lineWidth = 2;
    c.strokeStyle = "#000";
    c.stroke();*/
  }

  /**
   *
   * @param {Body} other
   */
  collision(other) {
    //console.log(other.label.type);
    if (other.label instanceof Actor && other.label.type == "AntArea") {
      //this.health -= 3;
    }
  }
}

module.exports = Ant;
