// **************************************************************** //
// events.js - Custom interface event listener functions
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
		getPropertyValue('background-color') == '#cff1fc') 
		? 'transparent' : '#cff1fc';

	// Assign key bindings for multiple file selection depending on the OS	
	if(navigator.platform.indexOf('Mac') > -1) 
	 	 keydown = event.metaKey;
	else keydown = event.ctrlKey;

	// Change the item's text color upon click only if the select key isn't pressed
	if(!keydown) {
		for(var i = 0; i < file.parentNode.childNodes.length; i++) 
			file.parentNode.childNodes[i].style.backgroundColor = 'transparent';
		file.style.backgroundColor = (window.getComputedStyle(file).
			getPropertyValue('background-color') == '#cff1fc') 
			? 'transparent' : '#cff1fc';
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to sent a message to the server to cd upon double click
function uponDblClick(file) {
	if(file.obj.attrs.isDirectory) {
		// Show the loading icon and send the message to cd
		var icon = document.createElement('img');
		icon.src = '../../images/loading.svg';
		icon.className = 'loadingIcon';
		file.parentNode.appendChild(icon);

		socket.emit('command', 'cd', file.obj);
	}
	else messageBox('Clicked file!');
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to change the color of the file when mouse is dragged over
function ondragstartCall(ev) {
	ev.dataTransfer.setData('id', ev.target.id); 

	// for(var i = 0; i < ev.target.parentNode.childNodes.length; i++) 
	//	ev.target.parentNode.childNodes[i].style.backgroundColor = 'transparent';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Listener to change the color of the file when mouse is dragged over
function ondragoverCall(ev) {
	ev.preventDefault();
	ev.target.style.backgroundColor = '#cff1fc';
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
	var droppedOn = document.getElementById(droppedId);
	var draggedFile = document.getElementById(draggedId);
	droppedOn.obj.path = cleanup(droppedOn.obj.path);
	draggedFile.obj.path = cleanup(draggedFile.obj.path);

	// Change the background color of the file being dragged over 
	for(var i = 0; i < droppedOn.parentNode.childNodes.length; i++) 
		droppedOn.parentNode.childNodes[i].style.backgroundColor = 'transparent';
	droppedOn.style.backgroundColor = '#cff1fc';

	// Base cases in which files are dragged and dropped within their host views
	if(draggedFile.obj.panel == droppedOn.obj.panel) {
		if(draggedFile.obj.panel === 'local') 
			socket.emit('command', 'mvl', draggedFile.obj, droppedOn.obj);
		else socket.emit('command', 'mvr', draggedFile.obj, droppedOn.obj);
	}
	// Execute sftp PUT command if local file is dragged to remote dir
	else if(draggedFile.obj.panel == 'local') { 
		messageBox('Transferring files');
		socket.emit('command', 'put', draggedFile.obj, droppedOn.obj);
		console.log('Put command transmitted to the server!');
	}
	// Execute sftp GET command if remote file is dragged to local dir
	else if(draggedFile.obj.panel == 'remote') {
		messageBox('Transferring files');
		socket.emit('command', 'get', draggedFile.obj, droppedOn.obj);	
		console.log('Get command transmitted to the server!');
	}
	// Error-check if the file panel is invalid
	else console.log('Cannot determine host origin of dragged file!');

	console.log("Dragged and dropped ("+draggedId+") onto ("+droppedId+")");
	console.log(JSON.stringify(draggedFile.obj, null, 2)+"\t-\t"+JSON.stringify(droppedOn.obj, null, 2));
}

// **************************************************************** //
