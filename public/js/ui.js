// **************************************************************** //
// ui.js - Scripts involving the user interface	

// Custom interface listener functions
function dragImageListener(e, url) {
	var img = document.createElement('img');
	img.src = url;
	img.width = '15px'; 
	e.dataTransfer.setDragImage(img, 20, 20);	
}

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

	// Contact the server to change the directory upon enter key press
	input.onkeydown = function() {
		if(event.keyCode == 13) {
			var newDir = {
				'path'		: this.value,
				'panel'		: panel,
				'filename'	: ''
			};
			this.value = '';
			socket.emit('command', 'cd', newDir);
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Replace placeholder if the input already exists otherwise create one 
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

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


	// Create the right-click menu
	var optionMenu = []; 
	for(var i=1; i < 10; i++) { 
		var option = {}; 
		option['Option #'+i] = function() {}; 
		optionMenu.push(option); 
	}

	// Append a context menu item on right click for all items
	for(var i = 0; i < files.length; i++) { 
		$('.grow').contextMenu(optionMenu, { 
			showTransition:'fadeIn',
			hideTransition:'fadeOut',
			useIframe:false
		});
	}
}	

// **************************************************************** //
// Return a file item object with all attributes and event listeners 
function fileItem(path, currentFile, panel) {
	var file = document.createElement('li');
	var extIndex = currentFile.filename.indexOf('.')+1;
	var extension = currentFile.filename.substr(extIndex);
	file.id = currentFile.filename;
	file.className = 'grow';
	file.style.padding = '0.3rem';
	file.style.paddingLeft = '1.5rem';
	file.style.paddingRight = '0rem';
	file.style.color = '#545454';
	file.draggable = 'true';
	
	// Set custom html attributes for the command interpreter
	file.obj = { 
		'path'		: path,
		'panel'		: panel,
		'attrs'		: currentFile.attrs,
		'filename'	: currentFile.filename,
		'longname'	: currentFile.longname,
		'extension'	: extension
	};
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Assign some listeners and event attributes to each list item
	file.onclick = function() {
		// Change the item's text color upon click
		for(var i = 0; i < this.parentNode.childNodes.length; i++) 
			this.parentNode.childNodes[i].style.backgroundColor = 'transparent';
		this.style.backgroundColor = '#E7ECFA';
	};
	file.addEventListener("dblclick", function() {
		var fileObj = file.obj;
		socket.emit('command', 'cd', fileObj);
	}, false);
	file.ondragstart = function(ev) { ev.dataTransfer.setData('id', ev.target.id); };
	file.ondragover = function(ev) { ev.preventDefault(); };
	file.ondrop = function(ev) {
		ev.preventDefault();
		var droppedId = ev.target.id;
		var draggedId = ev.dataTransfer.getData('id');	
		var droppedFile = document.getElementById(droppedId);
		var draggedFile = document.getElementById(draggedFile);

		// Execute sftp PUT command if local file is dragged to remote dir
		if(draggedFile.obj.panel === 'local') 
			socket.emit('command', 'put', draggedFile.obj, droppedFile.obj);
		// Execute sftp GET command if remote file is dragged to local dir
		else if(draggedFile.obj.panel == 'remote') 
			socket.emit('command', 'get', draggedFile.obj, droppedFile.obj);	
		// Error-check if the file panel is invalid
		else console.log('Cannot determine host origin of dragged file!');
		
		console.log("Dragged and dropped ("+draggedId+") onto ("+droppedId+")");
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Depending on filetype assign an appropriate icon and event listener
	if(currentFile.attrs.isDirectory) {
		file.style.background = "url('../images/files/dir.svg') "
							  + "no-repeat 1% 50%";
	
		// Add a listener to change the drag ghost image to a directory icon
		file.addEventListener("dragstart", function(e) { 
			dragImageListener(e, '../images/files/dir.svg');
		}, false);
	} else {
		// Assign the file its corresponding extension icon if its icon exists 
		if(!extensionImageExists(extension)) 
		 	 file.style.background = "url('../images/files/idk.svg')"
								   + "no-repeat 1% 50%";
		else if(currentFile.filename.indexOf('.') > 1) 
			 file.style.background = "url('../images/files/"
								   + extension+".svg') no-repeat 1% 50%";
		else file.style.background = "url('../images/files/idk.svg')"
								   + "no-repeat 1% 50%";
		
		// Add a listener to change the drag ghost image to a file icon
		file.addEventListener("dragstart", function(e) {
			var dragImg;
			if(!extensionImageExists(this.obj.extension)) 
				dragImg = "../images/files/idk.svg"
			else if(this.obj.filename.indexOf('.') > 1) 
				dragImg = "../images/files/"+this.obj.extension+".svg";
			else dragImg = "../images/files/idk.svg"
			dragImageListener(e, dragImg);
		}, false);
	}
	
	file.style.backgroundSize = '1rem';
	file.innerHTML = currentFile.filename;

	return file;
}

function messageBox() {
	console.log("path: "+this.cwd+'/'+this.filename);
	var message = document.createElement('div');
	message.id = 'message';
	message.className = 'messageBox';
	message.innerHTML = this.filename;
	message.draggable = 'true';

	document.body.appendChild(message);
	$('.messageBox').draggable();
}

// **************************************************************** //
