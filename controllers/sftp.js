// **************************************************************** //
// Establish server side sftp connection
var fs = require('fs');
var path = require('path');
var async = require('async');
var client = require('ssh2').Client;
var connection = new client();

// ye
function run(socket, sftp, command, file1, file2) {
	switch(command) {
		case 'cd':
			cd(socket, sftp, command, file1);
			break;
		case 'get':
			get(socket, sftp, command, file1, file2);
			break;
		case 'put':
			put(socket, sftp, command, file1, file2);
			break;	
		case 'getlocally':

			break;
		case 'putlocally':
			
			break;
		default: break;

	}
}

exports.run = run;

//
function cleanup(file) {
	// Clean up the pathname (append '/' at the end if necessary)
	if(file.path.lastIndexOf('/') !== file.path.length-1 &&
		file.path.length > 1) file.path += '/';
	return file;
}

// **************************************************************** //
// Change Directory (cd) sftp command - user double clicks
// --> requires file.path, panel, filename 
var gSFTP;
function cd(socket, sftp, command, file) {
	console.log('--> in cd()');

	gSFTP = sftp;
	file = cleanup(file);
		
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Change the directory of the local host
	if(file.panel === 'local') {
		var localFiles = [];

		try { var temp = fs.readdirSync(file.path+file.filename); }
		catch(err) {
			console.log('Error (fs.readdirSync): '+err);
			socket.emit('error', err);
			return;
		}
	
		// Initialize the files array and get the new directory's file information
		for(var i = 0; i < temp.length; i++) 
			 localFiles.push({ 'filename' : temp[i], 'longname' : '', 'attrs' : {} });
		for(var i = 0; i < localFiles.length; i++) {
			var stats = fs.statSync(file.path+file.filename
									+ '/' + localFiles[i].filename);
			localFiles[i].attrs.isDirectory = stats.isDirectory(); 
			localFiles[i].attrs = stats; 
		}

		// Construct object to send to the client
		var info = {
			'path' 	: file.path+file.filename,
			'files'	: localFiles,
			'panel' : 'local'
		};
		socket.emit('update', info);
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Change the directory of the remote host
	else if(file.panel === 'remote') {
		try {
			sftp.readdir(file.path+file.filename, function(err, remoteFiles) {
				if(err) {
					console.log('Error (sftp.readdir): '+err);
					return;
				}

				// Iterate through the remoteFiles and find the directories 
				var count = 0;
				async.each(remoteFiles, async.ensureAsync(function(newfile, done) {
					// Execute a file stat callback per new file item
					sftp.stat(file.path+file.filename
							+'/'+newfile.filename, function(error, stats) {
						if(error) {
							console.log('Error (sftp.stat): '+error);
							return;
						}

						// Append the isDirectory info to attrs of each file	
						remoteFiles[count].attrs.isDirectory = stats.isDirectory();
						count++;
						done();
					}); // end of stat
				}), function() { 
					// Callback function upon finishing async each  
					var info = {
						'path'	: file.path+file.filename,
						'files'	: remoteFiles,
						'panel'	: 'remote'
					};

					// Send the file attribute information to the client
					socket.emit('update', info);
				}); // end of async each 
			}); // end of readdir
		} catch(err) {
			console.log("Error (sftp.readdir): "+err);
			socket.emit('error', err);
			return;
		}
	}	
	
	else { console.log("Unknown host!"); }
}

// **************************************************************** //
// Transfer file local -> remote (put) sftp command - user drags file left to right
// --> requires file1.path+filename & file2.path
function put(socket, sftp, command, file1, file2) {
	console.log("--> in put()");

	file1 = cleanup(file1);
	file2 = cleanup(file2);

	// The local file was dropped onto a file, so put it in the current directory
	if((!file1.attrs.isDirectory && !file2.attrs.isDirectory) || 
	  (file1.attrs.isDirectory && !file2.attrs.isDirectory)) {
		 
		// Tar compress the file if it is a directory
		if(file1.attrs.isDirectory)
			file1 = tarCompress(file1);
		
		var options = {
			concurrency : 25,
			chunkSize	: 32768,
			step		: function(transferred, chunk, total) {
				var percentage = (Math.floor(transferred/total*10000)/100);
				socket.emit('progress', percentage);
			}
		};

		console.log('Local Path: '+file1.path+file1.filename);
		console.log('Remote Path: '+file2.path);

		// SFTP put command with local/remote file path and options
		sftp.fastPut(file1.path+file1.filename, 
					 file2.path+file1.filename, 
				 	 options, function(err) {
			if(err) console.log('Error (sftp.fastPut): '+err);
			console.log("Finished transferring");
		});
	
		// socket.emit('startProgress', );
	}	
}

function tarCompress(file) {
	return file;
}


// **************************************************************** //
// Transfer file local -> remote (put) sftp command - user drags file left to right
// --> requires file.path+filename & dropped.path+filename
function get(socket, sftp, command, file1, file2) {
		
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
//		// Another working file transfer method:
//		var readStream = fs.createReadStream(file1.path+file1.filename);
//		var writeStream = sftp.createWriteStream(file2.path+file1.filename);
//		
//		writeStream.on('error', function(err) {
//			if(err) console.log("Error (writeStream.onError): "+err);
//		});
//		writeStream.on('close', function() {
//			console.log('Stream closed!');
//		});
//
//		readStream.pipe(writeStream);
