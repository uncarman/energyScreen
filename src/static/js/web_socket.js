function DefaultWebSocket(ipAdr,port){
	var that = this;
	//	检测浏览器是否支持WebSocket
	if (!window.WebSocket) {  
		window.WebSocket=window.MozWebSocket;  
	}
	// Javascript Websocket Client  
	if (window.WebSocket) {  
		this.socket = new WebSocket('ws://'+ipAdr+':'+port);  
		this.socket.onopen = function(event) {
			console.log("socket is opend");
		}; 
		//客户端接受来自WebSocketServer的数据，会触发onmessage消息，参数event中包含server传输过来的数据
		this.socket.onmessage = function(event) {
			var json = null;
			try {
				json=eval("("+event.data+")");
			} catch(e) {
				json=event.data;
			}
			if(typeof that.callback == "function") {
				that.callback(json);
			} else {
				console.log(json);
			}
		};  
		//客户端接收到WebSocketServer端发送的关闭连接请求时，就会触发onclose消息
		this.socket.onclose = function(event) { 
		};
		//链接错误，处理错误，数据错误会触发onerror消息
		this.socket.onerror = function(event) {
			this.socket = new WebSocket('ws://'+ipAdr+':'+port);  
		};
	} else {  
		alert("您的浏览器不支持 Web Socket.");  
	}
	return this;
}
DefaultWebSocket.prototype.send=function(message, callback){
  if (!window.WebSocket) { return; }  
  //0值表示该连接尚未建立.
  //1表示连接建立和沟通是可能的.
  //2表示连接是通过将结束握手.
  //3表示连接已关闭或无法打开.
  if(this.socket.readyState == WebSocket.OPEN) {
	  this.callback = callback;
	  this.socket.send(message);
  }else{  
	  alert("The socket 未链接.");  
  }
};
DefaultWebSocket.prototype.close=function(){
	this.socket.close();
};
