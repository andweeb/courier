// **************************************************************** //
// events.js - Custom interface event listener functions for file.js
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to set the drag image 
function dragImageListener(ev, url) {
	var img = document.createElement('img');
	img.src = url;
	img.width = '15px'; 
	ev.dataTransfer.setDragImage(img, 20, 20);	
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to set file item styles upon click (#E8F4FC)
function uponClick(event, file) {
	// Select or de-select the file
	file.style.backgroundColor = (window.getComputedStyle(file).
		getPropertyValue('background-color') == 'rgb(207, 241, 252)') 
		? 'transparent' : 'rgb(207, 241, 252)';

	// Assign key bindings for multiple file selection depending on the OS	
	if(navigator.platform.indexOf('Mac') > -1) 
	 	 keydown = event.metaKey;
	else keydown = event.ctrlKey;

	// Change the item's text color upon click only if the select key isn't pressed
	if(!keydown) {
		for(var i = 0; i < file.parentNode.childNodes.length; i++) 
			file.parentNode.childNodes[i].style.backgroundColor = 'transparent';
		file.style.backgroundColor = (window.getComputedStyle(file)
			.getPropertyValue('background-color') == 'rgb(207, 241, 252)') 
			? 'transparent' : 'rgb(207, 241, 252)';
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to sent a message to the server to cd upon double click
function uponDblClick(file) {
	if(file.obj.attrs.isDirectory) {
		// Play a cute mouse click sound
		var clickSound = document.createElement('AUDIO');
		clickSound.setAttribute('src', '../../../sounds/click.wav');
		clickSound.play();
		
		// Show the loading icon and send the message to cd
		var icon = document.createElement('img');
		icon.src = '../../../images/loading.svg';
		icon.className = 'loadingIcon';
		file.parentNode.appendChild(icon);

		socket.emit('command', 'cd', file.obj);
	}
	else messageBox('info-box', 'Clicked file: ' + file.obj.filename);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to set the css styles of the selected files 
var selected = {}; 
function ondragstartCall(ev) {
	ev.dataTransfer.setData('id', ev.target.id); 
	ev.target.style.color = 'rgb(135,193,248)';
	ev.target.style.fontSize = '12px';
	ev.target.style.backgroundColor = 'rgb(207, 241, 252)';

	// Add the dragged file into the selected object
	var file = ev.target.obj.filename;
	selected[file] = ev.target.obj;
			
	// Iterate through the entire file listing of the host view of the dragged file 
	var length = ev.target.parentNode.childNodes.length;
	for(var i = 0; i < length; i++) {

		// If the file was selected (the background color is blue)
		if(window.getComputedStyle(ev.target.parentNode.childNodes[i])
				 .getPropertyValue('background-color') == 'rgb(207, 241, 252)') {

			// Add to selected and change the font color and size of the selected
			file = ev.target.parentNode.childNodes[i].obj.filename;	
			if(!(file in selected)) // Avoid duplicates in the selected object
				selected[file] = ev.target.parentNode.childNodes[i].obj;
			ev.target.parentNode.childNodes[i].style.color = 'rgb(135,193,248)';
			ev.target.parentNode.childNodes[i].style.fontSize = '12px';
		}
		// Set the background color of all of the files to transparent
		ev.target.parentNode.childNodes[i].style.backgroundColor = 'transparent';
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to change the color of the file when mouse is dragged over
function ondragoverCall(ev) {
	ev.preventDefault();
	ev.dataTransfer.setData('hi', ':)'); 
	ev.target.style.backgroundColor = 'rgb(207, 241, 252)';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to change the color of the file when mouse leaves the file item 
function ondragleaveCall(ev) {
	ev.preventDefault();
	ev.target.style.backgroundColor = 'transparent';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to send a message based on the file drop action 
function ondropCall(ev) {
	ev.preventDefault();

	var droppedId = ev.target.id;
	var draggedId = ev.dataTransfer.getData('id');	

	console.log("Dropped ID: "+droppedId);
	console.log("Dragged ID: "+draggedId);

	var droppedOn = document.getElementById(droppedId);
	var draggedFile = document.getElementById(draggedId);

	droppedOn.obj.path = cleanup(droppedOn.obj.path);
	draggedFile.obj.path = cleanup(draggedFile.obj.path);
	// +++++++++++ droppedOn.obj.path is incorrect here +++++++++++
	//
	//		was each file obj path was incorrectly assigned...?
	// 
	// +++++++++++ droppedOn.obj.path is incorrect here +++++++++++
	
	// Change the background color of the file being dragged over 
	for(var i = 0; i < droppedOn.parentNode.childNodes.length; i++) 
		droppedOn.parentNode.childNodes[i].style.backgroundColor = 'transparent';
	droppedOn.style.backgroundColor = 'rgb(207, 241, 252)';

	console.log("Dragged and dropped ("+JSON.stringify(draggedFile, null, 2)+") onto ("+JSON.stringify(droppedOn, null, 2)+")");
	// console.log("Selected: "+JSON.stringify(selected, null, 2));

	// Base cases in which files are dragged and dropped within their host views
	if(draggedFile.obj.panel === droppedOn.obj.panel) {
		if(draggedFile.obj.panel === 'local') 
			socket.emit('command', 'mvl', draggedFile.obj, droppedOn.obj);
		else socket.emit('command', 'mvr', draggedFile.obj, droppedOn.obj);
	}
	// Execute sftp PUT command if local file is dragged to remote dir
	else if(draggedFile.obj.panel == 'local') { 
		messageBox('file-transfer', 'Transferring files');
		socket.emit('command', 'put', draggedFile.obj, droppedOn.obj);
		console.log('Put command transmitted to the server!');
	}
	// Execute sftp GET command if remote file is dragged to local dir
	else if(draggedFile.obj.panel == 'remote') {
		messageBox('file-transfer', 'Transferring files');
		socket.emit('command', 'get', draggedFile.obj, droppedOn.obj);	
		console.log('Get command transmitted to the server!');
	}
	// Error-check if the file panel is invalid
	else console.log('Cannot determine host origin of dragged file!');
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to reset all css style changes back to the original style 
function ondragendCall(ev) {
	var localFiles = document.getElementById('localDirListing');
	var remoteFiles = document.getElementById('remoteDirListing');

	// Reset all the file css styles to the default in both views
	for(var i = 0; i < localFiles.childNodes.length; i++) {
		localFiles.childNodes[i].style.fontSize = '11px';
		localFiles.childNodes[i].style.color = '#545454';
		localFiles.childNodes[i].style.backgroundColor = 'transparent';
	} for(var i = 0; i < remoteFiles.childNodes.length; i++) {
		remoteFiles.childNodes[i].style.fontSize = '11px';
		remoteFiles.childNodes[i].style.color = '#545454';
		localFiles.childNodes[i].style.backgroundColor = 'transparent';
	}

	// Empty the object of selected files
	selected = {};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to reset all css style changes back to the original style 
function oncontextmenuCall(ev) {
	showMenu(ev);
}

// **************************************************************** //
