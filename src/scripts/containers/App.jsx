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
        path: state.login.path,
        files: state.login.files,
        message: state.login.message,
        selected: state.file.selected,
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

    renderLogin(id) {
        // Retrieve action and state constants
        const { 
            message, 
            loginActions, 
            isAuthenticated, 
            isAttemptingLogin 
        } = this.props;

        // Construct the props to pass into the child components
        const containerProps ={
            key: id,
            className: "container"
        };

        const loginProps = {
            message,
            key: id,
            connId: id,
            isAuthenticated,
            isAttemptingLogin,
            actions: loginActions,
        };

        return <Login {...loginProps}/>;
    }

    renderFileManager(id) {
        // Retrieve action and state constants
        const { 
            path,
            files,
            selected,
            fileActions, 
            loginActions,
        } = this.props;


        const fileProps = {
            path,
            files,
            key: id,
            selected,
            connId: id,
            // username: this.state.username,
            // hostname: this.state.hostname,
            actions: Object.assign(fileActions, { 
                fetchFilesRequest: loginActions.fetchFilesRequest
            })
        };

        return <FileManager {...fileProps}/>;
    }

    render() {
        const containerProps ={
            className: "container"
        };

        if(this.props.files) {
            return (
                <div {...containerProps}> 
                    { this.state.windows.map((e, i) => this.renderFileManager(i)) }
                </div>
            );
        } else {
            return (
                <div {...containerProps}> 
                    { this.state.windows.map((e, i) => this.renderLogin(i)) }
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
