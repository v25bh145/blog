let sqlClass = require('../helpers/mysql-auto-build-class');
/**
 * 解构查询字符串，并且返回查询结果
 * @param {String} search 
 */
exports.search = function (search, cb) {
    let all = search.split(' ');
    let tags = [];

    sqlClass.setConfigPath("../configs/mysql.json");
    let sqlObj = sqlClass.form("archives");

    all.forEach(function (str) {
        if (str[0] === ":") {
            tags.push(str.slice(1));
        } else {
            sqlObj.where("name", "%" + str + "%", "LIKE");
        }
    });
    //两种逻辑：
    /**
     * 1. 查一次标签-文章表，返回所有文章-标签的文章数据，再去查一次文章表，两者做交集 => 废弃
     * 2. 查一次文章表，返回所有tags，在每一个文章的tags中查找 => 可优化 => 字符串排序
     */
    sqlObj.select(function (obj) {
        if (obj.error) {
            cb(obj.errorInfo);
        }
        else {
            let res = [];
            if (obj.data.length > 0) {
                if (tags.length === 0) {
                    //不查标签，长度为0
                    cb(null, obj.data);
                } else {
                    console.log("tags: " + tags);

                    //遍历每一个文章
                    obj.data.forEach(function (article) {
                        console.log("archives: " + JSON.stringify(article));
                        if (typeof (article.tags) != "undefined" && typeof (article.tags) != "null") {
                            //将json转为数组
                            let thisTags = [];
                            let flag = false;
                            let articleTags = JSON.parse(article.tags);
                            for (tagArchiveKey in articleTags) {
                                console.log("找到标签: " + articleTags[tagArchiveKey]);
                                thisTags.push(articleTags[tagArchiveKey]);
                            }
                            //遍历要查询的标签
                            tags.forEach(function (tagInSearch) {
                                flag = false;
                                //遍历这个文章的所有标签
                                thisTags.forEach(function (tagInArchive) {
                                    if (tagInArchive === tagInSearch) {
                                        flag = true;
                                        return;
                                    }
                                })
                                //没有匹配到，说明文章不属于搜索范围内
                                if (flag === false) return;
                            });
                            if (flag === true)
                                res.push(article);
                        }
                    });
                    cb(null, res);
                }
            } else {
                cb("NO INFORMATION");
            }
        }
    });
};