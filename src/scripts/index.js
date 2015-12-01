import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App.jsx'
import configureStore from './stores/configureStore'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const store = configureStore();

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
