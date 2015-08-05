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
			var extIndex = files[i].filename.indexOf('.')+1;
			var extension = files[i].filename.substr(extIndex);
			file.id = files[i].filename;
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
				'attrs'		: files[i].attrs,
				'filename'	: files[i].filename,
				'longname'	: files[i].longname,
				'extension'	: extension
			};
	
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

				// Execute sftp GET command if remote file is dragged to local dir
				
				console.log("Dragged and dropped ("+draggedId+") onto ("+droppedId+")");
			};


//			file.addEventListener('oncontextmenu', function() {
//				console.log('Right-clicked!');
//			});

			// Depending on whether the file is a directory or a regular file
			if(files[i].attrs.isDirectory) {
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
				else if(files[i].filename.indexOf('.') > 1) 
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
			file.innerHTML = files[i].filename;
			list.appendChild(file);
		}())
	}

	document.getElementById(panel+'View').appendChild(list);

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
