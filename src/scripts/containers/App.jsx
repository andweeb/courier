import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';
import * as LoginActions from '../actions/login';
import * as FileActions from '../actions/file';
import { AppInitialState } from '../constants/InitialStates';
import FileManager from '../containers/FileManager.jsx';

function mapStateToProps(state) {
    return { 
        files: state.login.files,
        message: state.login.message,
        isAuthenticated: state.login.isAuthenticated,
        isAttemptingLogin: state.login.isAttemptingLogin
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(LoginActions, dispatch),
        fileActions: bindActionCreators(FileActions, dispatch)
    };
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = AppInitialState;
    }

    handleClearClick() {
        this.setState({
            hostname: "",
            port    : "",
            username: "",
            password: ""
        });
    }

    handleEnterKey() {
        // Call the login request action with the user inputs
        let credentials = {
            hostname: this.state.hostname,
            port    : this.state.port,
            username: this.state.username,
            password: this.state.password
        };

        this.props.loginActions.loginRequest(1, credentials);
    }
	
    handleChange(input, value) {
        this.setState({ [input]: value });
    }

    render() {
        // Retrieve action and state constants
        const { loginActions, fileActions, message, isAuthenticated, isAttemptingLogin } = this.props;

        // Construct the props to pass into the child components
        let loginProps = {
            connId: "1",
            actions: loginActions,
            message: message,
            login: this.state,
            isAuthenticated: isAuthenticated,
            isAttemptingLogin: isAttemptingLogin,
            handlers: {
                handleChange: this.handleChange.bind(this),
                handleEnterKey: this.handleEnterKey.bind(this),
                handleClearClick: this.handleClearClick.bind(this),
            }
        };

        let fileProps = {
            connId: "1",
            actions: fileActions,
            username: this.state.username,
            hostname: this.state.hostname,
            files: this.props.files || [],
        };

        return(
            <div id="container"> 
                <FileManager {...fileProps}/>
                <Login {...loginProps}/>
            </div> 
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
