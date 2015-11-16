import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';

// TODO: Implement store for the provider!
ReactDOM.render(
    (
        <div id="container"> 
            <SideBar/>
            <Login connId="1"/>
        </div> 
    ), 
    document.getElementById('app')
);
