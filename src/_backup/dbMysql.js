"use strict";

const util = require("util");
const EventEmitter = require("events");
const mysql = require("mysql");

const helper = require("./helper.js");

function DbServer(options) {
    EventEmitter.call(this);
    this.options = options;
    this.started = false;
    this.server = null;

    // 创建server实例
    this._createServer();
}
util.inherits(DbServer, EventEmitter);

// 启动服务
DbServer.prototype._createServer = function() {
    this.server = mysql.createConnection({
        host: this.options.host,
        database: this.options.database,
        user: this.options.username,
        password: this.options.password
    });
    this.server.connect();
};

// 停止服务
DbServer.prototype._stopServer = function() {
    this.server.end();
};

// 执行sql查询
DbServer.prototype.query = function(sql) {
    return new Promise((resolve, reject) => {
        this.server.query(sql, function(error, results, fields) {
            if (error) {
                reject(error);
            }
            var res = results && results.length > 0 ? results : [];
            resolve(JSON.parse(JSON.stringify(res)));
        });
    });
};

// 更新数据
DbServer.prototype.update = function(sql, val) {
    return new Promise((resolve, reject) => {
        that.server.query(sql, val, function(err, res, fields) {
            if (err) {
                reject(error);
            }
            var res = results && results.length > 0 ? results : [];
            resolve(JSON.parse(JSON.stringify(res)));
        });
    });
};

module.exports = DbServer;
