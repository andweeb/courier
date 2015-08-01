// **************************************************************** //
// Scripts involving the user interface	

// Switch from the login view to the local/remote host display
function hideLoginView() {
	// Hide the login inputs (set opacity to zero, then set vis to 'hidden')
	console.log("--> in hideLoginView()");
	document.getElementById('loginView').style.opacity = '0';

	// Wait for the opacity transition to finish, then display the filesystem
	$(".centered").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() { showInterface(); $(this).off(); });
}

// Switch from the local/remote host display to the view 
function showLoginView() {
	console.log("--> in showLoginView()");
}

function showInterface() {
	console.log("--> in showInterface()");

	// First set the visibility of the login view to hidden
	// document.getElementById('loginView').style.visibility = 'hidden';
	document.getElementById('loginView').style.display = 'none';

	var localWindow = document.createElement('div');
	var remoteWindow = document.createElement('div');
	var localView = document.createElement('div');
	var remoteView = document.createElement('div');
	var localToolbar = document.createElement('div');
	var remoteToolbar = document.createElement('div');

	localWindow.id = 'localWindow';
	localWindow.className = 'window';
	localToolbar.id = 'localToolbar';
	localToolbar.className = 'toolbar';
	remoteWindow.id = 'remoteWindow';
	remoteWindow.className = 'window';
	remoteToolbar.className = 'toolbar';
	remoteWindow.id = 'remoteWindow';

	localView.id = 'localView';
	localView.className = 'hostView';
	localView.style.display = 'block';
	localView.style.backgroundColor = 'white';

	remoteView.id = 'remoteView';
	remoteView.className = 'hostView';
	remoteView.style.display = 'block';
	remoteView.style.backgroundColor = 'white';
	
	localWindow.appendChild(localToolbar);
	localWindow.appendChild(localView);
	remoteWindow.appendChild(remoteToolbar);
	remoteWindow.appendChild(remoteView);
	document.getElementById('app').appendChild(localWindow);
	document.getElementById('app').appendChild(remoteWindow);
	document.getElementById('localWindow').style.opacity = 0;
	document.getElementById('localWindow').style.opacity = 1;
}

// **************************************************************** //
