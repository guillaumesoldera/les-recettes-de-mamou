const fs = require('fs');
const path = require('path');
const rimraf = require("rimraf");


const cache = {};

exports.readFile = (path) => {
  let cached = cache[path];
  if (!cached) {
    cached = fs.readFileSync(path).toString('utf8');
    cache[path] = cached;
  }
  return cached;
}

exports.writeFile = (fileContent, path) => {
  const dir = path.substring(0, path.lastIndexOf("/"))
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(path, fileContent);
}

exports.deleteDirectoryContent = (directory, finalCallback) => {
  rimraf(directory, finalCallback);
    //this.forEachFile(directory, (directory, file) => {
    //    fs.unlinkSync(path.join(directory, file), err => {
    //        if (err) throw err;
    //      });
    //}, finalCallback)
}

exports.forEachFile = (directory, callback, finalCallback) => {
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        callback(directory, file)
      }
      if (finalCallback) {
        finalCallback()    
      }
    });
}

exports.createDirSync = (directory) => {
  fs.mkdirSync(directory);
}