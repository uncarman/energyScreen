var http=require('http');
var fs=require('fs');
var path=require('path');
var url=require('url');
var qs = require("querystring");

// 初始化配置变量
var env = process.argv[2] === 'prod' ? 'prod' : 'test';

var _path = process.cwd();
var conf = require(_path+'/conf/'+env+'.json');
var mimeModel=require(_path+'/src/model/getmimefromfile.js');
var app=require(_path+'/src/model/app.js');

http.createServer(function(req,res){
	var pathname=url.parse(req.url).pathname;
	if(pathname=='/'){
		pathname='/index.html'; /*默认加载的首页*/
	}
	var extname=path.extname(pathname);
	if(pathname.substr(0,6) == "/ajax/") {
		var func = pathname.replace("/ajax/", "");

		if(req.method == "GET") {
			// get 参数
			var queryObj = {};
			try {
				var query = url.parse(req.url).query;
			    var queryObj = qs.parse(query);
			} catch(e) {
				// pass
			}
		    app.dealWithAjax(conf, req, res, func, queryObj);
		} else if(req.method == "POST") {
			var body = {};
        	req.setEncoding('utf8');
	    	req.on('data', function (chunk) {
		        body += chunk;
		    });
		    req.on('end', function () {
		    	// post 参数
		    	try {
		    		body = JSON.parse(body);
		    	} catch (e) {
		    		// pass
		    	}
		        app.dealWithAjax(conf, req, res, func, body);
		    });
		} else {
			app.deal404(res);
		}
	} else if(pathname!='/favicon.ico'){
		app.dealWithStatics(conf, req, res, pathname, extname);
	}
}).listen(conf.port, conf.hostname, ()=>{
    console.log(`服务器启动成功，可以访问：http://${conf.host}:${conf.port}`);
});

