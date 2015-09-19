// ******************************************************************************* //
// Progress bar function
function progressBar() {
	var svgns = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgns, 'svg');
	svg.setAttributeNS(null, 'width', '150px');
	svg.setAttributeNS(null, 'height', '50px');
	svg.setAttributeNS(null, 'style', 'margin-top: 15px;');

	var progress = document.createElementNS(svgns, 'rect');
	progress.setAttributeNS(null, 'id', 'progress');
	progress.setAttributeNS(null, 'width', '0px');
	progress.setAttributeNS(null, 'height', '3px');
	progress.setAttributeNS(null, 'rx', '2');
	progress.setAttributeNS(null, 'ry', '2');
	progress.setAttributeNS(null, 'fill', '#5fcf80');
	progress.setAttributeNS(null, 'class', 'progressBar');

	var bar = document.createElementNS(svgns, 'rect');
	bar.setAttributeNS(null, 'id', 'bar');
	bar.setAttributeNS(null, 'width', '150px');
	bar.setAttributeNS(null, 'height', '3px');
	bar.setAttributeNS(null, 'rx', '2');
	bar.setAttributeNS(null, 'ry', '2');
	bar.setAttributeNS(null, 'fill', '#aaa');

	var percent = document.createElementNS(svgns, 'text');
	percent.setAttributeNS(null, 'x', '70');
	percent.setAttributeNS(null, 'y', '20');

	var tspan = document.createElementNS(svgns, 'tspan');
	tspan.setAttributeNS(null, 'id', 'percent');
	tspan.setAttributeNS(null, 'fill', '#444');
	tspan.textContent = '0%';
	tspan.style.font = '11px Helvetica, Arial, sans-serif';

	svg.appendChild(bar);
	svg.appendChild(progress);
	percent.appendChild(tspan);
	svg.appendChild(percent);

	return svg;
}

// ******************************************************************************* //
// Message Box
//
// parameters:
//	'type': 'file-transfer' / 'confirm-prompt' / 'input-prompt' / 'info-box',
//	'title': 'some title',
//	'text': 'some text'
//	'file': DOM file element (listener may depend on this)
//	'listener': function() { that does something on button press }
function messageBox(parameters) {
	// Remove previously generated message box if it exists	
	if(parameters.type === 'error') 
		document.getElementById('message').remove();

	var message = document.createElement('div');
	message.id = 'message';
	message.className = 'messageBox';

	var menubar = document.createElement('div'); 
	menubar.id = 'menubar';
	menubar.className = 'menubar';

	// Append exit button
	var exit = document.createElement('img');
	exit.className = 'exitButton';
	exit.src = '../../images/buttons/close.svg';
	exit.style.textAlign = 'left';
	exit.style.width = '9px';
	exit.style.cssFloat = 'left';
	exit.style.margin = '0';
	exit.onclick = function() {
		// Remove menubar
		document.getElementById('message').remove();
	};
	menubar.appendChild(exit);

	var titleText = document.createElement('p');
	titleText.innerHTML = parameters.title;
	titleText.style.margin = '0';
	titleText.style.textAlign = 'center';
	titleText.style.font = '11px "Source Sans", helvetica, arial, sans-serif';
	menubar.appendChild(titleText);

	message.appendChild(menubar);

	if(parameters.type.search('prompt') > 0) {
		// Append a confirm and exit button
		var confirmButt = document.createElement('button');
		confirmButt.onclick = listener;
	}
	
	if(parameters.type === 'file-transfer') 
		message.appendChild(progressBar());
	else if(parameters.type === 'input-prompt') {
		// Append an input section
		var inputbar = document.createElement('input');
		inputbar.className = 'topcoat-text-input';
		inputbar.placeholder = ':^)';
		message.append(inputbar);
	}
	else if(parameters.type === 'error') {

	}


	document.body.appendChild(message);
}

