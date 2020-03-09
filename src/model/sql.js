"use strict";

exports.sql = {
	"my": {
		"getBuild": "select * from tbl_building limit 1",
		"getEnergyTotal": "select ifnull(sum(value),0) as tt from tbl_energy_[type]_month where DATE_FORMAT(date_time,'%Y-%m-%d') >= ? and DATE_FORMAT(date_time,'%Y-%m-%d') <= ? group by DATE_FORMAT(date_time,'%Y-%m-%d') ",
		"getEnergyTotalByHour": "select ifnull(sum(value),0) as tt from tbl_energy_[type]_hour_[yearmonth] where DATE_FORMAT(date_time,'%Y-%m-%d') >= ? and DATE_FORMAT(date_time,'%Y-%m-%d') <= ? group by DATE_FORMAT(date_time,'%Y-%m-%d') ",
		"getEnergyList": "select ifnull(sum(value),0) as tt, DATE_FORMAT(date_time,'%Y-%m-%d') as date_time from tbl_energy_[type]_day_[year] where DATE_FORMAT(date_time,'%Y-%m-%d') >= ? and DATE_FORMAT(date_time,'%Y-%m-%d') <= ? group by DATE_FORMAT(date_time,'%Y-%m-%d') ",
	}
}
