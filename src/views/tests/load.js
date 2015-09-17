function loadingIcon() {
	var icon = document.createElement('img');
	icon.src = '../../images/loading.svg';
	icon.className = 'loadingIcon';

	return icon;
}

var circle = loadingIcon();
document.body.appendChild(circle);
