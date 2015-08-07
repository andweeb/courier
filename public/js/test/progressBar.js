Element.prototype.remove = function() { this.parentElement.removeChild(this); }
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]);
    }
}

function progressBar() {
	var svgns = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgns, 'svg');
	svg.setAttributeNS(null, 'width', '150px');
	svg.setAttributeNS(null, 'height', '50px');
	svg.setAttributeNS(null, 'style', 'margin-top: 50px; margin-left: 25px;');

	var rect = document.createElementNS(svgns, 'rect');
	var progress = document.createElementNS(svgns, 'rect');
	
	rect.setAttributeNS(null, 'id', 'progress');
	rect.setAttributeNS(null, 'width', '0px');
	rect.setAttributeNS(null, 'height', '3px');
	rect.setAttributeNS(null, 'rx', '2');
	rect.setAttributeNS(null, 'ry', '2');
	rect.setAttributeNS(null, 'fill', '#5fcf80');
	rect.setAttributeNS(null, 'class', 'progressBar');

	var bar = document.createElementNS(svgns, 'rect');
	bar.setAttributeNS(null, 'id', 'bar');
	bar.setAttributeNS(null, 'width', '150px');
	bar.setAttributeNS(null, 'height', '3px');
	bar.setAttributeNS(null, 'rx', '2');
	bar.setAttributeNS(null, 'ry', '2');
	bar.setAttributeNS(null, 'fill', '#aaa');

	var percent = document.createElementNS(svgns, 'text');
	percent.setAttributeNS(null, 'x', '75');
	percent.setAttributeNS(null, 'y', '20');

	var tspan = document.createElementNS(svgns, 'tspan');
	tspan.setAttributeNS(null, 'id', 'percent');
	tspan.setAttributeNS(null, 'fill', '#444');
	tspan.innerHTML = '0%';
	tspan.style.font = '13px Helvetica, Arial, sans-serif';

	svg.appendChild(bar);
	svg.appendChild(rect);
	percent.appendChild(tspan);
	svg.appendChild(percent);

	return svg;
}

function assignIcon(type) {
	var icons = document.createElement('div');

	switch(type) {
		case 'confirm':
			
			break;
		case 'file2dir':
				
			break;
		case 'dir2file':

			break;

		case 'dir2dir':

			break;
		case 'error':

			break;

	}

	return icons;
}

function messageBox(type, title, text) {
	var message = document.createElement('div');
	message.id = 'message';
	message.className = 'messageBox';

	var messageMenu = document.createElement('div'); 
	messageMenu.id = 'messageMenu';
	messageMenu.className = 'menubar';

	// Append exit button
	var exit = document.createElement('img');
	exit.className = 'exitButton';
	exit.src = './iconmonstr-x-mark-icon.svg';
	exit.style.textAlign = 'left';
	exit.style.width = '9px';
	exit.onclick = function() {
		console.log("clicked the x");
		// Remove messageMenu
		document.getElementById('message').remove();
	};

	// Message box menu bar
	messageMenu.appendChild(exit);
	message.appendChild(messageMenu);

	// Assign the appropriate icon
	message.appendChild(assignIcon(type));
	
	message.appendChild(progressBar());
	document.body.appendChild(message);
}

messageBox();
