/**
 * @author v25bh145
 * @version 0.0.2
 * 协议： MIT协议
 * 新手随便敲敲，仅作练习
 * 一个mysql自动化sql查询的玩具
 * 0.0.2: 添加了noWhere的select
 */
let mysql = require('mysql');
let fs = require('fs');
let async = require('async');
let configPath = "./config/connect.json";
const { AsyncResource } = require('async_hooks');
class sql {
    _conn = {};
    _connectConfig = {};
    _table = "";
    _data = {};
    _orderBy = "";
    _limit = "";
    _whereBinary = false;
    //默认多条where时，使用与逻辑(_whereList[0]["notUseArray"] === false)
    _whereList = [
        { notUseArray: false },
        /*e.g:
        {key: "awa", value: "qwq", op: "+", rel: null},
        {key: "awa", value: "qwq", op: "+", rel: "and"}*/
    ];
    //如果要用一段字符串(_whereList[0]["notUseArray"] === true)
    _whereStr = "";
    constructor(table = "", data = "") {
        let that = this;
        that._table = table;
        that._data = data;
    };
    /**
     * 重新设置数据表
     * @param {String} newTable 
     */
    setTable = (newTable) => {
        let that = this;
        that._table = newTable;
        return that;
    };
    /**
     * 重新设置数据对象，用于插入和更新   
     * 增加了对字符串的处理
     * @param {object} newData 
     */
    setData = (newData) => {
        let that = this;
        for (let key in newData) {
            if (typeof (newData[key]) === "string") {
                newData[key] = '"' + newData[key] + '"';
            }
        }
        that._data = newData;
        return that;
    };
    /**
     * 设置返回查询数据的顺序   
     * 已有顺序则更换，顺序规则不符合则返回error
     * @param {String} key 
     * @param {Number} orderType 默认ASC升序
     */
    orderBy = (key, rule = "ASC") => {
        let that = this;
        if (rule.toUpperCase() === "DESC") rule = "DESC";
        else if (rule.toUpperCase() === "ASC") rule = "ASC";
        else return {
            error: true,
            errorInfo: "please input the correct rule."
        };
        that._orderBy = {
            key: key,
            rule: rule
        };
        return that;
    };
    /**
     * 设置一次查询返回多少条目
     * @param {Number} number 
     */
    limit = (number) => {
        let that = this;
        if (number <= 0) return {
            error: true,
            errorInfo: "please input the correct rule."
        };
        that._limit = number;
        return that;
    };
    /**
     * 为true时，检查大小写，否则不检查
     * @param {bool} flag 默认为true
     */
    setBinary = (flag) => {
        let that = this;
        if (flag === true || flag === false) {
            that._whereBinary = flag;
            return that;
        }
        else {
            return {
                error: true,
                errorInfo: "please input bool type!"
            };
        }
    }
    /**
     * 设置(添加)where限制
     * @param {String} key 
     * @param {*} value 
     * @param {String} op 
     * @param {String} rel 
     * @todo 智能为value提供输入格式转换
     */
    where = (key, value, op = "=", rel = "and") => {
        let that = this;
        if (that._whereList[0]["notUseArray"] === true) that._whereList[0]["notUseArray"] = false;
        if (typeof (value) === "string") value = '"' + value + '"';
        if (op.toUpperCase() === "LIKE") op = "LIKE";
        that._whereList.push({
            key: key,
            value: value,
            op: op,
            rel: rel.toUpperCase()
        });
        return that;
    };
    /**
     * 设置(重新设置)where限制，这个函数输入整个where语句的内容
     * @param {String} whereStr
     */
    whereSet = (whereStr) => {
        let that = this;
        //直接来个新的，原来的匹配被自动清除
        that._whereList = [
            { notUseArray: true },
        ];
        that._whereStr = whereStr;
        return that;
    };
    /**
     * 删除以下的所有子句配置
     */
    deleteAllSet = () => {
        let that = this;
        that._conn = {};
        that._connectConfig = {};
        that._orderBy = "";
        that._limit = "";
        that._whereBinary = false;
        that._whereList = [
            { notUseArray: false }
        ];
        that._whereStr = "";
        return that;
    }
    /**
     * 检查不合法参数 有重复检查   
     * 返回一个对象
     */
    examine = () => {
        let that = this;
        if (typeof (that._table) != "string")
            return {
                error: true,
                errorInfo: "please input correct table_name!"
            };
        else if (typeof (that._limit) != "number" && that._limit != "")
            return {
                error: true,
                errorInfo: "please input correct limit!"
            };
        else if (that._orderBy.rule != "ASC" && that._orderBy.rule != "DESC" && this._orderBy != "")
            return {
                error: true,
                errorInfo: "please input correct orderBy!"
            };
        else if (typeof (that._data) != "object" && that._data != "")
            return {
                error: true,
                errorInfo: "please input correct data!"
            };
        else if (that._whereList[0].notUseArray == true && typeof (that._whereStr) != "string")
            return {
                error: true,
                errorInfo: "please input correct WHERE!"
            };
        else if (that._whereList[0].notUseArray == false) {
            for (let idx = 1; idx < that._whereList.length; idx++) {
                if (typeof (that._whereList[idx].key) != "string")
                    return {
                        error: true,
                        errorInfo: "please input correct key IN WHERE!"
                    };
                else if (that._whereList[idx].op != "=" &&
                    that._whereList[idx].op != ">" &&
                    that._whereList[idx].op != "<" &&
                    that._whereList[idx].op != ">=" &&
                    that._whereList[idx].op != "<=" &&
                    that._whereList[idx].op != "!=" &&
                    that._whereList[idx].op != "LIKE")
                    return {
                        error: true,
                        errorInfo: "please input correct operator in WHERE!"
                    };
                else if (that._whereList[idx].rel != "AND" &&
                    that._whereList[idx].rel != "OR" &&
                    that._whereList[idx].rel != "NOT")
                    return {
                        error: true,
                        errorInfo: "please input correct relation in WHERE!"
                    };
            }
        }
        //通过
        return {
            error: false,
            errorInfo: ""
        };
    }
    /**
     * insert语句
     * @param callback 回调函数
     */
    insert = (callback) => {
        let that = this;

        //校验
        let examineRes = that.examine();
        if (examineRes.error === true) {
            callback(examineRes);
            return;
        }

        //构造sql
        let sql = "INSERT INTO " + that._table + " (";
        let arrKey = [];
        let arrValue = [];
        for (let key in that._data) {
            arrKey.push(key);
            arrValue.push(that._data[key]);
        }
        for (let idx = 0; idx < arrKey.length - 1; idx++) {
            sql += arrKey[idx] + ", ";
        }
        sql += arrKey[arrKey.length - 1] + ") VALUES (";
        for (let idx = 0; idx < arrValue.length - 1; idx++) {
            sql += arrValue[idx] + ", ";
        }
        sql += arrValue[arrValue.length - 1] + ");";

        //还原配置
        that.deleteAllSet();

        //连接数据库，插入sql
        async.series([
            function (asyncCallback) {
                fs.readFile(configPath, (err, data) => {
                    that._connectConfig = JSON.parse(data);
                    asyncCallback(null, "success");
                });
            },
            function (asyncCallback) {
                that._conn = mysql.createConnection(that._connectConfig);
                that._conn.query(sql, function (err, rows) {
                    if (err) asyncCallback(err, "failed");
                    else asyncCallback(null, rows);
                });
            }
        ], function (error, results) {
            that._conn.end();
            if (error)
                callback({
                    error: true,
                    errorInfo: error
                });
            else
                callback({
                    error: false,
                    errorInfo: "",
                    data: results
                });
        });
    };
    /**
     * select语句
     * @param callback 回调函数
     */
    select = (callback) => {
        let that = this;

        //校验
        let examineRes = that.examine();
        if (examineRes.error === true) {
            callback({
                error: true,
                errorInfo: examineRes.errorInfo,
                data: {}
            });
            return;
        }
        //构造sql
        let sql = "SELECT * FROM " + that._table + " WHERE ";
        if (that._whereBinary === true) sql += "BINARY ";
        if (that._whereList[0]["notUseArray"] === true) {
            sql += that._whereStr + " ";
        } else {
            let length = that._whereList.length;
            if (length > 1) {
                sql += that._whereList[1].key + " "
                    + that._whereList[1].op + " "
                    + that._whereList[1].value + " ";

                for (let idx = 2; idx < length; idx++) {
                    sql += that._whereList[idx].rel + " "
                        + that._whereList[idx].key + " "
                        + that._whereList[idx].op + " "
                        + that._whereList[idx].value + " ";
                }
            } else {
                sql = "SELECT * FROM " + that._table + " ";
                // callback({
                //     error: true,
                //     errorInfo: "please input where condition.",
                //     data: {}
                // });
            }

        }
        if (that._orderBy != "") {
            sql += "ORDER BY " + that._orderBy.key + " " + that._orderBy.rule + " ";
        }
        if (that._limit != "") {
            sql += "LIMIT " + that._limit + " ";
        }
        sql += ";";
        //还原配置
        this.deleteAllSet();

        //数据库连接 返回取出数据
        async.series([
            function (asyncCallback) {
                fs.readFile(configPath, (err, data) => {
                    that._connectConfig = JSON.parse(data);
                    asyncCallback(null, "success");
                });
            },
            function (asyncCallback) {
                that._conn = mysql.createConnection(that._connectConfig);
                that._conn.query(sql, function (err, rows) {
                    if (err) asyncCallback(err, "failed");
                    else {
                        that._data = rows;
                        asyncCallback(null, "success");
                    }
                });
            }
        ], function (error, results) {
            that._conn.end();
            if (error)
                callback({
                    error: true,
                    errorInfo: error,
                    data: {}
                });
            else
                callback({
                    error: false,
                    errorInfo: "",
                    data: that._data
                });
        });
    }
    /**
     * delete语句
     * @param callback 回调函数
     */
    delete = (callback) => {
        let that = this;

        //校验
        let examineRes = that.examine();
        if (examineRes.error === true) {
            callback(examineRes);
            return;
        }

        //构造sql
        let sql = "DELETE FROM " + that._table + " WHERE ";
        if (that._whereBinary === true) sql += "BINARY ";
        if (that._whereList[0]["notUseArray"] === true) {
            sql += that._whereStr + " ";
        } else {
            let length = that._whereList.length;
            if (length > 1) {
                sql += that._whereList[1].key + " "
                    + that._whereList[1].op + " "
                    + that._whereList[1].value + " ";
            } else {
                callback({
                    error: true,
                    errorInfo: "please input where condition.",
                    data: {}
                });
            }
            for (let idx = 2; idx < length; idx++) {
                sql += that._whereList[idx].rel + " "
                    + that._whereList[idx].key + " "
                    + that._whereList[idx].op + " "
                    + that._whereList[idx].value + " ";
            }
        }
        if (that._orderBy != "") {
            sql += "ORDER BY " + that._orderBy.key + " " + that._orderBy.rule + " ";
        }
        if (that._limit != "") {
            sql += "LIMIT " + that._limit + " ";
        }
        sql += ";";

        //还原配置
        that.deleteAllSet();

        //数据库连接 删除数据
        async.series([
            function (asyncCallback) {
                fs.readFile(configPath, (err, data) => {
                    that._connectConfig = JSON.parse(data);
                    asyncCallback(null, "success");
                });
            },
            function (asyncCallback) {
                that._conn = mysql.createConnection(that._connectConfig);
                that._conn.query(sql, function (err, rows) {
                    if (err) asyncCallback(err, "failed");
                    else asyncCallback(null, "success");
                });
            }
        ], function (error, results) {
            that._conn.end();
            if (error)
                callback({
                    error: true,
                    errorInfo: error
                });
            else
                callback({
                    error: false,
                    errorInfo: ""
                });
        });
    }
    /**
     * update语句
     * @param callback 回调函数
     */
    update = (callback) => {
        let that = this;

        //校验
        let examineRes = that.examine();
        if (examineRes.error === true) {
            callback(examineRes);
            return;
        }

        //构造sql
        let sql = "UPDATE " + that._table + " SET ";
        let arrKey = Object.keys(that._data);
        let arrKeyLength = arrKey.length;
        for (let idx = 0; idx < arrKeyLength - 1; idx++) {
            sql += arrKey[idx] + " = " + that._data[arrKey[idx]] + ", ";
        }
        sql += arrKey[arrKeyLength - 1] + " = " + that._data[arrKey[arrKeyLength - 1]] + " WHERE ";
        if (that._whereBinary === true) sql += "BINARY ";
        if (that._whereList[0]["notUseArray"] === true) {
            sql += that._whereStr + " ";
        } else {
            let length = that._whereList.length;
            if (length > 1) {
                sql += that._whereList[1].key + " "
                    + that._whereList[1].op + " "
                    + that._whereList[1].value + " ";
            } else {
                callback({
                    error: true,
                    errorInfo: "please input where condition.",
                    data: {}
                });
            }
            for (let idx = 2; idx < length; idx++) {
                sql += that._whereList[idx].rel + " "
                    + that._whereList[idx].key + " "
                    + that._whereList[idx].op + " "
                    + that._whereList[idx].value + " ";
            }
        }
        if (that._orderBy != "") {
            sql += "ORDER BY " + that._orderBy.key + " " + that._orderBy.rule + " ";
        }
        if (that._limit != "") {
            sql += "LIMIT " + that._limit + " ";
        }
        sql += ";";

        //还原配置
        that.deleteAllSet();

        //数据库连接 更新数据
        async.series([
            function (asyncCallback) {
                fs.readFile(configPath, (err, data) => {
                    that._connectConfig = JSON.parse(data);
                    asyncCallback(null, "success");
                });
            },
            function (asyncCallback) {
                that._conn = mysql.createConnection(that._connectConfig);
                that._conn.query(sql, function (err, rows) {
                    if (err) asyncCallback(err, "failed");
                    else asyncCallback(null, "success");
                });
            }
        ], function (error, results) {
            that._conn.end();
            if (error)
                callback({
                    error: true,
                    errorInfo: error
                });
            else
                callback({
                    error: false,
                    errorInfo: ""
                });
        });
    }
}
let form = function (table = "", data = "") {
    let sqlObj = new sql(table, data);
    return sqlObj;
}
/**
 * 重新设置配置
 * @param newPath 新路径(按照这个自动构建文件来)
 */

let setConfigPath = function (newPath) {
    configPath = newPath;
}
exports.setConfigPath = setConfigPath;
exports.form = form;