let sqlClass = require("../helpers/mysql-auto-build-class");
sqlClass.setConfigPath("../configs/mysql.json");
/**
 * 验证用户是否拥有权限
 * @param {Number} id 用户id
 * @param {String} pwd 用户密码
 * @param {String} token 用户token
 */
module.exports = function (req, res, next) {
  if (req.url === "/login") {
    next();
  } else if (
    typeof req.body.token == "null" ||
    typeof req.body.token == "undefined"
  ) {
    res.sendStatus(401);
  } else {
    var sqlObj = sqlClass.form("users");
    sqlObj.where("token", req.body.token);
    sqlObj.select(function (obj) {
      if (obj.error) {
        res.send(obj.errorInfo);
      } else {
        if (typeof obj.data != "object" || obj.data.length == 0) {
          res.send(401);
        } else {
          next();
        }
      }
    });
  }
};
