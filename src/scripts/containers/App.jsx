import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';
import * as LoginActions from '../actions/login';

class App extends Component {
    render() {
        const { login, actions } = this.props;
        return(
            <div id="container"> 
                <SideBar/>
                <Login connId="1"/>
            </div> 
        );
    }
}

export default App
