// **************************************************************** //
// ui.js - Scripts involving the user interface	
// **************************************************************** //
// Usage: (current working dir, files json, local or remote host view)
function showDirectory(path, files, panel) {
	console.log('--> in showDirectory()');

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
	input.onblur = function() {
		input.value = '';
	};

	// Contact the server to change the directory upon enter key press
	input.onkeydown = function() {
		if(event.keyCode == 13) {
			var newDir = {
				'path'		: this.value,
				'panel'		: panel,
				'filename'	: ''
			};
			this.value = '';
			this.blur();
			socket.emit('command', 'cd', newDir);
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Replace placeholder if the input already exists, otherwise create one 
	if(document.contains(document.getElementById(panel+'cwd'))) {
		document.getElementById(panel+'cwd').placeholder = path;	
	} else document.getElementById(panel+'Footer').appendChild(input);

	// Remove the directory listing if it already exists
	if(document.contains(document.getElementById(panel+'DirListing'))) {
		document.getElementById(panel+'DirListing').remove();
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Create the list
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
