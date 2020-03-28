// SHOW FULL COLUMNS FROM ys_buy;

const mysql = require("mysql");

var opts = {
	host: "rm-wz90kk6ot4w8pebii.mysql.rds.aliyuncs.com",
    database: "ws_db",
    user: "weshare_mysql",
    password: "KINSLOT@kinslot"
}
var opts = {
	"host": "rm-uf67xbt5r3r17jddto.mysql.rds.aliyuncs.com",
    "database": "tmp_test",
    "user": "llproj",
    "password": "asjfy3j7Y@62o@hksowi"
}

server = mysql.createConnection({
    host: opts.host,
    database: opts.database,
    user: opts.user,
    password: opts.password
})
server.connect();


var sql = "show tables;";
var sql2 = "SHOW FULL COLUMNS FROM ";
setTimeout(function() {
	server.query(sql, function(error, results, fields) {
	    if (error) {
	        reject(error);
	    }
	    var res = results && results.length > 0 ? results : [];
	    // console.log(JSON.stringify(res));

	    if(res.length > 0 ) {

	    }


	    server.end();
	});
}, 1000);

