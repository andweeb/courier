var async = require('async');
var prompt = require('prompt');

prompt.start();
prompt.get(['host', 'port', 'user', 'password'], function (err, input) {
	if (err) { return onErr(err); }
	console.log('Command-line input received:');
	console.log('  Hostname: ' + input.host);
	console.log('  Port: ' + input.port);
	console.log('  Username: ' + input.user);
	console.log('  Password: ' + input.password);

	console.log(JSON.stringify(input, null, 2));

	var client = require('ssh2').Client;
	var connection = new client();

	var localFiles = [ 
		'/Users/askwon/Desktop/file10mb',
		'/Users/askwon/Desktop/file20mb'
	];
	var remoteFiles = [
		'/var/mobile/Media/Downloads/file10mb',
		'/var/mobile/Media/Downloads/file20mb'
	];
	
	connection.on('ready', function() {
		connection.sftp(function(err, sftp) {
			for(var i = 0; i < localFiles.length; i++) 
				put(sftp, localFiles[i], remoteFiles[i]);
		}); // end of sftp
	}).connect({ 
		host: input.host,
		port: input.port, 
		username: input.user, 
		password: input.password
	});

});

function put(sftp, localPath, remotePath) {
    var options = {
        concurrency	    : 50,   // what're some good
        chunkSize	    : 1000, // values here..? :(
        step		    : function(transferred, chunk, total) {
            var percentage = (Math.floor(transferred/total*10000)/100);
			process.stdout.write('Downloading ' + percentage + '% complete... \r');
        }
    };

    sftp.fastPut(localPath, remotePath, options, function(err) {
        if(err) {
            console.log('Error (sftp.fastPut): '+err);
            return;
        }
        console.log("Finished transferring");
    }); // end of fastPut
}
