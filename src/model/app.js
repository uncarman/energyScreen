"use strict";

var fs=require('fs');

var _path = process.cwd();
var mimeModel=require(_path+'/src/model/getmimefromfile.js');
var handler = require(_path+'/src/model/handler.js');


/*返回静态文件*/
function dealWithStatics(conf, req, res, pathname, extname) {
    fs.readFile(_path+'/src/static/'+pathname,function(err, data){
		if(err){
			deal404(res);
		}else{ /*返回这个文件*/
			var mime=mimeModel.getMime(fs,extname);  /*获取文件类型*/
			res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
			res.write(data);
			res.end(); /*结束响应*/
		}
	});
}

function deal404(res) {
	fs.readFile(_path+'/src/static/404.html',function(error,data404){
		if(error){
			console.log(error);
		}
		res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
		res.write(data404);
		res.end(); /*结束响应*/
	})
}

async function dealWithAjax(conf, req, res, func, data) {
	if(handler.hasOwnProperty(func)) {
    	handler[func](conf, data).then(result=>{
    		res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"});
	    	res.write(JSON.stringify(result));
	    	res.end(); /*结束响应*/
    	}).catch(err=>{
			res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"});
	    	res.write(err.message);
	    	res.end(); /*结束响应*/
		});
	} else {
		deal404(res);
	}
}

exports = module.exports = {
	dealWithStatics:dealWithStatics,
	deal404:deal404,
	dealWithAjax: dealWithAjax,
};

