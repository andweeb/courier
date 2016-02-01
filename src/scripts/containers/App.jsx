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
	let count = 0;
	let props = {};
	for(let inner in state) {
        console.log(inner);
        if(inner !== 'lastAction') {
            let innerState = state[inner];
            for(let index in innerState) {
                if(!props[count]) {
                    props[count] = {};
                }
                props[count][inner] = innerState[index];
                count++;
            }
            count = 0;
        }
	}
    Object.assign(props, state.lastAction);

    return props;
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

    renderLogin(id) {
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
            isAttemptingLogin 
        } = this.props[id].login;

        const { zIndex } = this.props[id].window;

        // Construct the props to pass into the child components
        const containerProps = {
            key: id,
            className: "container"
        };

        // Construct login component props
        const loginProps = {
            zIndex,
            message,
            key: id,
            connId: id,
            isAuthenticated,
            isAttemptingLogin,
            actions: actions,
        };

        return <Login {...loginProps}/>;
    }

    renderFileManager(id) {
        // Retrieve action constants
        const {
            fileActions, 
            windowActions,
            loginActions
        } = this.props;

        // Retrieve window-specific login state
        const {
            path,
            files
        } = this.props[id].login;

        // Retrieve window-specific file state
        const { 
            selected,
        } = this.props[id].file;

        // Construct file manager component props
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
        const containerProps = {
            className: "container"
        };

        return (
            <div {...containerProps}>
                { this.state.windows.map((e, i) => this.props[i].login.files ? 
                                         this.renderFileManager(i) : this.renderLogin(i)) }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
