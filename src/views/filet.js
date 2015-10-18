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

var socket = new WebSocket("ws://localhost:1337/connect");

socket.onopen = function() { socket.send("Connected!"); };
socket.onmessage = function(e) { console.log("Received: "+JSON.stringify(e.data,null,2)); };
socket.onclose = function() { console.log("Connected closed!"); };

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

// ******************************************************************************* //
function connect() {	
	console.log("Connecting to sftp server...");
	var data = {};
	data.hostname = document.getElementById('hostname').value;	
	data.port = document.getElementById('port').value;	
	data.username = document.getElementById('username').value;	
	data.password = document.getElementById('password').value;	

    console.log(JSON.stringify(data,null,2));
    socket.send(JSON.stringify(data));
}

function clean() {
	document.getElementById('hostname').value = '';	
	document.getElementById('port').value = '';
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}

// ******************************************************************************* //
