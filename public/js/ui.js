// **************************************************************** //
// ui.js - Scripts involving the user interface	

// Helper function to remove an element from the DOM
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]);
    }
}

// Switch from the login view to the local/remote host display
function showAppView(view) {
	// Hide the login inputs (set opacity to zero, then set vis to 'hidden')
	console.log("--> in hideLoginView()");
	document.getElementById('loginView').style.opacity = '0';

	// Wait for the opacity transition to finish, then display the filesystem
	$(".centered").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
		function() {
			initInterface(view); 
			$(this).off(); 
		});
}

// Switch from the local/remote host display to the view 
function showLoginView() {
	console.log("--> in showLoginView()");
}

function initInterface(view) {
	console.log("--> in showInterface()");

	// First set the display of the login view to hidden
	document.getElementById('loginView').style.display = 'none';

	var localWindow = document.createElement('div');
	var localView = document.createElement('div');
	var localMenubar = document.createElement('div');
	var localAttributes = document.createElement('div');
	var localFooter = document.createElement('div');

	var remoteWindow = document.createElement('div');
	var remoteView = document.createElement('div');
	var remoteMenubar = document.createElement('div');
	var remoteAttributes = document.createElement('div');
	var remoteFooter = document.createElement('div');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Local window attributes
	localWindow.id = 'localWindow';
	localWindow.className = 'window';
	localMenubar.id = 'localMenubar';
	localMenubar.className = 'menubar';
	localMenubar.innerHTML = 'Local Host'; 
	localMenubar.fontSize = '10px';

	// Remote window attributes
	remoteWindow.id = 'remoteWindow';
	remoteWindow.className = 'window';
	remoteMenubar.id = 'remoteMenubar';
	remoteMenubar.className = 'menubar';
	remoteMenubar.innerHTML = 'Remote Host'; 
	remoteMenubar.fontSize = '10px';

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Local view attributes
	localView.id = 'localView';
	localView.className = 'hostView';
	localView.style.display = 'block';
	localView.style.backgroundColor = 'white';
	localView.style.overflow = 'scroll';

	localAttributes.id = 'localAttributes';
	localAttributes.className = 'attributes';
	localAttributes.innerHTML = ' Name';
	localAttributes.fontSize = '10px';

	localFooter.id = 'localFooter';
	localFooter.className = 'viewFooter';
	localFooter.innerHTML = 'Path: ';
	localFooter.fontSize = '10px'

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Remote view attributes
	remoteView.id = 'remoteView';
	remoteView.className = 'hostView';
	remoteView.style.display = 'block';
	remoteView.style.backgroundColor = 'white';
	remoteView.style.overflow = 'scroll';

	remoteAttributes.id = 'remoteAttributes';
	remoteAttributes.className = 'attributes';
	remoteAttributes.innerHTML = ' Name';
	remoteAttributes.fontSize = '10px';
	
	remoteFooter.id = 'remoteFooter';
	remoteFooter.className = 'viewFooter';
	remoteFooter.innerHTML = 'Path: ';
	remoteFooter.fontSize = '10px';
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Append to the DOM
	localWindow.appendChild(localMenubar);
	localWindow.appendChild(localAttributes);
	localWindow.appendChild(localView);
	remoteWindow.appendChild(remoteMenubar);
	remoteWindow.appendChild(remoteAttributes);
	remoteWindow.appendChild(remoteView);
	document.getElementById('app').appendChild(localWindow);
	document.getElementById('app').appendChild(remoteWindow);

	// $(".window").mCustomScrollbar();

	showDirectory(view.local.cwd, view.local.files, 'local');
	showDirectory(view.remote.cwd, view.remote.files, 'remote');
}

// **************************************************************** //
// Custom interface listener functions
function dragImageListener(e, url) {
	var img = document.createElement('img');
	img.src = url;
	img.width = '15px'; 
	e.dataTransfer.setDragImage(img, 20, 20);	
}

function startDragging(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 

function dragOver(event) { 
    event.preventDefault(); 
    return false; 
} 

function drop(event) { 
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var message = document.getElementById('message');
    message.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    message.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
} 

// **************************************************************** //
// Usage: (current working dir, files json, local or remote host view)
function showDirectory(path, files, panel) {
	console.log('--> in showDirectory()');

	// Remove the directory listing if it already exists
	if(document.contains(document.getElementById(panel+'DirListing'))) {
		document.getElementById(panel+'DirListing').remove();
	}
	
	var list = document.createElement('ul');
	list.id = panel+'DirListing';
	list.className = 'bulletless';
	list.style.textAlign = 'left';

	// Display the file listing for the current directory 
	for(var i = 0; i < files.length; i++) {
		var file = document.createElement('li');
		file.className = 'grow';
		file.style.paddingLeft = '1.5rem';
		file.style.paddingBottom = '0.3rem';
		file.style.color = '#545454';
		file.draggable = 'true';

		// Set custom html attributes 
		file.filename = files[i].filename;
		file.cwd = path;

		// Assign some listeners to each list item
		file.addEventListener("dblclick", messageBox);

		// Depending on whether the file is a directory or a regular file
		if(files[i].attrs.isDirectory) {
			file.style.background = "url('../images/files/dir.svg') "
								  + "no-repeat left top";

			// Add a listener to change the drag ghost image to a directory icon
			file.addEventListener("dragstart", function(e) { 
				dragImageListener(e, '../images/files/dir.svg');
			}, false);

		} else {
			var extIndex = files[i].filename.indexOf('.')+1;
			var extension = files[i].filename.substr(extIndex);
			if(!extensionImageExists()) 
			 	 file.style.background = "url('../images/files/idk.svg')"
									   + "no-repeat left top";
			else if(files[i].filename.indexOf('.') > 1) 
				 file.style.background = "url('../images/files/"
									   + extension+".svg') no-repeat left top";
			else file.style.background = "url('../images/files/idk.svg')"
									   + "no-repeat left top";
			
			// Add a listener to change the drag ghost image to a file icon
			file.addEventListener("dragstart", function(e) {
				 dragImageListener(e, '../images/files/idk.svg');
			}, false);
		}

		file.style.backgroundSize = '1rem';
		file.innerHTML = files[i].filename;
		list.appendChild(file);
	}

	document.getElementById(panel+'View').appendChild(list);
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
