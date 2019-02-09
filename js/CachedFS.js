const fs = require("fs");
const path = require("path");

let fsCache = new Map();

class CachedFolder {
  constructor(folderPath) {
    folderPath = path.resolve(folderPath);
    this.folderPath = folderPath;

    /**@type {string[]} */
    this.files = [];
    /**@type {string[]} */
    this.folders = [".."];
    fs.readdirSync(this.folderPath).forEach(file => {
      let isFolder = fs
        .statSync(path.join(this.folderPath, file))
        .isDirectory();
      if (isFolder) {
        this.folders.push(file);
      } else {
        this.files.push(file);
      }
    });
  }
}

class CachedFSInstance {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  get folderPath() {
    return this._folderPath;
  }

  set folderPath(newPath) {
    newPath = path.resolve(newPath);
    this._folderPath = newPath;
  }

  getFiles() {
    /** @type {CachedFolder} */
    let cachedFolder;
    if (fsCache.has(this.folderPath)) {
      cachedFolder = fsCache.get(this.folderPath);
    } else {
      cachedFolder = new CachedFolder(this.folderPath);
      fsCache.set(this.folderPath, cachedFolder);
    }

    return cachedFolder.files;
  }

  getFolders() {
    /** @type {CachedFolder} */
    let cachedFolder;
    if (fsCache.has(this.folderPath)) {
      cachedFolder = fsCache.get(this.folderPath);
    } else {
      cachedFolder = new CachedFolder(this.folderPath);
      fsCache.set(this.folderPath, cachedFolder);
    }

    return cachedFolder.folders;
  }

  goUp() {
    let newPath = path.join(this.folderPath, "..");
    let isFolder = fs.statSync(newPath).isDirectory();
    if (!isFolder) return;

    this.folderPath = newPath;
  }

  goToFolder(folderName) {
    let newPath = path.join(this.folderPath, folderName);
    let isFolder = fs.statSync(newPath).isDirectory();
    if (!isFolder) return;

    this.folderPath = newPath;
  }
}

module.exports = CachedFSInstance;
