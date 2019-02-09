const interact = require("interactjs");
const OSWindowsContainer = document.getElementById("os-windows-container");

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

    // Append elements and stuff
    OSWindowsContainer.appendChild(this.element);

    this.element = OSWindowsContainer.lastElementChild;

    this.reposition();
    this.resize();

    this.updateInsertText();

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
      OSWindowsContainer.appendChild(this.element);
    }
  }

  reposition() {
    this.element.style.left = (this.options.position.x || 0) + "px";
    this.element.style.top = (this.options.position.y || 0) + "px";
  }

  resize() {
    this.element.style.width = (this.options.size.x || 0) + "px";
    this.element.style.height = (this.options.size.y || 0) + "px";
  }

  updateInsertText() {
    [...this.element.getElementsByTagName("insert-text")].forEach(element => {
      let nameAttribute = element.getAttribute("name");
      if (this.options[nameAttribute]) {
        element.innerText = this.options[nameAttribute];
      } else {
        element.innerText = "";
      }
    });
  }
}

module.exports = OSWindow;
