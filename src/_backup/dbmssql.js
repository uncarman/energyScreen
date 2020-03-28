// 配置文件

const sql = require('mssql');

var db = (sqlstr, callback) => {
    sql.connect(config).then(function () {
        return sql.query(sqlstr)
    }).then(result => {
        callback(result);
        sql.close();
    }).catch(error => {
        sql.close();
    })
}
module.exports = db;