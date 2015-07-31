var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

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
 
	    });
		socket.on('error', function (err) {
			console.log("Socket error! "+err);
		});
	});
});
// **************************************************************** //
