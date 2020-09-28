/**
 * 依赖
 */
let md5 = require("md5-node");
let moment = require("moment");
let async = require("async");
let sqlClass = require("../helpers/mysql-auto-build-class");
sqlClass.setConfigPath("../configs/mysql.json");

exports.login = function (req, res, next) {
  var sqlObj = sqlClass.form("users");
  sqlObj.where("name", req.body.name).where("password", req.body.password);
  sqlObj.select(function (obj) {
    if (obj.error) {
      console.log(obj.errorInfo);
      res.sendStatus(500);
    } else {
      var user = obj.data[0];
      if (typeof user == "undefined" || typeof user == "null") {
        console.log(obj.errorInfo);
        res.sendStatus(401);
      } else {
        var token = req.body.name + Date.now().toString();
        token = md5(token);
        var days = 3;
        var daysAfter = moment(Date.now() + 24 * 3600 * days * 1000);
        sqlObj = sqlClass.form("users", {
          id: user.id,
          name: "'" + user.name + "'",
          token: "'" + token + "'",
          token_time_limit: daysAfter.format('"YYYY-MM-DD HH:mm:ss"'),
        });
        sqlObj.where("id", user.id);
        sqlObj.update(function (obj) {
          if (obj.error) {
            console.log(obj.errorInfo);
            res.send(500);
          } else {
            res.send(token);
          }
        });
      }
    }
  });
};
exports.post = function (req, res, next) {
  async.waterfall(
    [
      //获取文件并且上传
      function (cb) {
        require("../services/getFileSaved").getFileSaved(
          req.files["markdown"],
          function (err, filePath) {
            if (err) {
              cb(err);
            } else {
              cb(null, filePath);
            }
          },
        );
      },
      //存储入数据库
      function (filepath, cb) {
        let obj = {
          name: "'" + req.body.name + "'",
          description: "'" + req.body.description + "'",
          tags: "'" + JSON.stringify(req.body.tags) + "'",
          series_id: req.body.series_id,
          series_order: req.body.series_order,
          filepath: "'" + filepath + "'",
          create_time:
            "'" + moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "'",
        };
        require("../services/saveArchiveInDb").saveArchiveInDb(obj, function (
          err,
        ) {
          if (err) {
            cb(err);
          } else {
            cb(null);
          }
        });
      },
    ],
    function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(true);
      }
    },
  );
};
exports.deletion = function (req, res, next) {
  require("../services/deleteArchive").deleteArchives(
    req.body.archiveId,
    function (err, status) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(status);
      }
    },
  );
};

exports.createSeries = function (req, res, next) {
  require("../services/series").createSeries(req.body.name, req.body.description, function (
    err,
    status,
  ) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(status);
    }
  });
};

exports.deleteSeries = function (req, res, next) {
  require("../services/series").deleteSeries(req.body.del_series_id, function (
    err,
    status,
  ) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(status);
    }
  });
};
