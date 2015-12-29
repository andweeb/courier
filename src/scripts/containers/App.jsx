import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
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
        this.state = InitialState;
    }

    handleEnterKey() {
        console.log('--> in handleEnterKey()');
        // Call the login request action with the user inputs
        let credentials = {
            hostname: this.state.login.hostname,
            port    : this.state.login.port,
            username: this.state.login.username,
            password: this.state.login.password
        };

        console.log('credentials: ');
        console.log(credentials);

        this.props.actions.loginRequest(this.state.lastAction.connId, credentials);
    }
	

    handleChange(input, value) {
        // Use React's immutability helper to update nested state
        let nextState = update(this.state, {
            login: {
                [input]: {
                    $set: value
                }
            }
        });

        this.setState(nextState);
    }

    render() {
        // Retrieve action and state constants
        const { actions } = this.props;
        const { login, lastAction } = this.state;

        // Construct the props to pass into the child components
        var props = {
            connId: "1",
            login: login,
            lastAction: lastAction,
            actions: actions,
            handlers: {
                handleChange: this.handleChange.bind(this),
                handleEnterKey: this.handleEnterKey.bind(this),
            }
        };

        return(
            <div id="container"> 
                <SideBar/>
                <Login {...props}/>
            </div> 
        );
    }
}

// <Login connId="1" login={login} lastAction={lastAction} actions={actions}/>
export default connect(mapStateToProps, mapDispatchToProps)(App)
