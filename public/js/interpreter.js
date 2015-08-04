// **************************************************************** //
// Client user interface action interpreter
// DOM Events - http://www.w3schools.com/jsref/dom_obj_event.asp

// Construct an sftp command based on the user's action
function interpret(action, file) {
	console.log("Action: "+action);	
	switch(action) {
		// Change directory
		case 'click':
			break;
		case 'dblclick':
			socket.emit('command', 'cd', file);
			break;
		case 'ondrag':
			break;
		case 'oncontextmenu':
			break;
		default: break;
	
	}
}

// **************************************************************** //
