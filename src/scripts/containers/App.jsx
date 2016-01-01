import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';
import * as LoginActions from '../actions/login';
import InitialState from '../constants/InitialState.js';

function mapStateToProps(state) {
    return { 
        message: state.login.message,
        isAuthenticated: state.login.isAuthenticated,
        isAttemptingLogin: state.login.isAttemptingLogin
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(LoginActions, dispatch)
    };
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = InitialState;
    }

    handleClearClick() {
        // Use React's immutability helper to update nested state
        let nextState = update(this.state, {
            login: {
                hostname: { $set: "" },
                port:     { $set: "" },
                username: { $set: "" },
                password: { $set: "" }
            }
        });

        this.setState(nextState);
    }

    handleEnterKey() {
        // Call the login request action with the user inputs
        let credentials = {
            hostname: this.state.login.hostname,
            port    : this.state.login.port,
            username: this.state.login.username,
            password: this.state.login.password
        };

        this.props.actions.loginRequest(1, credentials);
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
        const { actions, message, isAuthenticated, isAttemptingLogin } = this.props;

        // Construct the props to pass into the child components
        var props = {
            connId: "1",
            actions: actions,
            message: message,
            login: this.state.login,
            isAuthenticated: isAuthenticated,
            isAttemptingLogin: isAttemptingLogin,
            handlers: {
                handleChange: this.handleChange.bind(this),
                handleEnterKey: this.handleEnterKey.bind(this),
                handleClearClick: this.handleClearClick.bind(this),
            }
        };

        return(
            <div id="container"> 
                <SideBar/>
                <Login {...props} />
            </div> 
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
