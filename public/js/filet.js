// **************************************************************** //
// Client side

$(function(){
  $('.container, .centered').css({ height: $(window).innerHeight()/2 });
  $(window).resize(function(){
    $('.container, .centered').css({ height: $(window).innerHeight()/2 });
  });
});

var socket = io.connect('http://0.0.0.0:1337', {
    autoConnect: true
});

// Add a connect listener
socket.on('connect', function() {
    console.log('Client has connected to the server!');
});

// Add a listener to receive data
socket.on('message', function(data) {
    console.log('Received data from the server!', JSON.stringify(data));
});

function connect() {	
	console.log("Connecting to sftp server...");
	var data = {};
	data.hostname = document.getElementById('hostname').value;	
	data.username = document.getElementById('username').value;	
	data.password = document.getElementById('password').value;	

	socket.emit('message', data);
}

function clean() {
	document.getElementById('hostname').value = '';	
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}

// **************************************************************** //
