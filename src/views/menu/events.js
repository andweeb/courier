// ******************************************************************************* //
// events.js - Custom interface event listener functions for menu.js
function createFolder(file) {
	// Prompt user for the new folder name
	var title = 'New folder?';
	var message = 'Input the new folder name: ';
	messageBox('input-prompt', title, message);
	
	// Display error if folder name already exists in the directory listing
	
	// socket.emit('create folder', file);
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
