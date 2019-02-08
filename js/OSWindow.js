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

    // Append elements and stuff
    document.body.appendChild(this.element);

    this.element = document.body.lastElementChild;

    this.element.style.top = (options.position.x || 0) + "px";
    this.element.style.left = (options.position.y || 0) + "px";

    this.element.style.width = (options.size.x || 0) + "px";
    this.element.style.height = (options.size.y || 0) + "px";
  }
}

module.exports = OSWindow;
