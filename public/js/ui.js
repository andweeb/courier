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
	document.getElementById('loginView').style.visibility = 'hidden';

	var localView = document.createElement('div');
	var remoteView = document.createElement('div');

	localView.id = 'localView';
	localView.style.display = 'inline-block';
	localView.style.backgroundColor = 'white';

	remoteView.id = 'remoteView';
	remoteView.style.display = 'inline-block';
	remoteView.style.backgroundColor = 'white';
	
	document.getElementById('app').appendChild(localView);
	document.getElementById('app').appendChild(remoteView);
}

// **************************************************************** //
