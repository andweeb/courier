// ******************************************************************************** //
// menu.js - Display a custom context menu upon right-click at a dynamic location 
function showMenu(menuEvent, file) {
	// Remove a previously displayed context menu if it exists
	if(document.contains(document.getElementById('menu'))) 
		document.getElementById('menu').remove();

	menuEvent.preventDefault();

	var fileRect = menuEvent.target.getBoundingClientRect();
	var x = fileRect.left - 60;
	var y = fileRect.top; 

	// Create the menu div
	var menu = document.createElement('div');
	menu.id = 'menu';
	menu.style.border = '1px solid #000';
	menu.style.borderRadius = '5px';
	menu.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    menu.style.boxShadow = '5px 5px 0px 0px rgba(0,0,0,0.2)';
	menu.style.position = 'absolute';
	menu.style.padding = '10px';
	menu.style.left = x + 'px';
	menu.style.top = y + 'px';

	// Create the menu file options 
	var open = document.createElement('li');
	open.className = 'menuItem';
	open.innerHTML = 'Open';
	open.onclick = function() { uponDblClick(file) };

	var hr1 = document.createElement('li');
	hr1.className = 'menuhr';

	var createFolderButton = document.createElement('li');
	createFolderButton.className = 'menuItem';
	createFolderButton.innerHTML = 'New Folder';
	createFolderButton.onclick = function() { createFolder(file) };

	var createFileButton = document.createElement('li');
	createFileButton.className = 'menuItem';
	createFileButton.innerHTML = 'New File';
	createFileButton.onclick = function() { createFile(file) };

	var hr2 = document.createElement('li');
	hr2.className = 'menuhr';

	var copyButton = document.createElement('li');
	copyButton.className = 'menuItem';
	copyButton.innerHTML = 'Copy';
	copyButton.onclick = function() { copyFile(file) };

	var pasteButton = document.createElement('li');
	pasteButton.className = 'menuItem';
	pasteButton.innerHTML = 'Paste';
	pasteButton.onclick = function() { pasteFile(file) };

	var renameButton = document.createElement('li');
	renameButton.className = 'menuItem';
	renameButton.innerHTML = 'Rename';
	renameButton.onclick = function() { renameFile(file) };

	var deleteFileButton = document.createElement('li');
	deleteFileButton.className = 'menuItem';
	deleteFileButton.innerHTML = 'Delete';
	deleteFileButton.onclick = function() { deleteFile(file) };

	var hr3 = document.createElement('li');
	hr3.className = 'menuhr';

	var attributesButton = document.createElement('li');
	attributesButton.className = 'menuItem';
	attributesButton.innerHTML = 'Attributes';
	attributesButton.onclick = function() { showAttributes(file) };

	// Create the list and append the options
	var list = document.createElement('ul');
	list.style.listStyleType = 'none';
	list.style.padding = '3px';
	list.style.margin = '0';
	list.appendChild(open);
	list.appendChild(hr1);
	list.appendChild(createFolderButton);
	list.appendChild(createFileButton);
	list.appendChild(hr2);
	list.appendChild(copyButton);
	list.appendChild(pasteButton);
	list.appendChild(renameButton);
	list.appendChild(deleteFileButton);
	list.appendChild(hr3);
	list.appendChild(attributesButton);
	
	menu.appendChild(list);
	document.body.appendChild(menu);
}

// Click listener applied to entire document to have menu disappear 
document.onclick = function() { 
	if(document.contains(document.getElementById('menu'))) 
		document.getElementById('menu').remove(); 
};

function menuClick(ev) {
	console.log("clicked "+ev.target.innerHTML);
}
