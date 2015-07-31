// **************************************************************** //
// Client side

var socket = io.connect('http://0.0.0.0:1337', {
    autoConnect: true
});

// Add a connect listener
socket.on('connect', function() {
    console.log('Client has connected to the server!');
});

// Add a listener to receive data
socket.on('message', function(data) {
    console.log('Received data from the server!', data);
}









// **************************************************************** //
