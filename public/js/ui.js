// **************************************************************** //
// ui.js - Scripts involving the user interface	

// Switch from the login view to the local/remote host display
function showAppView(path, files) {
	// Hide the login inputs (set opacity to zero, then set vis to 'hidden')
	console.log("--> in hideLoginView()");
	document.getElementById('loginView').style.opacity = '0';

	// Wait for the opacity transition to finish, then display the filesystem
	$(".centered").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
		function() { showInterface(path, files); $(this).off(); });
}

// Switch from the local/remote host display to the view 
function showLoginView() {
	console.log("--> in showLoginView()");
}

function showInterface(path, files) {
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

	showDirectory(path, files);
}

// **************************************************************** //

function showDirectory(path, files) {
	console.log('--> in showDirectory()');
	
	var list = document.createElement('ul');
	list.className = 'bulletless';
	list.style.textAlign = 'left';

	// Display the file listing for the current directory 
	for(var i = 0; i < files.length; i++) {
		var file = document.createElement('li');
		file.style.paddingLeft = '1.5rem';
		file.style.paddingBottom = '0.3rem';
		file.style.color = '#545454';

		// Assign a function to each list item
		file.addEventListener("dblclick", test);

		if(files[i].filename.indexOf('.') > 1) {
			var extension = files[i].filename.substr(files[i].filename.indexOf('.')+1)
			if(files[i].attrs.isDirectory)
				file.style.background = "url('../images/files/dir.svg') no-repeat left top";
			else file.style.background = "url('../images/files/"+extension+".svg') no-repeat left top";
		} else { 
			if(files[i].attrs.isDirectory)
				file.style.background = "url('../images/files/dir.svg') no-repeat left top";
			else file.style.background = "url('../images/files/idk.svg') no-repeat left top";
		}

		file.style.backgroundSize = '1rem';
		file.innerHTML = files[i].filename;
		list.appendChild(file);
	}

	document.getElementById('remoteView').appendChild(list);
	console.log("Should be done by now... ");
}	

function test(path) {
	console.log("path: "+path);
}
