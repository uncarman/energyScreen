exports.getMime=function(extname){  /*根据请求的后缀名返回头文件类型*/

    switch (extname){

        case '.html':

            return 'text/html';
        case '.css':

            return 'text/css';

        case '.js':

            return 'text/javascript';

        default:
            return 'text/html';
    }

}