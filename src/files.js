const fs = require('fs');
const path = require('path');


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
    fs.writeFileSync(path, fileContent);
}

exports.deleteDirectoryContent = (directory, finalCallback) => {
    this.forEachFile(directory, (directory, file) => {
        fs.unlinkSync(path.join(directory, file), err => {
            if (err) throw err;
          });
    }, finalCallback)
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