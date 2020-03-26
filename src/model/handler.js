"use strict";

const sql = require('./sql.js').sql;
const db = require('./dbMysql.js');
const moment = require("./moment-with-locales.min.js");
var request = require('request');

let _success = {
    code: 0,
    msg: "",
    result: [],
};

let _failed = {
    code: -1,
    msg: "",
    result: [],
};

function getLastDay(year,month) {         
     var new_year = year;    //取当前的年份          
     var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
     if(month>12) {         
      new_month -=12;        //月份减          
      new_year++;            //年份增          
     }         
     var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天          
     return (new Date(new_date.getTime()-1000*60*60*24*2)).getDate();//获取当月最后一天日期          
} 

var _getBuildDatas = async function (dn, conf, pars) {
    try {
        var conn = await db.getConn(conf, dn);
        var build = await db.query(conn, sql.my.getBuild);
        var energyTotalElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.totalStart, pars.totalEnd]);
        var energyTotalWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.totalStart, pars.totalEnd]);
        var energyTodayElec = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "electricity").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyTodayWater = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "water").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyMonthElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyMonthWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyYearElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.curMonthStart, pars.yearEnd]);
        var energyYearWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.curMonthStart, pars.yearEnd]);
        var energyListElec = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "electricity"), [pars.monthStart, pars.monthEnd]);
        var energyListWater = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "water"), [pars.monthStart, pars.monthEnd]);
        db.endConn(dn);
        return {
            build: build[0],
            energyTotalElec:    energyTotalElec[0],
            energyTotalWater:   energyTotalWater[0],
            energyTodayElec:    energyTodayElec[0],
            energyTodayWater:   energyTodayWater[0],
            energyMonthElec:    energyMonthElec[0],
            energyMonthWater:   energyMonthWater[0],
            energyYearElec:     energyYearElec[0],
            energyYearWater:    energyYearWater[0],
            energyListElec:     energyListElec,
            energyListWater:    energyListWater,
        };
    } catch(e) {
        console.log(e.message, dn);
        return {
            build: {},
            energyTotalElec:  {tt: 0},
            energyTotalWater: {tt: 0},
            energyTodayElec:  {tt: 0},
            energyTodayWater: {tt: 0},
            energyMonthElec:  {tt: 0},
            energyMonthWater: {tt: 0},
            energyYearElec:   {tt: 0},
            energyYearWater:  {tt: 0},
            energyListElec:   [],
            energyListWater:  [],
        }
    }
}

var _getBuildDatasJx = async function (dn, conf, pars) {
    try {
        throw new Error('no table use');
        var conn = await db.getConn(conf, dn);
        var build = await db.query(conn, sql.my.getBuild);
        var energyTotalElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.totalStart, pars.totalEnd]);
        var energyTotalWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.totalStart, pars.totalEnd]);
        var energyTodayElec = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "electricity").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyTodayWater = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "water").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyMonthElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyMonthWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyYearElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.yearStart, pars.yearEnd]);
        var energyYearWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.yearStart, pars.yearEnd]);
        var energyListElec = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "electricity"), [pars.monthStart, pars.monthEnd]);
        var energyListWater = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "water"), [pars.monthStart, pars.monthEnd]);
        db.endConn(dn);
        return {
            build: build[0],
            energyTotalElec:    energyTotalElec[0],
            energyTotalWater:   energyTotalWater[0],
            energyTodayElec:    energyTodayElec[0],
            energyTodayWater:   energyTodayWater[0],
            energyMonthElec:    energyMonthElec[0],
            energyMonthWater:   energyMonthWater[0],
            energyYearElec:     energyYearElec[0],
            energyYearWater:    energyYearWater[0],
            energyListElec:     energyListElec,
            energyListWater:    energyListWater,
        };
    } catch(e) {
        console.log(e.message, dn);
        return {
            build: {},
            energyTotalElec:   {tt: 0},
            energyTotalWater:  {tt: 0},
            energyTodayElec:   {tt: 0},
            energyTodayWater:  {tt: 0},
            energyMonthElec:   {tt: 0},
            energyMonthWater:  {tt: 0},
            energyYearElec:    {tt: 0},
            energyYearWater:   {tt: 0},
            energyListElec:    [],
            energyListWater:   [],
        }
    }
}

var _getDevices = async function (conf) {
    try {
        return await new Promise((resolve, reject) => {
            request('http://localhost:8080/querylist', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(body);
                }
            });
        });
    } catch(e) {
        console.log(e.message, dn);
        return []
    }
}

