import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';
import * as LoginActions from '../actions/login';
import InitialState from '../constants/InitialState.js';

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(LoginActions, dispatch)
    };
}

class App extends Component {
    constructor() {
        super();
        this.state = InitialState.login;
    }

    onHandleChange(input, value) {
        console.log('input; ');
        console.log(input);
        console.log('value; ');
        console.log(value);
        var nextState = {};
        nextState[input] = value;
        this.setState(nextState);
    }

    render() {
        const { login, lastAction, actions } = this.props;
        var data = {
            connId: "1",
            login: login,
            lastAction: lastAction,
            actions: actions,
            handlers: {
                onHandleChange: this.onHandleChange.bind(this),
            }
        };
        return(
            <div id="container"> 
                <SideBar/>
                <Login {...data}/>
            </div> 
        );
    }
}

// <Login connId="1" login={login} lastAction={lastAction} actions={actions}/>
export default connect(mapStateToProps, mapDispatchToProps)(App)
