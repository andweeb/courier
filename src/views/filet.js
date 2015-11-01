// ******************************************************************************* //
// filet.js - Main client side socket listeners and document load functions 

// Resize the center divs to the view
$(function(){
	$(window).load(function(){
		$(".hostView").mCustomScrollbar();
    });
	
	$('.container, .centered').css({ height: $(window).innerHeight()/1.5 }); 
	$(window).resize(function(){
		$('.container, .centered').css({ height: $(window).innerHeight()/1.5 });
	});
});

var fxns = {
    'sftp-fail'     : sftpFail,
    'sftp-success'  : sftpSuccess,
};

function sftpFail() {
    console.log("--> in sftpFail()");
}
function sftpSuccess() {
    console.log("--> in sftpSuccess()");
}

var wsuri = "ws://localhost:1337/connect";
var socket = new WebSocket(wsuri);

socket.onopen = function() { socket.send("Connected to "+wsuri+"!"); };
socket.onmessage = function(message) { 
    console.log("Received: "+JSON.stringify(message.data,null,2)); 
    var json = JSON.parse(message.data);
    console.log("JSON: "+JSON.stringify(json,null,2));
    console.log("fxn: "+JSON.stringify(json,null,2));
    fxns[json.fxn]();
};
socket.onclose = function(e) { console.log("Connected closed (code: "+e.code+")"); };

// ******************************************************************************* //
function connect() {	
	console.log("Connecting to sftp server...");
	var data = {};
	data.hostname = document.getElementById('hostname').value;	
	data.port = document.getElementById('port').value;	
	data.username = document.getElementById('username').value;	
	data.password = document.getElementById('password').value;	

    var json = {
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

// ******************************************************************************* //
//var socket = io.connect(window.location.hostname+':1337', {
//    autoConnect: true,
//	secure: true
//});
//
//// Server connection listener
//socket.on('connect', function() {
//    console.log('Client has connected to the server!');
//});
//
//// Received data listener
//socket.once('message', function(data) {
//    console.log('Received data from the server: '+JSON.stringify(data));
//});
//
//// SFTP connection status listener
//socket.on('status', function(message) {
//    console.log('SFTP connection status: '+ message);
//});
//
//// Listen for when to toggle the view  
//socket.once('view', function(view) {
//	// ^ once to eliminate duplicate instances of views
//	if(view.ui == 'hosts') showAppView(view);	
//	else if(view.ui == 'login') showLoginView(); 
//});
//
//// Listen for when to update the local/remote directory listing 
//socket.on('update', function(info) {
//	showDirectory(info.path, info.files, info.panel);
//});
//
//// Listen for when a file transfer percentage is retrieved from the server
//socket.on('progress', function(percent) {
//	// console.log("Percent: "+percent);
//	var tspan = document.getElementById('percent');
//	tspan.textContent = percent+'%'; 
//	var progress = document.getElementById('progress');
//	progress.setAttributeNS(null, 'width', percent*1.5+'px');
//});
//
//socket.on('progress complete', function(panel) {
//	console.log("Process complete! :>");
//	var bar = document.getElementById('bar');
//	if(bar) bar.style.width = '150px';
//	var path = document.getElementById(panel+'cwd').placeholder;
//	socket.emit('refresh', panel, path);
//});
//
//// Listen for an error and deploy an error message
//socket.on('error', function(err) {
//	console.log('o_o');
//	console.log(err);
//});