var _getBuildDatas = async function (dn, conf, pars) {
    try {
        var conn = await db.getConn(conf, dn);
        var build = await db.query(conn, sql.my.getBuild);
        var energyTotalElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.totalStart, pars.totalEnd]);
        var energyTotalWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.totalStart, pars.totalEnd]);
        var energyTodayElec = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "electricity").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyTodayWater = await db.query(conn, sql.my.getEnergyTotalByHour.replace("[type]", "water").replace("[yearmonth]", pars.todayYMStr), [pars.todayStr, pars.todayStr]);
        var energyMonthElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyMonthWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.curMonthStart, pars.curMonthEnd]);
        var energyYearElec = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "electricity"), [pars.curMonthStart, pars.yearEnd]);
        var energyYearWater = await db.query(conn, sql.my.getEnergyTotal.replace("[type]", "water"), [pars.curMonthStart, pars.yearEnd]);
        var energyListElec = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "electricity"), [pars.monthStart, pars.monthEnd]);
        var energyListWater = await db.query(conn, sql.my.getEnergyList.replace("[year]", pars.year).replace("[type]", "water"), [pars.monthStart, pars.monthEnd]);
        conn.endConn();
        return {
            build: build[0],
            energyTotalElec:    energyTotalElec[0],
            energyTotalWater:   energyTotalWater[0],
            energyTodayElec:    energyTodayElec[0],
            energyTodayWater:   energyTodayWater[0],
            energyMonthElec:    energyMonthElec[0],
            energyMonthWater:   energyMonthWater[0],
            energyYearElec:     energyYearElec[0],
            energyYearWater:    energyYearWater[0],
            energyListElec:     energyListElec,
            energyListWater:    energyListWater,
        };
    } catch(e) {
        console.log(e.message, dn);
        return {
            build: {},
            energyTotalElec:  {tt: 0},
            energyTotalWater: {tt: 0},
            energyTodayElec:  {tt: 0},
            energyTodayWater: {tt: 0},
            energyMonthElec:  {tt: 0},
            energyMonthWater: {tt: 0},
            energyYearElec:   {tt: 0},
            energyYearWater:  {tt: 0},
            energyListElec:   [],
            energyListWater:  [],
        }
    }
}

exports.ajaxTotal = async function(conf, params) {
    let res = JSON.parse(JSON.stringify(_success));
    var connjx, connjs;
    var totalStart = "2000-01-01";
    var totalEnd = "3000-01-01";
    var today = params["today"] || moment().format("YYYY-MM-DD");
    var date = moment(today);
    var todayStr = date.format("YYYY-MM-DD");
    var todayYMStr = date.format("YYYYMM");
    var year = params["year"] || date.format("YYYY");
    var month = params["month"] || date.format("MM");
    var monthStart = date.startOf("month").format("YYYY-MM-DD");
    var monthEnd = date.endOf("month").format("YYYY-MM-DD");
    var curMonthStart = date.startOf("month").format("YYYY-MM-DD");
    var curMonthEnd = date.endOf("month").format("YYYY-MM-DD");
    var yearStart = date.startOf("year").format("YYYY-MM-DD");
    var yearEnd = date.endOf("year").format("YYYY-MM-DD");

    var pars = {
        year:year,
        month:month,
        date: date,
        totalStart: totalStart,
        totalEnd: totalEnd,
        monthStart: monthStart,
        monthEnd: monthEnd,
        todayStr: todayStr,
        todayYMStr:todayYMStr,
        curMonthStart:curMonthStart,
        curMonthEnd:curMonthEnd,
        yearStart:yearStart,
        yearEnd:yearEnd,
    }

    try {
        // 海盐，融通，秀州，嘉善，明州
        var dbs = ["hy", "rt", "xz", "js", "mz", "jx"];
        var result = await Promise.all(dbs.map(async (dn) => {
            return await _getBuildDatas(dn, conf, pars);
        }));
        res.result = result;
    } catch(e) {
        let res = JSON.parse(JSON.stringify(_failed));
        res.msg = e.message;
    }
    return res;
}

exports.ajaxGetBuildings = async function(conf, params) {
    let res = JSON.parse(JSON.stringify(_success));
    var conn;
    try {
        conn = await db.getConn(conf);
        res.result = await db.query(conn, sql.my.getItems);
    } catch(e) {
        let res = JSON.parse(JSON.stringify(_failed));
        res.code = e.code;
        res.msg = e.message;
    }
    return res;
}

exports.ajaxDevices = async function(conf, params) {
    let res = JSON.parse(JSON.stringify(_success));
    try {
        res.result = await _getDevices();
    } catch(e) {
        let res = JSON.parse(JSON.stringify(_failed));
        res.code = e.code;
        res.msg = e.message;
    }
    return res;
}

