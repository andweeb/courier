import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';

class App extends Component {
    render() {
        return(
            <div id="container"> 
                <SideBar/>
                <Login connId="1"/>
            </div> 
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
