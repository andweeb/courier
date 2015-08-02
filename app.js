var fs = require('fs');
var path = require('path');
var async = require('async');
var logger = require('morgan');
var express = require('express');
var client = require('ssh2').Client;
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var connection = new client();
var sftp = require('./controllers/sftp.js');
var factory = require('./controllers/sftp.js');

// **************************************************************** //
// Express.js Stuff //

// Make the page respond with the follow for requests to the homepage ('/')
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public/js', express.static(path.join(__dirname, 'public/js')));
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use('/public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/socket.io/socket.io.js', express.static(path.join(__dirname, '/socket.io/socket.io.js')));
app.use(express.static(path.join(__dirname, 'public')));

// **************************************************************** //
// Socket.io client-server communication stuff //
// Start a server and listens on port 1337 for connection
var server = app.listen(1337, function () {
	var port = server.address().port;
	var io = require('socket.io').listen(server);
	console.log('Listening at https://localhost:%s', port);
	
	// Upon a successful server connection
	io.on('connect', onConnect);
});

// **************************************************************** //
// A nice bread crumb trail of callbacks 
var gSocket;
function onConnect(socket) {	
	// Receive an input from the client 
	gSocket = socket;
	socket.on('message', onClientMessage); 
	socket.on('error', function (err) {
		console.log("Socket error! "+err);
	});
}

// Upon the retrieval of inputs from the client
function onClientMessage(input) {
	console.log("Received input from the client: "+JSON.stringify(input, null, 2)); 
	
	// Assign method chain upon a successful sftp connection 
	connection
		.on('ready', sftpReady) 
		.on('close', sftpClose)
		.connect({
			host: input.hostname,
			port: input.port,
			username: input.username,
			password: input.password
		});			
}

// Upon the ready status of the sftp connection 
function sftpReady() {
	gSocket.emit('status', 'success');
	console.log('Client :: ready');
	connection.sftp(sftpStart);
}

// Upon either a disconnect or an exit
function sftpClose() {
	console.log('SFTP session closed!');
}

var gSFTP;
// Start executing sftp commands within the current session
function sftpStart(err, sftp) {
	gSFTP = sftp;
	// Send a status message to the client
	if(err) {
		gSocket.emit('status', 'Failed to start session: '+err.message); 
		throw err;
	}
	
	// Show the root folder of the remote host upon initial login
	sftp.readdir('/', function(err, list) {
		if(err) throw err;

		var view = {
			'ui' : 'hosts',
			'cwd' : '/',
			'files' : list	
		};
		gSocket.emit('view', view);
		console.log('Sent panel information to the client');
	});

	// Run sftp command based on the user's interaction with the ui 
	gSocket.on('command', function(command) {
		factory.determine(gSFTP, command);
	}); 
}