// 新版，只读嘉兴的数据
var _getDatas = async function (dn, conf, pars) {
    try {
        var conn = await db.getConn(conf, dn);
        var build = await db.query(conn, sql.my.getBuild);
        //console.log("build", build);
        // 1#变压器总 是总电表
        var itemId = "1";
        // 能耗的 item_name 规则：buildingID_采集器ID(2位数字)_设备ID
        // 当日总能耗

        var energyToday = await db.query(conn,
            sql.my.getEnergyTotal.replace("[type]", "electricity").replace("[year]", pars.year),
            [itemId, pars.todayStr, pars.todayStr]);
        // 当月总能耗
        //console.log("energyToday", energyToday);
        var energyMonth = await db.query(conn,
            sql.my.getEnergyTotal.replace("[type]", "electricity").replace("[year]", pars.year),
            [itemId, pars.monthStart, pars.monthEnd]);
        //console.log("energyMonth", energyMonth);
        // 上月总能耗
        var energyLastMonth = await db.query(conn,
            sql.my.getEnergyTotal.replace("[type]", "electricity").replace("[year]", pars.year),
            [itemId, pars.lastMonthStart, pars.lastMonthEnd]);
        //console.log("energyLastMonth", energyLastMonth);
        // 按设备类型当月汇总
        var energyMonthBySubentry = await db.query(conn, sql.my.getEnergyBySubentry, [pars.monthStart, pars.monthEnd]);
        //console.log("energyMonthBySubentry", energyMonthBySubentry);
        // 总实时用电列表数据（按小时的用电量）
        var energyRealTimeList = await db.query(conn,
            sql.my.getEnergyRealTime.replace("[type]", "electricity").replace("[yearmonth]", pars.todayYMStr),
            [itemId, pars.todayStr, pars.todayStr]);
        //console.log("energyRealTimeList", energyRealTimeList);
        // 当月每日能耗
        var energyMonthList = await db.query(conn,
            sql.my.getEnergyList.replace("[type]", "electricity").replace("[year]", pars.year),
            [itemId, pars.monthStart, pars.monthEnd]);
        //console.log("energyMonthList", energyMonthList);
        db.endConn();
        return {
            build: build[0],
            energyToday:    energyToday[0] || {tt: 0},
            energyMonth:   energyMonth[0] || {tt: 0},
            energyLastMonth:    energyLastMonth[0] || {tt: 0},
            energyMonthBySubentry:   energyMonthBySubentry || [],
            energyRealTimeList:    energyRealTimeList || [],
            energyMonthList:   energyMonthList || [],
        };
    } catch(e) {
        console.log(e.message, dn);
        return {
            build: {},
            energyToday:  {tt: 0},
            energyMonth: {tt: 0},
            energyLastMonth:  {tt: 0},
            energyMonthBySubentry: [],
            energyRealTimeList:  [],
            energyMonthList: [],
        }
    }
}
exports.ajaxEnergyData = async function(conf, params) {
    let res = JSON.parse(JSON.stringify(_success));
    var connjx, connjs;
    var totalStart = "2000-01-01";
    var totalEnd = "3000-01-01";
    var today = params["today"] || moment().format("YYYY-MM-DD");
    var date = moment(today);
    var todayStr = date.format("YYYY-MM-DD");
    var todayYMStr = date.format("YYYYMM");
    var year = params["year"] || date.format("YYYY");
    var month = params["month"] || date.format("MM");
    var monthStart = date.startOf("month").format("YYYY-MM-DD");
    var monthEnd = date.endOf("month").format("YYYY-MM-DD");
    var yearStart = date.startOf("year").format("YYYY-MM-DD");
    var yearEnd = date.endOf("year").format("YYYY-MM-DD");
    var lastMonthStart = date.month(moment().month() - 1).startOf('month').format("YYYY-MM-DD");
    var lastMonthEnd = date.month(moment().month() - 1).endOf('month').format("YYYY-MM-DD");

    // 数据库名, 默认嘉兴
    var dn = params["dn"] || "jx";

    var pars = {
        year:year,
        month:month,
        date: date,
        totalStart: totalStart,
        totalEnd: totalEnd,
        monthStart: monthStart,
        monthEnd: monthEnd,
        lastMonthStart: lastMonthStart,
        lastMonthEnd: lastMonthEnd,
        todayStr: todayStr,
        todayYMStr:todayYMStr,
        yearStart:yearStart,
        yearEnd:yearEnd,
    }

    try {
        res.result = await _getDatas(dn, conf, pars);
    } catch(e) {
        let res = JSON.parse(JSON.stringify(_failed));
        res.msg = e.message;
    }
    return res;
}
