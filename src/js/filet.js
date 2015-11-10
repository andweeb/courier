// ******************************************************************************* //
// filet.js - Main client side socket listeners and document load functions 

var fxns = {
    'login-fail'     : loginFail,
    'login-success'  : loginSuccess,
    'sftp-ls'        : sftpListFiles
};

function loginFail(id, data) {
    console.log("--> in sftpFail()");
    console.log("id: "+id+"\tdata: "+data);
}

function loginSuccess(id, data) {
    console.log("--> in sftpSuccess()");
    console.log("id: "+id+"\tdata: "+data);
}

function sftpListFiles(id, data) {
    console.log("--> in sftpListFiles()");
    console.log("id: "+id+"\tdata: "+data);
}

var wsuri = "ws://localhost:1337/connect";
var socket = new WebSocket(wsuri);

socket.onopen = function() { 
    socket.send("Connected to "+wsuri+"!"); 
};

socket.onmessage = function(message) { 
    var json = JSON.parse(message.data);
    console.log("Received: "+JSON.stringify(json,null,2));
    fxns[json.fxn](json.id, json.data);
};

socket.onclose = function(e) { 
    console.log("Connected closed (code: "+e.code+")"); 
};

function connect(connId) {	
	console.log("Connecting to sftp server...");
	var data = {};
	data.hostname = document.getElementById('hostname').value;	
	data.port     = document.getElementById('port').value;	
	data.username = document.getElementById('username').value;	
	data.password = document.getElementById('password').value;	

    var json = {
        "id"    :   connId,
        "fxn"   :   "sftpConnect",
        "data"  :   JSON.stringify(data)
    };
    socket.send(JSON.stringify(json));
}

function clean() {
	document.getElementById('hostname').value = '';	
	document.getElementById('port').value = '';
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}
