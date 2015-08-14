// **************************************************************** //
// ui.js - Scripts involving the user interface	
// **************************************************************** //
// Usage: (current working dir, files json, local or remote host view)
function showDirectory(path, files, panel) {
	console.log('--> in showDirectory()');

	if(path.lastIndexOf('/') !== path.length-1) path += '/';

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Display the current working directory in the footer
	var input = document.createElement('input');
	input.id = panel+'cwd';
	input.type = 'text';
	input.className = 'cwd';
	input.placeholder = path;
	input.panel = panel;

	// Insert the placeholder upon clicking the go to footer
	input.onclick = function() { this.value = this.placeholder; };
	input.onblur = function() { input.value = ''; };

	// Contact the server to change the directory upon enter key press
	input.onkeydown = function() {
		// Pressed the enter key in the input bar 
		if(event.keyCode == 13) {
			// Show the loading icon and send the message to cd
			var icon = document.createElement('img');
			icon.src = '../../images/loading.svg';
			icon.id = this.panel+'LoadIcon';
			icon.className = 'loadingIcon';
			document.getElementById(this.panel+'View').appendChild(icon);

			var newDir = {
				'path'		: this.value,
				'panel'		: panel,
				'filename'	: ''
			};
			this.value = '';
			this.blur();
			socket.emit('command', 'cd', newDir);
		}

		// Pressed the backspace key in the input bar 
		if(event.keyCode == 8) {
			if(this.value.lastIndexOf('/') === 0) return;
			var newPath = this.value;
			newPath = newPath.substr(0, newPath.lastIndexOf('/'));
			newPath = newPath.substr(0, newPath.lastIndexOf('/'));
			newPath += '/ ';
			this.value = newPath;
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Replace placeholder if the input already exists, otherwise create one 
	if(document.contains(document.getElementById(panel+'cwd'))) 
		document.getElementById(panel+'cwd').placeholder = path;	
	else document.getElementById(panel+'Footer').appendChild(input);

	// Remove the directory listing if it already exists
	if(document.contains(document.getElementById(panel+'DirListing')))
		document.getElementById(panel+'DirListing').remove();
	
	// Remove loading icon if it exists
	if(document.contains(document.getElementById(panel+'LoadIcon')))
		document.getElementById(panel+'LoadIcon').remove();
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Create the file list
	var list = document.createElement('ul');
	list.id = panel+'DirListing';
	list.className = 'bulletless';
	list.style.textAlign = 'left';

	// Display the file listing for the current directory 
	for(var i = 0; i < files.length; i++) {
		// Enclose the loop contents in a closure to avoid variable hoisting for file
		(function() {
			// Create a file item and append to the list
			var file = fileItem(path, files[i], panel);
			list.appendChild(file);
		}())
	}
	document.getElementById(panel+'View').appendChild(list);
}	

// **************************************************************** //
