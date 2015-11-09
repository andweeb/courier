// ******************************************************************************** //
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
	$(".login").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
		function() {
			initInterface(view); 
			$(this).off(); 
		}
	);
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

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Local window attributes
	localWindow.id = 'localWindow';
	localWindow.className = 'window';
	localMenubar.id = 'localMenubar';
	localMenubar.className = 'menubar';
	localMenubar.innerHTML = 'Local Host'; 
	localMenubar.fontSize = '10px';
	
	// Create back button
	var lBackButton = document.createElement('img');
	lBackButton.src = '../../images/buttons/back.svg';
	lBackButton.id = 'lBackButton';
	lBackButton.className = 'backButton';
	lBackButton.panel = 'local';
	lBackButton.onclick = function() { goBack(this); };
	localMenubar.appendChild(lBackButton);

	// Remote window attributes
	remoteWindow.id = 'remoteWindow';
	remoteWindow.className = 'window';
	remoteMenubar.id = 'remoteMenubar';
	remoteMenubar.className = 'menubar';
	remoteMenubar.innerHTML = 'Remote Host'; 
	remoteMenubar.fontSize = '10px';

	// Create back button
	var rBackButton = document.createElement('img');
	rBackButton.src = '../../images/buttons/back.svg';
	rBackButton.id = 'rBackButton';
	rBackButton.className = 'backButton';
	rBackButton.panel = 'remote';
	rBackButton.onclick = function() { goBack(this); };
	remoteMenubar.appendChild(rBackButton);

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Local view and footer attributes
	localView.id = 'localView';
	localView.className = 'hostView';
	localView.style.display = 'block';
	localView.style.backgroundColor = 'white';
	localView.style.overflow = 'scroll';

//	localAttributes.id = 'localAttributes';
//	localAttributes.className = 'attributes';
//	localAttributes.innerHTML = ' Name';
//	localAttributes.fontSize = '10px';

	localFooter.id = 'localFooter';
	localFooter.className = 'viewFooter';
	localFooter.innerHTML = 'Go to: ';
	localFooter.fontSize = '10px'

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Remote view and footer attributes
	remoteView.id = 'remoteView';
	remoteView.className = 'hostView';
	remoteView.style.display = 'block';
	remoteView.style.backgroundColor = 'white';
	remoteView.style.overflow = 'scroll';

//	remoteAttributes.id = 'remoteAttributes';
//	remoteAttributes.className = 'attributes';
//	remoteAttributes.innerHTML = ' Name';
//	remoteAttributes.fontSize = '10px';
	
	remoteFooter.id = 'remoteFooter';
	remoteFooter.className = 'viewFooter';
	remoteFooter.innerHTML = 'Go to: ';
	remoteFooter.fontSize = '10px';
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Append to the DOM
	localWindow.appendChild(localMenubar);
//	localWindow.appendChild(localAttributes);
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

// Onclick function to go back up a directory
function goBack(button) {
	// Show the loading icon and send the message to cd
	var icon = document.createElement('img');
	icon.src = '../../images/loading.svg';
	icon.id = button.panel+'LoadIcon';
	icon.className = 'loadingIcon';
	document.getElementById(button.panel+'View').appendChild(icon);

	// Get the path and remove the last directory
	var newPath = document.getElementById(button.panel+'cwd').placeholder;
	if(newPath.lastIndexOf('/') === 0) return;
	newPath = newPath.substr(0, newPath.lastIndexOf('/'));
	newPath = newPath.substr(0, newPath.lastIndexOf('/'));
	newPath += '/';
	
	var newDir = {
		'path'		: newPath,
		'panel'		: button.panel,
		'filename'	: ''
	};
	socket.emit('command', 'cd', newDir);
}
