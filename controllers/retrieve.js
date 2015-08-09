var fs = require('fs');
var path = require('path');
var async = require('async');
// **************************************************************** //
// Get the file listing of the local directory at the specified path
function localFiles(path) {
	var localFiles = [];

	try { var temp = fs.readdirSync(path); }
	catch(err) {
		console.log('Error (fs.readdirSync): '+err);
		return null;
	}

	// Initialize the files array and get the new directory's file information
	for(var i = 0; i < temp.length; i++) 
		 localFiles.push({ 'filename' : temp[i], 'longname' : '', 'attrs' : {} });
	for(var i = 0; i < localFiles.length; i++) {
		var stats = fs.statSync(path + '/' + localFiles[i].filename);
		localFiles[i].attrs = stats; 
		localFiles[i].attrs.isDirectory = stats.isDirectory(); 
	}

	// Construct object to send to the client
	var info = {
		'path' 	: path, 
		'files'	: localFiles,
		'panel' : 'local'
	};
	
	return info;
}

// **************************************************************** //
// Get the file listing of the remote directory at the specified path
function remoteFiles(sftp, path) {
	return new Promise(function(resolve, reject) {
		try {
			sftp.readdir(path, function(err, remoteFiles) {
				if(err) {
					console.log('Error (sftp.readdir): '+err);
					reject(err);
				}
				// Iterate through the remoteFiles and find the directories 
				var count = 0;
				async.each(remoteFiles, async.ensureAsync(function(newfile, done) {
					// Execute a file stat callback per new file item
					sftp.stat(path+'/'+newfile.filename, function(error, stats) {
						if(error) {
							console.log('Error (sftp.stat): '+error);
							return null;
						}
	
						// Append the isDirectory info to attrs of each file	
						remoteFiles[count].attrs.isDirectory = stats.isDirectory();
						count++;
						done();
					}); // end of stat
				}), function() { 
					// Callback function upon finishing async each  
					var info = {
						'path'	: path,
						'files'	: remoteFiles,
						'panel'	: 'remote'
					};
					resolve(info);

				}); // end of async each 
			}); // end of readdir
		} catch(err) {
			console.log("Error (sftp.readdir): "+err);
			reject(err);
		}
	});
}

exports.localFiles = localFiles;
exports.remoteFiles = remoteFiles;
