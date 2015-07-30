var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// **************************************************************** //
// Express.js Stuff //
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

// **************************************************************** //
// Socket.io client-server communication stuff //
// Start a server and listens on port 1337 for connection
var server = app.listen(1337, function () {
	var host = server.address().address;
	var port = server.address().port;
	var io = require('socket.io').listen(server);
	console.log('Listening at http://localhost:%s', host, port);
	
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
