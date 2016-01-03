import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/App.jsx';
import Socket from './utils/Websocket.js';
import configureStore from './store/configureStore';
import * as ActionTypes from './constants/ActionTypes.js';
import { StoreInitialState } from './constants/InitialStates.js';
import DevTools from './containers/DevTools.jsx';

const store = configureStore(StoreInitialState);
const websocket = {
    connection: null,
    uri: 'localhost:1337',
    dispatcher: message => {
        console.log("[IN INDEX.JS] -> \nDispatching server message");
        console.dir(message);
        return store.dispatch(message);
    },
    listeners: () => {
        const { login, lastAction } = store.getState();
	switch (lastAction.type) {
	    case ActionTypes.LOGIN_REQUEST:
                console.log("[IN INDEX.JS] -> \nHandling login request");
	        return websocket.connection.write(lastAction.id, lastAction.type, lastAction.credentials);
	
	    case ActionTypes.FETCH_FILES_REQUEST:
                console.log("[IN INDEX.JS] -> \nHandling fetch files request");
	        return websocket.connection.write(lastAction.id, lastAction.type, lastAction.dirpath || '/');
	
	    default:
                console.log(`[IN INDEX.JS] -> \nHandling invalid request:`);
                console.dir(lastAction);
	        return;
        }
    }
}

render(
    <div>
        <Provider store={store}>
            <App/>
        </Provider>
    </div>,
    document.getElementById('app')
);

websocket.connection = new Socket(websocket.uri, websocket.dispatcher);
store.subscribe(() => websocket.listeners());

