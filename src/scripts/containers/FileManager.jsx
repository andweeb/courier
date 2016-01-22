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

    goBack() {
        let path = this.props.path;

        if(path === '/') {
            console.log("Can't go back!");
            return;
        } else {
            path = path.substr(0, path.lastIndexOf('/'))
        }

        this.props.actions.fetchFilesRequest(1, {path});
    }

    render() {
        const {
            path,
            files,
            actions,
            selected,
            username,
            hostname,
        } = this.props;

        const FileListProps = { files, actions, selected };
        const menuTitle = `${username}@${hostname}`;
        const MenubarProps = { className: "menubar disable-select", };
        const FooterProps = { cwd: path, files, actions };

        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };

        const boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        const ImageProps = {
            src: "assets/images/buttons/back.svg",
            onClick: this.goBack.bind(this),
            className: "menubar-back-button"
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div style={boxStyle} className="file-manager">
                    <image {...ImageProps}/>
                    <strong dangerouslySetInnerHTML={{__html: menuTitle}} {...MenubarProps}></strong>
                    <FileList {...FileListProps}/>
                    <Footer {...FooterProps}/>
                </div>
            </Draggable>
        );
    }
};

FileManager.propTypes = {
    path: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    selected: PropTypes.object.isRequired
}

export default FileManager
