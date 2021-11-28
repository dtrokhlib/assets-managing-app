const fs = require("fs");

const removeFile = (filename, destination) => {
  fs.unlink(`${destination}/${filename}`, (e) => {
    if (e) {
      return false;
    }
  });
  return true;
};

module.exports = removeFile;
