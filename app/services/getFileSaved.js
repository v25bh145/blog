let fs = require("fs");
exports.getFileSaved = function (file, cb) {
  fs.readFile(file.path, function (err, data) {
    if (err) {
      cb(err);
    } else {
      var dir_file =
        __dirname + "/../../public/markdowns/" + file.originalFilename;
      fs.writeFile(dir_file, data, function (err) {
        if (err) {
          cb(err);
        } else {
          cb(null, dir_file);
        }
      });
    }
  });
};
