import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from './components/SideBar.jsx';
import Login from './components/Login.jsx';
import { Provider } from 'react-redux'

// TODO: Implement store for the provider!
ReactDOM.render(
    (
        <div> 
            <SideBar/>
            <Login connId="1"/>
        </div> 
    ), 
    document.getElementById('app')
);
