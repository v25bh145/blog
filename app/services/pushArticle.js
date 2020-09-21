let sqlClass = require('../helpers/mysql-auto-build-class');

sqlClass.setConfigPath('../configs/mysql.json');

exports.pushArticle = function (number, cb) {
    let sqlObj = sqlClass.form("archives");
    sqlObj.orderBy("id", "RAND()");
    sqlObj.limit(number);
    sqlObj.select(function (obj) {
        if (obj.error) {
            cb(1, obj.errorInfo);
        } else {
            if (typeof (obj.data) == "undefined" || typeof (obj.data) == "null" || obj.data.length == 0)
                cb(1, "NO INFORMATION");
            let pushList = [];
            obj.data.forEach(element => {
                pushList.push({
                    id: element.id,
                    title: element.name
                });
            });
            cb(0, pushList);
        }
    });
};