let moment = require("moment");
let sqlClass = require("../helpers/mysql-auto-build-class");
sqlClass.setConfigPath("../configs/mysql.json");
exports.createSeries = function (name, description, cb) {
  let data = {
    name: "'" + name + "'",
    description: "'" + description + "'",
    create_time: "'" + moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "'",
  };
  let sqlObj = sqlClass.form("series", data);
  sqlObj.insert(function (obj) {
    if (obj.error) {
      cb(obj.errorInfo);
    } else {
      cb(null, obj.data);
    }
  });
};
exports.deleteSeries = function (id, cb) {
  let sqlObj = sqlClass.form("series");
  sqlObj.where("id", id).delete(function (obj) {
    if (obj.error) {
      cb(obj.errorInfo);
    } else {
      cb(null, true);
    }
  });
};
