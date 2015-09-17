// Helper function to remove an element from the DOM
Element.prototype.remove = function() { this.parentElement.removeChild(this); }
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]);
    }
}

// **************************************************************** //
// menu.js - Display a custom context menu upon right-click at a dynamic location 
function showMenu(ev) {
	// Remove a previously displayed context menu if it exists
	if(document.contains(document.getElementById('menu'))) 
		document.getElementById('menu').remove();

	ev.preventDefault();

	var x = event.pageX;
	var y = event.pageY;

	// Create the menu div
	var menu = document.createElement('div');
	menu.id = 'menu';
	menu.style.border = '1px solid #000';
	menu.style.borderRadius = '5px';
	menu.style.backgroundColor = 'white';
    menu.style.boxShadow = '5px 5px 0px 0px rgba(0,0,0,0.2)';
	menu.style.position = 'absolute';
	menu.style.padding = '10px';
	menu.style.left = x + 'px';
	menu.style.top = y + 'px';

	// Create the menu file options 
	var open = document.createElement('li');
	open.className = 'menuItem';
	open.innerHTML = 'Open';
	open.onclick = function(ev) { menuClick(ev) };

	var hr1 = document.createElement('li');
	hr1.className = 'menuhr';

	var createFolder = document.createElement('li');
	createFolder.className = 'menuItem';
	createFolder.innerHTML = 'New Folder';
	createFolder.onclick = function(ev) { menuClick(ev) };

	var createFile = document.createElement('li');
	createFile.className = 'menuItem';
	createFile.innerHTML = 'New File';
	createFile.onclick = function(ev) { menuClick(ev) };

	var hr2 = document.createElement('li');
	hr2.className = 'menuhr';

	var copy = document.createElement('li');
	copy.className = 'menuItem';
	copy.innerHTML = 'Copy';
	copy.onclick = function(ev) { menuClick(ev) };

	var paste = document.createElement('li');
	paste.className = 'menuItem';
	paste.innerHTML = 'Paste';
	paste.onclick = function(ev) { menuClick(ev) };

	var rename = document.createElement('li');
	rename.className = 'menuItem';
	rename.innerHTML = 'Rename';
	rename.onclick = function(ev) { menuClick(ev) };

	var deleteFile = document.createElement('li');
	deleteFile.className = 'menuItem';
	deleteFile.innerHTML = 'Delete';
	deleteFile.onclick = function(ev) { menuClick(ev) };

	var hr3 = document.createElement('li');
	hr3.className = 'menuhr';

	var attributes = document.createElement('li');
	attributes.className = 'menuItem';
	attributes.innerHTML = 'Attributes';
	attributes.onclick = function(ev) { menuClick(ev) };

	// Create the list and append the options
	var list = document.createElement('ul');
	list.style.listStyleType = 'none';
	list.style.padding = '3px';
	list.style.margin = '0';
	list.appendChild(open);
	list.appendChild(hr1);
	list.appendChild(createFolder);
	list.appendChild(createFile);
	list.appendChild(hr2);
	list.appendChild(copy);
	list.appendChild(paste);
	list.appendChild(rename);
	list.appendChild(deleteFile);
	list.appendChild(hr3);
	list.appendChild(attributes);
	
	menu.appendChild(list);
	document.body.appendChild(menu);
}

// Click listener applied to entire document to have menu disappear 
document.onclick = function() { 
	if(document.contains(document.getElementById('menu'))) 
		document.getElementById('menu').remove(); 
};

document.body.style.width = '500px';
document.body.style.height = '500px';
document.body.style.backgroundColor = '#ddd';

// Driver 
document.body.addEventListener('contextmenu', function(ev) { showMenu(ev) }, false);

function menuClick(ev) {
	console.log("clicked "+ev.target.innerHTML);
}
