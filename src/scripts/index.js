import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from './containers/App.jsx';
import Socket from './utils/Websocket.js';
import configureStore from './stores/configureStore';
import * as ActionTypes from './constants/ActionTypes.js';
import { handleEvent } from './actions/login.js';

const store = configureStore();
const websocket = {
    connection: null,
    uri: 'localhost:1337',
    dispatcher: message => {
        const state = store.getState();
        console.log('[IN INDEX.JS] -> \nWebsocket dispatching an action');
        console.dir(state);
        console.dir(message);
        return store.dispatch(handleEvent(message));
    },
    listeners: () => {
        const { previous } = store.getState();
        console.log(`previous state: ${previous}`);
	    switch (previous.type) {
	      case ActionTypes.LOGIN_REQUEST:
            console.log("[IN INDEX.JS] -> \nHandling login request");
	        return websocket.connection.write(previous.id, previous.type, previous.credentials);
	
	      case ActionTypes.FETCH_FILES_REQUEST:
	        return websocket.connection.write(previous.id, previous.type, previous.dirpath || '/');
	
	      default:
	        return;
        }
    }
}

render(
    <div>
	    <Provider store={store}>
	        <App/>
	    </Provider>
	    <DebugPanel top right bottom>
	        <DevTools store={store}
	                monitor={LogMonitor}
	                visibleOnLoad={true} />
	    </DebugPanel>
    </div>,
    document.getElementById('app')
)

websocket.connection = new Socket(websocket.uri, websocket.dispatcher);
store.subscribe(() => websocket.listeners());

