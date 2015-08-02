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
	
		// Iterate through the list and determine which files are directories
		var fileIndex = 0; 
		async.each(list, async.ensureAsync(function(file, done) {
			// Execute a file stat callback per iteration of the list
			sftp.stat('/'+file.filename, function(err, stats) {
				// Append to the attrs section of the file 
				list[fileIndex].attrs.isDirectory = stats.isDirectory();
				fileIndex++;
				done();
			});
		}), function() {
			// Callback function upon finish
			var view = {
				'ui' : 'hosts',
				'cwd' : '/',
				'files' : list	
			};

			// Send the file attribute information to the client
			gSocket.emit('view', view);
			console.log('Sent panel information to the client');
		});

	});

	// Run sftp command based on the user's interaction with the ui 
	gSocket.on('command', function(command) {
		factory.determine(gSFTP, command);
	}); 
}
// **************************************************************** //
// Establish server side sftp connection
var fs = require('fs');
var path = require('path');
var client = require('ssh2').Client;
var connection = new client();

// ye
function determine(sftp, command) {
	sftp.readdir('/var/mobile/Media/ROMs/', function(err, list) {
		if(err) throw err;
		// console.dir(list);
		console.log("--> in determine()");
	});
}

exports.onConnect = onConnect;
exports.determine = determine;

// **************************************************************** //
