let sqlClass = require('../helpers/mysql-auto-build-class');

sqlClass.setConfigPath('../configs/mysql.json');

exports.searchArchives = function (id, cb) {
    let sqlObj = sqlClass.form("archives");
    sqlObj.limit(1);
    sqlObj.where("id", id);
    sqlObj.select(function(obj) {
        if(obj.error) {
            cb(1, obj.errorInfo);
        } else {
            cb(0, obj.data[0]);
        }
    })
}