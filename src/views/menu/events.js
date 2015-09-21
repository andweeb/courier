// ******************************************************************************* //
// events.js - Custom interface event listener functions for menu.js
function fileExistsInView(panel, filename) {
	var fileListing = document.getElementById(panel+'DirListing')
							  .childNodes;
	var listLength = fileListing.length;

	// Iterate through the file listing of the target panel view
	for(var i = 0; i < listLength; i++) {
		if(filename === fileListing[i].id.substr(2))
			return true;
	}
	return false;
}

function createFolder(file) {
	// Prompt user for the new folder name
	console.log('File: ' + JSON.stringify(file, null, 2));
	var parameters = {
		'type'		: 'input-prompt',
		'purpose'	: 'create-new',
		'title'		: 'New folder?',
		'text'		: 'Input the new folder name: ',
		'file'		: file,
		'listener'	: function(file, newFilename) {
			if(fileExistsInView(file.obj.panel, newFilename)) {
				// The filename is invalid, so show an error message box
				console.log("The name '" + newFilename + "' is already in use!");
				var errParams = {
					'type'		: 'error',
					'title'		: 'Invalid Filename!',
					'text'		: 'File already exists in this folder!'	
				};
				messageBox(errParams);
			} else socket.emit('command', 'mkdir', file.obj);
		}
	};
	messageBox(parameters);
	
	// Display error if folder name already exists in the directory listing
}

function createFile(file) {
	// Prompt user for the new file name
}

function copyFile(file) {

}

function pasteFile(file) {

}

function renameFile(file) {
	// Prompt user for the new file name
	
	// Check if the new file name conflicts with any existing file in the listing
}

function deleteFile(file) {
	// Prompt user if they want to delete this file
	
	// socket.emit('delete file', file);
}

function showAttributes(file) {

}
