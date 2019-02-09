const interact = require("interactjs");
const CachedFS = require("./CachedFS");
const RenderCall = require("./RenderCall");
const GGlobals = require("./GGlobals");
const AntArea = require("./AntArea");

class OSWindow {
  /**
   *
   * @param {HTMLTemplateElement} templateElement
   * @param {OSWindowOptions} options
   */
  constructor(templateElement, options) {
    this.element = document.importNode(templateElement.content, true);
    if (!options) {
      options = {};
    }
    if (!options.position) {
      options.position = { x: 0, y: 0 };
    }

    if (!options.size) {
      options.size = { x: 0, y: 0 };
    }
    this.options = options;

    /** @type {OSWindowData} */
    this.data = {};

    // Append elements and stuff
    this.element = GGlobals.osWindowsContainer.add(this);

    this.render = this.options.render;
    this.renderDiv = this.element.querySelector(".window-content");

    this.reposition();
    this.resize();

    this.updateInsertText();

    this.setupInteraction();

    this.renderCall = new RenderCall();
    this.antArea = new AntArea(this.renderCall);

    this.cachedFS = new CachedFS(".");
    this.renderFS();
  }

  setupInteraction() {
    let self = this;
    interact(this.element)
      .draggable({
        allowFrom: ".window-titlebar",
        inertia: true,
        onmove: function(event) {
          self.options.position.x += event.dx;
          self.options.position.y += event.dy;
          self.reposition();
          self.moveToFront();
        }
      })
      .resizable({
        inertia: true,
        edges: { left: true, right: true, bottom: true, top: false },
        restrictSize: {
          min: { width: 100, height: 50 }
        },
        allowFrom: ".window-resize-handler"
      })
      .on("resizemove", function(event) {
        // resize
        self.options.size.x = event.rect.width;
        self.options.size.y = event.rect.height;
        self.resize();

        // translate when resizing from top or left edges
        self.options.position.x += event.deltaRect.left;
        self.options.position.y += event.deltaRect.top;
        self.reposition();
        self.moveToFront();
      })
      .pointerEvents({
        ignoreFrom: ".no-pointer"
      })
      .on("down", function(event) {
        self.moveToFront();
      });
  }

  moveToFront() {
    if (this.element.nextElementSibling) {
      GGlobals.osWindowsContainer.moveToFront(this);
    }
  }

  reposition() {
    this.element.style.left = (this.options.position.x || 0) + "px";
    this.element.style.top = (this.options.position.y || 0) + "px";

    this.updateRenderSize();
  }

  resize() {
    this.element.style.width = (this.options.size.x || 0) + "px";
    this.element.style.height = (this.options.size.y || 0) + "px";

    this.updateRenderSize();
  }

  updateInsertText() {
    [...this.element.getElementsByTagName("insert-text")].forEach(element => {
      let nameAttribute = element.getAttribute("name");
      if (this.options[nameAttribute]) {
        element.innerText = this.options[nameAttribute];
      } else if (this.data[nameAttribute]) {
        element.innerText = this.data[nameAttribute];
      } else {
        element.innerText = "";
      }
    });
  }

  renderFS() {
    this.data.folderName = this.cachedFS.folderName;
    this.data.itemCount =
      this.cachedFS.getFiles().length + this.cachedFS.getFolders().length;
    this.updateInsertText();

    this.updateRenderSize();
  }

  updateRenderSize() {
    if (!this.renderCall) return;

    let renderRect = this.renderDiv.getBoundingClientRect();

    this.renderCall.position.x = renderRect.x;
    this.renderCall.position.y = renderRect.y;
    this.renderCall.size.x = renderRect.width;
    this.renderCall.size.y = renderRect.height;
    //this.renderCall.zIndex

    this.antArea.updateBoundingBox();
  }
}

module.exports = OSWindow;
