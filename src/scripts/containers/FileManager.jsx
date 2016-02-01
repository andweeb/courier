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
        let { path, connId } = this.props;

        if(path === '/') {
            console.log("Can't go back!");
            return;
        } else {
            let previousPath = path.substr(0, path.lastIndexOf('/'));
            path = previousPath || '/';
        }

        this.props.actions.fetchFilesRequest(connId, { path });
        this.props.actions.fileDeselectedAll(connId);
    }

    render() {
        const {
            path,
            files,
            connId,
            actions,
            selected,
            username,
            hostname,
        } = this.props;

        // const menuTitle = `${username}@${hostname}`;
        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };

        // Define file manager style states
        const boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        // Construct file list container props
        const FileListProps = {
            path,
            files,
            connId,
            actions,
            selected,
        };

        // Construct footer component props
        const FooterProps = {
            files,
            connId,
            actions,
            cwd: path,
        };

        // Construct file icon image props
        const ImageProps = {
            src: "assets/images/buttons/back.svg",
            onClick: this.goBack.bind(this),
            className: "menubar-back-button"
        };
        const MenubarProps = { 
            className: "menubar",
            dangerouslySetInnerHTML: {
                __html: "( •́︿•̀ )" 
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
    connId: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    // username: PropTypes.string.isRequired,
    // hostname: PropTypes.string.isRequired,
    selected: PropTypes.object.isRequired
}

export default FileManager
