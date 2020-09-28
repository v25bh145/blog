let sqlClass = require("../helpers/mysql-auto-build-class");
sqlClass.setConfigPath("../configs/mysql.json");
/**
 * 存储入数据库
 * @param {Object} obj 
 * @param {function} cb 
 */
exports.saveArchiveInDb = function (obj, cb) {
    let sqlObj = sqlClass.form("archives", obj);
    sqlObj.insert(function (obj) {
        if(obj.error) {
            cb(obj.errorInfo);
        } else {
            var archiveId = obj.data[1].insertId;
            cb(null, archiveId);
        }
    });
}