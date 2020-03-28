"use strict";


var mssql = require('mssql');

var db = {};

var env = process.argv[2] === 'prod' ? 'prod' : 'test';
var _path = process.cwd();
var conf = require(_path+'/conf/'+env+'.json');

var config = conf.mssql;

//执行sql,返回数据.  
db.sql = function (sql, callBack) {
    var connection = new mssql.ConnectionPool(config, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            ps.execute('', function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                ps.unprepare(function (err) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                        return;
                    }
                    callBack(err, result);
                });
            });
        });
    });
};

module.exports = db;