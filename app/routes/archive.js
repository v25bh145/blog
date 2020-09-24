/**
 * 路由
 */
exports.index = function (req, res, next) {
    require('../services/getFileRendered').getFileRendered('../public/markdowns/aboutMe.md', function (err, data) {
        if (err) res.send(err);
        else {
            //推送信息
            require('../services/pushArticle').pushArticle(5, function (err, pushList) {
                if (err) res.send(err);
                else {
                    res.render('index', {
                        archive: data,
                        title: "WELCOME TO MY BLOG",
                        subtitle: "————v25bh145",
                        archiveId: 1,
                        pushList: pushList
                    });
                }
            });
        }
    });
};

exports.search = function (req, res, next) {
    let search = req.query.search + "";
    if(search == "undefined" || search == "null")
        res.send("please input correct search!");
    require('../services/search').search(search, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.render('search', {
                title: search,
                subtitle: '搜索结果',
                res: data
            });
        }
    });
}
/**
 * 如果请求的archive为一个系列文章中的一篇，多请求一个系列文章数组(service/searchSeries.js)
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.get = require("../controllers/archives").get;