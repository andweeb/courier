import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from './containers/App.jsx';
import Socket from './utils/Websocket.js';
import configureStore from './store/configureStore';
import * as ActionTypes from './constants/ActionTypes.js';
import InitialState from './constants/InitialState.js';

const store = configureStore(InitialState);
const websocket = {
    connection: null,
    uri: 'localhost:1337',
    dispatcher: message => {
        const state = store.getState();
        console.log('[IN INDEX.JS] -> \nWebsocket dispatching an action');
        console.dir(state);
        console.dir(message);
        return store.dispatch(message);
    },
    listeners: () => {
        const { login } = store.getState();
        console.log('[IN INDEX.JS] -> login state:');
        console.dir(login);
	switch (login.type) {
	    case ActionTypes.LOGIN_REQUEST:
                console.log("[IN INDEX.JS] -> \nHandling login request");
	        return websocket.connection.write(login.id, login.type, login.credentials);
	
	    case ActionTypes.FETCH_FILES_REQUEST:
	        return websocket.connection.write(login.id, login.type, login.dirpath || '/');
	
	    default:
                console.log(`[IN INDEX.JS] -> \nHandling invalid request: ${login}`);
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
            <DevTools store={store} monitor={LogMonitor} visibleOnLoad={true} />
        </DebugPanel>
    </div>,
    document.getElementById('app')
)

websocket.connection = new Socket(websocket.uri, websocket.dispatcher);
store.subscribe(() => websocket.listeners());

