// **************************************************************** //
// Establish server side sftp connection
var fs = require('fs');
var path = require('path');
var client = require('ssh2').Client;
var connection = new client();

// ye
function run(socket, sftp, command, file) {
	console.log("--> in run()! command: "+command+"file: " +JSON.stringify(file,null,2));
	switch(command) {
		case 'cd':
			cd(socket, sftp, command, file);
			break;
			
		default: break;

	}
}

exports.run = run;

// **************************************************************** //
// Change Directory (cd) sftp command - user double clicks
// --> requires file.path, panel, filename 
function cd(socket, sftp, command, file) {
	// Clean up the pathname (append '/' at the end if necessary)
	if(file.path.lastIndexOf('/') !== file.path.length-1 &&
		file.path.length > 1) file.path += '/';
	if(file.path.lastIndexOf('/') !== file.path.length-1 &&
		file.path.length > 1) file.path += '/';
		
	if(file.panel === 'local') {
		var localFiles = [];
		var localFiles = [];

		try { var temp = fs.readdirSync(file.path+file.filename); }
		catch(err) {
			console.log("error caught in cd(): "+err);
			socket.emit('error', err);
			return;
		}
	
		// Initialize the files array and get the new directory's file information
		for(var i = 0; i < temp.length; i++) 
			 localFiles.push({ 'filename' : temp[i], 'longname' : '', 'attrs' : {} });
		for(var i = 0; i < localFiles.length; i++) {
			var stats = fs.statSync(file.path+file.filename+'/'+localFiles[i].filename);
			localFiles[i].attrs = stats; 
			localFiles[i].attrs.isDirectory = stats.isDirectory(); 
		}

		// Construct object to send to the client
		var info = {
			'path' 	: file.path+file.filename,
			'files'	: localFiles,
			'panel' : 'local'
		};
		socket.emit('update', info);
	}
	else if(file.panel === 'remote') {
		console.log(":>");
	}	
}

// **************************************************************** //
// file object example content 
// file = {
//   "path": "/Users/username",
//	  "panel": "local",
//	  "attrs": {
//	    "dev": 16777223,
//	    "mode": 16877,
//	    "nlink": 3,
//	    "uid": 501,
//	    "gid": 20,
//	    "rdev": 0,
//	    "blksize": 4096,
//	    "ino": 1993373,
//	    "size": 102,
//	    "blocks": 0,
//	    "atime": "2015-08-01T10:17:28.000Z",
//	    "mtime": "2015-04-15T05:42:28.000Z",
//	    "ctime": "2015-04-15T05:42:28.000Z",
//	    "birthtime": "2015-04-15T05:42:28.000Z",
//	    "isDirectory": true
//	  },
//	  "filename": ".test",
//	  "longname": ""
//	}
