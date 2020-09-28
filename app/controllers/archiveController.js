var async = require("async");
/**
 * 搜索
 */
exports.search = function (req, res, next) {
  let search = req.query.search + "";
  if (search == "undefined" || search == "null")
    res.send("please input correct search!");
  require("../services/search").search(search, function (err, data) {
    if (err == "NO INFORMATION") {
      res.render("search", {
        title: search == "" ? "全部文章" : search,
        subtitle: search == "" ? "——v25bh145" : "搜索结果",
        res: [
          {
            id: 0,
            name: "NO INFORMATION",
            description: "please check your input",
            tags: null,
            series_id: 0,
            series_order: 0,
            filepath: null,
            create_time: null,
          },
        ],
      });
    } else if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(data);
      res.render("search", {
        title: search == "" ? "全部文章" : search,
        subtitle: search == "" ? "——v25bh145" : "搜索结果",
        res: data,
      });
    }
  });
};
/**
 * 如果请求的archive为一个系列文章中的一篇，多请求一个系列文章数组(service/searchSeries.js)
 */
exports.get = function (req, res, next) {
  async.waterfall(
    [
      //查找id对应的文章
      function (cb) {
        var archiveId = Number(req.url.slice(5));
        if (archiveId.toString() === "NaN") {
          cb("不合法");
        } else {
          archiveId = parseInt(archiveId);
          require("../services/searchArchive").searchArchives(
            archiveId,
            function (err, data) {
              if (err) {
                cb(err);
              } else {
                //给前端返回除日期以外参数，如果有系列则需要再查一次表返回系列的所有文章简介
                cb(null, data);
              }
            },
          );
        }
      },
      //渲染文章，param在这里生成
      function (data, cb) {
        require("../services/getFileRendered").getFileRendered(
          data.filepath,
          function (err, content) {
            if (err) {
              cb(err);
            } else {
              var param = {
                archiveId: data.id,
                title: data.name,
                subtitle: data.description,
                archive: content,
                dateTime: data["create_time"],
              };
              if (typeof data.tags != "null") {
                param.tags = JSON.parse(data.tags);
              } else {
                param.tags = null;
              }
              if (data["series_id"] == 0) {
                param.isSeries = false;
                param.order = 0;
                param.series = null;
                cb(null, param);
              } else {
                param.isSeries = true;
                param.order = data.series_order;
                cb(null, param);
              }
            }
          },
        );
      },
      //如果文章存在系列，则查找整个系列
      function (param, cb) {
        if (param.isSeries == false) {
          cb(null, param);
        } else {
          //查询系列
          require("../services/searchSeries").searchSeries(
            param.archiveId,
            function (err, data) {
              if (err) {
                cb(err);
              } else {
                param.series = data;
                cb(null, param);
              }
            },
          );
        }
      },
      //推送文章
      function (param, cb) {
        require("../services/pushArticle").pushArticle(5, function (err, data) {
          if (err) {
            cb(err);
          } else {
            param.pushList = data;
            cb(null, param);
          }
        });
      },
    ],
    function (err, result) {
      if (err) {
        console.log(errorInfo);
        res.sendStatus(500);
      } else {
        res.render("index", result);
        // console.log(result);
      }
    },
  );

  // res.render('index', {
  //     archive: ,
  //     title: ,
  //     subtitle: ,
  //     tags: ,
  //     archiveId: ,
  //     pushList: ,
  //     dateTime: ,
  //     isSeries: ,
  //     order: ,
  //     series: [
  //         {
  //             id: ,
  //             title: ,
  //             order:
  //         },
  //     ]
  // });
};
