const fs = require("fs");
const path = require("path");

let fsCache = new Map();

class Entry {
  constructor(name, stats) {
    this.name = name;
    /** @type {fs.Stats} */
    this.stats = stats;
  }
}

class CachedFolder {
  constructor(folderPath) {
    folderPath = path.resolve(folderPath);
    this.folderPath = folderPath;

    /**@type {Entry[]} */
    this.files = [];
    /**@type {Entry[]} */
    this.folders = [new Entry("..", new fs.Stats())];
    fs.readdirSync(this.folderPath).forEach(file => {
      let stats = fs.statSync(path.join(this.folderPath, file));

      let isFolder = stats.isDirectory();

      if (isFolder) {
        this.folders.push(new Entry(file, stats));
      } else {
        this.files.push(new Entry(file, stats));
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

  get folderName() {
    return path.basename(this._folderPath);
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
