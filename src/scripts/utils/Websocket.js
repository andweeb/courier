export default class connection {

    // Init socket and onmessage handler
    constructor(uri, dispatcher) {
        this.websocket = new WebSocket(`ws://${uri}/connect`);
		this.websocket.onopen = () => { this.websocket.send(`Connected to the server!`) };
		this.websocket.onclose = evt => { console.log(`Connected closed (code: ${evt.code})`) };
        this.websocket.onmessage = message => {
		    let json = JSON.parse(message.data);
		    console.log(`[IN UTILS/WEBSOCKET.JS] -> \nReceived: ${JSON.stringify(json, null, 2)}`);
            dispatcher(json);
        }
    }

    // Write a json message to the socket
    write(id, func, data) {
	    let json = {
	        "id"    :   id,
	        "fxn"   :   func,
	        "data"  :   JSON.stringify(data)
	    };
        console.log(`[IN UTILS/WEBSOCKET.JS] -> \nWriting a ${fxn} message to the socket`);
	    this.websocket.send(JSON.stringify(json));
    }
}
