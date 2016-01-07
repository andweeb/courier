import React, { Component, PropTypes } from 'react';
import Draggable from 'react-draggable';

import FileList from './FileList.jsx';
import Footer from '../components/Footer.jsx';

import { LoginInitialState } from '../constants/InitialStates.js';

class FileManager extends Component {
    constructor(props) {
        super(props);
        this.state = LoginInitialState;
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
    }
	
    onStart() {
        this.setState({
            shadow: "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
            opacity: 0.9
        });
    }

    onStop() {
        this.setState({
            shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)",
            opacity: 1
        });
    }

    pwd(files) {
        if(files.length) {
            const path = files[0].Path;
            return path.substr(0, path.lastIndexOf('/'));
        } else {
            return "";
        }
    }

    render() {
        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };

        let boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        let menuTitle = `${this.props.username}@${this.props.hostname}`;

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div style={boxStyle} className="login">
                    <strong className="menubar disable-select"> {menuTitle} </strong>
                    <FileList files={this.props.files} actions={this.props.actions}/>
                    <Footer cwd={this.pwd(this.props.files)}/>
                </div>
            </Draggable>
        );
    }
};

FileManager.propTypes = {
    files: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
}

export default FileManager
