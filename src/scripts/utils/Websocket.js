export default class connection {

    // Init socket and onmessage handler
    constructor(uri, dispatcher) {
        this.websocket = new WebSocket(`ws://${uri}/connect`);
        this.websocket.onopen = () => { this.websocket.send(`Connected to the server!`) };
        this.websocket.onclose = evt => { console.log(`Connected closed (code: ${evt.code})`) };
        this.websocket.onmessage = message => {
            let json = JSON.parse(message.data);
            console.log('[IN UTILS/WEBSOCKET.JS] -> Received:');
            console.dir(json);
            dispatcher(json);
        }
    }

    // Write a json message to the socket
    write(id, func, data) {
        let json = {
            id: id,
            type: func,
            data: data
        };
	    console.log('[IN UTILS/WEBSOCKET.JS] -> Writing to socket:');
        console.dir(json);
	    this.websocket.send(JSON.stringify(json));
    }
}
