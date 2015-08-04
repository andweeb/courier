// **************************************************************** //
// ui.js - Scripts involving the user interface	

// Helper function to remove an element from the DOM
Element.prototype.remove = function() { this.parentElement.removeChild(this); }
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

// Initialize the overall interface after the loginv view fades
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
	localFooter.innerHTML = 'Go to: ';
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
	remoteFooter.innerHTML = 'Go to: ';
	remoteFooter.fontSize = '10px';
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// Append to the DOM
	localWindow.appendChild(localMenubar);
	localWindow.appendChild(localAttributes);
	localWindow.appendChild(localView);
	localWindow.appendChild(localFooter);

	remoteWindow.appendChild(remoteMenubar);
	remoteWindow.appendChild(remoteAttributes);
	remoteWindow.appendChild(remoteView);
	remoteWindow.appendChild(remoteFooter);

	document.getElementById('app').appendChild(localWindow);
	document.getElementById('app').appendChild(remoteWindow);

	// $(".window").mCustomScrollbar();
	
	// Clean up the pathname (append '/' at the end if necessary)
	if(view.local.cwd.lastIndexOf('/') !== view.local.cwd.length-1 &&
		view.local.cwd.length > 1) view.local.cwd += '/';
	if(view.remote.cwd.lastIndexOf('/') !== view.remote.cwd.length-1 &&
		view.remote.cwd.length > 1) view.remote.cwd += '/';

	// Show both the directory file listings
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

// **************************************************************** //
// Usage: (current working dir, files json, local or remote host view)
function showDirectory(path, files, panel) {
	console.log('--> in showDirectory()');
	console.log(JSON.stringify(files,null,2));

	// Display the current working directory in the footer
	var input = document.createElement('input');
	input.id = panel+'cwd';
	input.type = 'text';
	input.className = 'cwd';
	input.placeholder = path;

	// Insert the placeholder upon clicking the go to footer
	input.onclick = function() { this.value = this.placeholder; };

	// Contact the server to change the directory upon enter key press
	input.onkeydown = function() {
		if(event.keyCode == 13) {
			var obj = document.getElementsByClassName('grow')[0].obj;
			obj.filename = ''; 
			obj.path = this.value;
			this.value = '';
			console.log('obj path: '+obj.path);
			socket.emit('command', 'cd', obj);
		}
	}

	// Replace placeholder if the input already exists otherwise create one 
	if(document.contains(document.getElementById(panel+'cwd'))) {
		document.getElementById(panel+'cwd').placeholder = path;	
	} else document.getElementById(panel+'Footer').appendChild(input);

	// Remove the directory listing if it already exists
	if(document.contains(document.getElementById(panel+'DirListing'))) {
		document.getElementById(panel+'DirListing').remove();
	}
	
	// Create the list
	var list = document.createElement('ul');
	list.id = panel+'DirListing';
	list.className = 'bulletless';
	list.style.textAlign = 'left';

	// Display the file listing for the current directory 
	for(var i = 0; i < files.length; i++) {
		// Enclose the loop contents in a closure to avoid variable hoisting for file
		(function() {
			// Create a file list item
			var file = document.createElement('li');
			file.id = files[i].filename;
			file.className = 'grow';
			file.style.paddingLeft = '1.5rem';
			file.style.paddingBottom = '0.3rem';
			file.style.color = '#545454';
			file.draggable = 'true';
	
			// Set custom html attributes for the command interpreter
			file.obj = { 
				'path'		: path,
				'panel'		: panel,
				'attrs'		: files[i].attrs,
				'filename'	: files[i].filename,
				'longname'	: files[i].longname
			};
	
			// Assign some listeners to each list item
			file.addEventListener("dblclick", function() {
				var fileObj = file.obj;
				interpret('dblclick', fileObj);
			}, false);
	
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
		}())
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

// **************************************************************** //
