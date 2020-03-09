"use strict";

const mysql = require("mysql");

let pools = {};

const db = {
	getConn: function (conf, dbName) {
		if(!pools.hasOwnProperty(dbName)) {
			pools[dbName] = mysql.createPool(conf.mysql[dbName]);
		}
	    return new Promise((resolve, reject) => {
	        pools[dbName].getConnection((err, conn) => {
	            if (err) {
	                reject(err);
	            } else {
	                resolve(conn);
	            }
	        });
	    });
	},
	query: function (conn, sql, param = []) {
	    return new Promise((resolve, reject) => {
	        //parameter check
	        var msg = _checkParam(sql, param);
	        if (msg !== undefined) {
	            let error = new Error(msg);
	            error.sql = _getSql(sql, param);
	            reject(error);
	        } else {
	            //execute sql
	            conn.query(sql, param, (err, results, fields) => {
	                if (err) {
	                    if (err.sql === undefined || err.sql === null) {
	                        err.sql = _getSql(sql, param);
	                    }
	                    reject(err);
	                } else {
	                    resolve(results, fields);
	                }
	            });
	        }
	    });
	}
};

exports = module.exports = db;


function _verifyParam (params) {
    var result = true;
    for (let param of params) {
        if (param === null || param === undefined) {
            result = false;
            break;
        }
    }
    return result;
};

function _getParamCount (sql) {
    var str = sql.match(/\?/g);
    return str === null ? 0 : str.length;
};

function _checkParam (sql, params) {
    var msg;
    if (sql === undefined || sql === null || typeof sql !== 'string') {
        msg = 'sql invalid(undefined or null or not string)';
    } else {
        if (Array.isArray(params) === false) {
            msg = 'params invalid(not array)';
        } else {
            if (params.length !== _getParamCount(sql)) {
                msg = 'params invalid(number unmatch)';
            } else {
                if (_verifyParam(params) === false) {
                    msg = 'params invalid(undefined or null)';
                }
            }
        }
    }
    return msg;
};

function _getSql (sql, args) {
    return mysql.format(sql, args, false, 'local');
};