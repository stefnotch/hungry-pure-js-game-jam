const OSWindowsContainerElement = document.getElementById(
  "os-windows-container"
);

class OSWindowsContainer {
  constructor() {
    this.osWindows = [];
    this.containerElement = OSWindowsContainerElement;
  }

  add(osWindow) {
    this.osWindows.push(osWindow);
    this.containerElement.appendChild(osWindow.element);

    return this.containerElement.lastElementChild;
  }

  moveToFront(osWindow) {
    this.osWindows.splice(this.osWindows.indexOf(osWindow), 1);
    this.osWindows.push(osWindow);
    this.containerElement.appendChild(osWindow.element);
  }

  remove(osWindow) {
    this.osWindows.splice(this.osWindows.indexOf(osWindow), 1);
    this.containerElement.removeChild(osWindow.element);
  }
}

module.exports = OSWindowsContainer;
