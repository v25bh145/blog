/**
 * 路由
 */
exports.index = function (req, res, next) {
    require('../services/getFileRendered').getFileRendered('../public/markdowns/aboutMe.md', function (err, data) {
        if (err) res.send(data);
        else {
            //推送信息
            require('../services/pushArticle').pushArticle(5, function (err, pushList) {
                if (err) res.send(pushData);
                else {
                    res.render('index', {
                        archive: data.result,
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
    console.log(search);
    require('../services/search').search(search, function (err, data) {
        if (err) {
            res.send("err: " + data);
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
exports.get = function (req, res, next) {
    var archiveId = Number(req.url.slice(5));
    if (archiveId.toString() === "NaN") {
        console.log('不合法');
        res.send(503);
    } else {
        archiveId = parseInt(archiveId);
        /**
         * TODO: 查询archive 渲染 查询pushList与seriesList(如果有) 输出
         */
        next();
    }
}