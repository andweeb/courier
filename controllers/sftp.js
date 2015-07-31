var fs = require('fs');
var path = require('path');
var client = require('ssh2').Client;
var connection = new client();

function login(input) {
	connection.on('ready', function() {
		console.log('Client :: ready');
		connection.sftp(function (err, sftp) {
			if(err) throw err;
			sftp.readdir('cd /var/mobile/Media', function(err, list) {
				if(err) throw err;
				console.log("list: "+list);
				console.dir(list);
				connection.end();
			});
		});
	}).connect({
		host: input.hostname,
		port: input.port,
		username: input.username,
		password: input.password
	});
}

exports.login = login;
