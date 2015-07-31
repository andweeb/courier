var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var client = require('ssh2').Client;
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var connection = new client();
var sftp = require('./controllers/sftp.js');

// **************************************************************** //
// Express.js Stuff //

// Make the page respond with the follow for requests to the homepage ('/')
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
	console.log('Listening at http://localhost:%s', port);
	
	// Upon a connection
	io.on('connect', function(socket) {
		// Receive an input from the client 
		socket.on('message', function(input) {
			console.log("Received input from the client: "+JSON.stringify(input, null, 2)); 
			// sftp.login(input);
			connection.on('ready', function() {
				console.log('Client :: ready');
				connection.sftp(function (err, sftp) {
					if(err) throw err;
					// Upon initial login show the root folder
					sftp.readdir('/', function(err, list) {
						if(err) throw err;
						console.dir(list);
					});

					// Run sftp command based on user action
					// socket.on('command', function(test) {console.log(test)}); 
					socket.on('command', function() {
						console.log(test);
					}); 
				});
			}).connect({
				host: input.hostname,
				port: input.port,
				username: input.username,
				password: input.password
			});			

	    });
		socket.on('error', function (err) {
			console.log("Socket error! "+err);
		});
	});
});
// **************************************************************** //
