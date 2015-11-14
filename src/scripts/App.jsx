import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login.jsx';
import { Provider } from 'react-redux'

// TODO: Implement store for the provider!
ReactDOM.render(
    (
        <Provider> 
            <Login connId="1"/>
        </Provider> 
    ), 
    document.getElementById('app')
);
