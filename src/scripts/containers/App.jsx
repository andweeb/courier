import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';
import * as FileActions from '../actions/file';
import * as LoginActions from '../actions/login';
import * as WindowActions from '../actions/window';
import { AppInitialState } from '../constants/InitialStates';
import FileManager from '../containers/FileManager.jsx';

function mapStateToProps(state) {
    // Construct the props in order to index it appropriately

    let windows = [];
    Object.keys(state.window).map(function(e, i) {
        windows.push({
            id: e,
            file: state.file[e],
            login: state.login[e],
            window: state.window[e]
        })
    })
    Object.assign(windows, { lastAction: state.lastAction });

    return { windows };
}

function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(LoginActions, dispatch),
        fileActions: bindActionCreators(FileActions, dispatch),
        windowActions: bindActionCreators(WindowActions, dispatch)
    };
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = AppInitialState;
    }

    renderLogin(window) {
        // Retrieve login actions
        const {
            loginActions,
            windowActions
        } = this.props;

        const actions = Object.assign({}, loginActions, windowActions);

        // Retrieve window-specific login state
        const {
            message, 
            isAuthenticated, 
            isLoading
        } = window.login;

        const { zIndex } = window.window;

        // Construct the props to pass into the child components
        const containerProps = {
            key: window.id,
            className: "container"
        };

        // Construct login component props
        const loginProps = {
            zIndex,
            message,
            isLoading,
            key: window.id,
            isAuthenticated,
            actions: actions,
            connId: window.id
        };

        return <Login {...loginProps}/>;
    }

    renderFileManager(window) {
        // Retrieve action constants
        const {
            fileActions, 
            windowActions,
            loginActions
        } = this.props;

        // Retrieve window-specific login state
        const {
            path,
            files,
            isLoading
        } = window.login;

        // Retrieve window-specific file state
        const { 
            selected,
        } = window.file;

        const { zIndex } = window.window;

        // Construct file manager component props
        const fileProps = {
            path,
            files,
            zIndex,
            selected,
            isLoading,
            key: window.id,
            connId: window.id,
            // username: this.state.username,
            // hostname: this.state.hostname,
            actions: Object.assign(fileActions, { 
                fetchFilesRequest: loginActions.fetchFilesRequest,
                windowFocused: windowActions.windowFocused
            })
        };

        return <FileManager {...fileProps}/>;
    }

    render() {
        const { windows } = this.props;
        const containerProps = {
            className: "container"
        };

        return (
            <div {...containerProps}>
                { windows.map(e => e.login.files ? this.renderFileManager(e) : this.renderLogin(e)) }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
