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
            let previousPath = path.substr(0, path.lastIndexOf('/'));
            path = previousPath || '/';
        }

        this.props.actions.fetchFilesRequest(1, {path});
        this.props.actions.fileDeselectedAll(1);
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

        const menuTitle = `${username}@${hostname}`;
        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };
        const boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        const FileListProps = { path, files, actions, selected };
        const FooterProps = { cwd: path, files, actions };
        const ImageProps = {
            src: "assets/images/buttons/back.svg",
            onClick: this.goBack.bind(this),
            className: "menubar-back-button"
        };
        const MenubarProps = { 
            className: "menubar",
            dangerouslySetInnerHTML: {
                __html: menuTitle
            }
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div style={boxStyle} className="file-manager">
                    <image {...ImageProps}/>
                    <strong {...MenubarProps}/>
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
