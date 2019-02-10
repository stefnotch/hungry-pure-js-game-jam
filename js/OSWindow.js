const interact = require("interactjs");
const CachedFS = require("./CachedFS");
const RenderCall = require("./RenderCall");
const GGlobals = require("./GGlobals");
const AntArea = require("./AntArea");
const Food = require("./Actors/Food");
const path = require("path");
const Matter = require("./matter");
const Anthill = require("./Actors/Anthill");

const HtmlTemplate = document.querySelector(".os-window-template");

class OSWindow {
  /**
   *
   * @param {OSWindowOptions} options
   */
  constructor(options) {
    this.element = document.importNode(HtmlTemplate.content, true);
    if (!options) {
      options = {};
    }
    if (!options.position) {
      options.position = { x: 0, y: 0 };
    }

    if (!options.size) {
      options.size = { x: 0, y: 0 };
    }
    if (!options.filePath) {
      options.filePath = ".";
    }
    this.options = options;

    /** @type {OSWindowData} */
    this.data = {};

    // Append elements and stuff
    this.element = GGlobals.osWindowsContainer.add(this);

    //this.render = this.options.render;
    this.renderDiv = this.element; // this.element.querySelector(".window-content");

    this.reposition();
    this.resize();

    this.updateInsertText();

    this.setupInteraction();

    this.renderCall = new RenderCall();
    this.updateRenderSize();
    this.antArea = new AntArea(this.renderCall);
    this.renderCall.actors = this.antArea.actors;

    this.cachedFS = new CachedFS(options.filePath);
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
          min: { width: 200, height: 200 }
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

    let filesElement = this.element.querySelector(".window-folders-and-files");
    this.cachedFS.getFolders().forEach(entry => {
      let fileElement = document.createElement("div");
      fileElement.className = "folder";
      fileElement.innerHTML = `<i class="material-icons">folder_open</i><span class="fix-material-other">${
        entry.name
      }</span>`;
      filesElement.appendChild(fileElement);

      let rect = fileElement.getBoundingClientRect();
      if (!entry.eaten) {
        new Food(
          this.antArea,
          { x: rect.x + Math.random() * rect.width * 0.5, y: rect.y },
          100, // TODO: Increase this to 2000
          f => {
            let percentage = Math.min((f.food / f.maxFood) * 100, 100);
            fileElement.style.background = `linear-gradient(90deg, white ${percentage}%, transparent 0%)`;
          },
          f => {
            entry.eaten = true;
            let newWindow = new OSWindow({
              position: Matter.Vector.create(
                Math.random() * document.body.clientWidth * 0.5,
                Math.random() * document.body.clientHeight * 0.5
              ),
              size: Matter.Vector.create(300, 300),
              filePath: path.join(this.cachedFS.folderPath, entry.name)
            });

            new Anthill(newWindow.antArea);
          }
        );
      }
    });

    this.cachedFS.getFiles().forEach(entry => {
      let fileElement = document.createElement("div");
      fileElement.className = "file";
      fileElement.innerHTML = `<i class="material-icons">book</i><span class="fix-material-other">${
        entry.name
      }</span>`;
      filesElement.appendChild(fileElement);

      let rect = fileElement.getBoundingClientRect();
      if (!entry.eaten) {
        new Food(
          this.antArea,
          { x: rect.x + Math.random() * rect.width * 0.5, y: rect.y },
          entry.stats.size,
          f => {
            let percentage = Math.min((f.food / f.maxFood) * 100, 100);
            fileElement.style.background = `linear-gradient(90deg, white ${percentage}%, transparent 0%)`;
          },
          f => {
            entry.eaten = true;
          }
        );
      }
    });
  }

  updateRenderSize() {
    if (!this.renderCall) return;

    let renderRect = this.renderDiv.getBoundingClientRect();

    this.renderCall.position.x = renderRect.x;
    this.renderCall.position.y = renderRect.y;
    this.renderCall.size.x = renderRect.width;
    this.renderCall.size.y = renderRect.height;
    //this.renderCall.zIndex

    if (this.antArea) this.antArea.updateBoundingBox();
  }
}

module.exports = OSWindow;
