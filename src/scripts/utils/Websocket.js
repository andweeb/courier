export default class connection {

    // Init socket and onmessage handler
    constructor(uri, dispatcher) {
        this.websocket = new WebSocket(`ws://${uri}/connect`);
		this.websocket.onopen = () => { this.websocket.send(`Connected to the server!`) };
		this.websocket.onclose = evt => { console.log(`Connected closed (code: ${evt.code})`) };
        this.websocket.onmessage = message => {
		    let json = JSON.parse(message.data);
		    console.log(`Received: ${JSON.stringify(json, null, 2)}`);
            dispatcher(json);
        }
    }

    // Write to the socket
    write(id, func, data) {
	    let json = {
	        "id"    :   id,
	        "fxn"   :   func,
	        "data"  :   JSON.stringify(data)
	    };
        console.log(`Writing ${JSON.stringify(json)} to the socket`);
	    this.websocket.send(JSON.stringify(json));
    }
}
