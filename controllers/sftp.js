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
		console.dir(list);
	});
}

exports.determine = determine;

// **************************************************************** //
