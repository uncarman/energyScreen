"use strict";

exports.sql = {
	"my": {
		// 建筑所有数据
		"getBuild": "select * from tbl_building limit 1",
		// 某个时间段内总用电量
		"getEnergyTotal": `
			select ifnull(sum(value),0) as tt
			from tbl_energy_[type]_day_[year]
			where substring_index(item_name, '_', -1) = ?
				and DATE(date_time) >= ?
				and DATE(date_time) <= ?
			-- group by DATE(date_time)
			`,
		"getEnergyTotalByHour": `
			select ifnull(sum(value),0) as tt
			from tbl_energy_[type]_hour_[yearmonth]
			where DATE_FORMAT(date_time,'%Y-%m-%d') >= ?
				and DATE_FORMAT(date_time,'%Y-%m-%d') <= ?
			group by DATE_FORMAT(date_time,'%Y-%m-%d')
			`,
		// 按天汇总用电数据
		"getEnergyList": `
			select ifnull(sum(value),0) as tt, DATE_FORMAT(date_time,'%Y-%m-%d') as date_time
			from tbl_energy_[type]_day_[year]
			where substring_index(item_name, '_', -1) = ?
				and DATE_FORMAT(date_time,'%Y-%m-%d') >= ?
				and DATE_FORMAT(date_time,'%Y-%m-%d') <= ?
			group by DATE_FORMAT(date_time,'%Y-%m-%d')
			`,
		// 按分项获取一个时间段的发电汇总
		"getEnergyBySubentry": `
			select
				ifnull(sum(em.value),0) as tt, it.name
				from tbl_energy_electricity_month em
			inner JOIN (
				select
					i.code, se.id, se.parent, se.name
				from tbl_item i
				inner JOIN (
					select
						s2.id, s2.parent, s2.name
					from tbl_subentry s1
					RIGHT JOIN tbl_subentry s2 on s2.parent = s1.id
					where s1.parent = 1  -- 电（总）下面的所有二级分项
				) se on i.subentry = se.id -- 设备对应的二级能耗分项
			) it on substring_index(em.item_name, '_', -1) = it.code -- 设备对应发电数据
			where DATE(em.date_time) >= ? and DATE(em.date_time) <= ?
			group by it.parent
			`,
		// 实时总用电数据(按小时)
		"getEnergyRealTime": `
			select
				ifnull(sum(value),0) as tt,
				DATE_FORMAT(date_time,'%Y-%m-%d %H') as date_time
			from tbl_energy_[type]_hour_[yearmonth]
			where substring_index(item_name, '_', -1) = ?
				and DATE(date_time) >= ?
				and DATE(date_time) <= ?
			group by DATE_FORMAT(date_time,'%Y-%m-%d %H')
			`,
	},

	"ms": {
		"getDevice": "select * from ibs_item_parameter;",
	}
}
