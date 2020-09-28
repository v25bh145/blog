let sqlClass = require("../helpers/mysql-auto-build-class");
sqlClass.setConfigPath("../configs/mysql.json");
exports.deleteArchives = function (id, cb) {
    let sqlObj = sqlClass.form("archives");
    sqlObj.where("id", id).delete(function(obj) {
        if(obj.error) {
            cb(obj.errorInfo);
        } else {
            cb(null, true);
        }
    });
}