import React, { Component, PropTypes } from 'react';
import Draggable from 'react-draggable';

import FileList from './FileList.jsx';
import Footer from '../components/Footer.jsx';
import LoadingModal from '../components/LoadingModal.jsx';

import { FileManagerInitialState } from '../constants/InitialStates.js';

class FileManager extends Component {
    constructor(props) {
        super(props);
        this.state = FileManagerInitialState;
        this.goBack = this.goBack.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
    }
	
    onStart() {
        this.setState({
            shadow: "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
            opacity: 0.9
        });

        this.props.actions.windowFocused(this.props.connId);
    }

    onStop() {
        this.setState({
            shadow: FileManagerInitialState.shadow,
            opacity: FileManagerInitialState.opacity
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
            zIndex,
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
            zIndex: zIndex,
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        const LoadingModalProps = {
            styles: {
                modal: {
                    width: '500px',
                    height: '70vh',
                    visibility: this.props.isLoading ? "visible" : "hidden",
                    opacity: this.props.isLoading ? "1" : "0"
                },
                cube: {
                    right: '10px',
                    bottom: '30px',
                    width: '20px',
                    height: '20px'
                }
            }
        };

        // Construct file list container props
        const FileListProps = {
            path,
            files,
            connId,
            actions,
            selected
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
            onClick: this.goBack,
            className: "menubar-back-button",
            src: "assets/images/buttons/back.svg",
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
                    <LoadingModal {...LoadingModalProps}/>
                    <img {...ImageProps}/>
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
    zIndex: PropTypes.number.isRequired,
    selected: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    connId: PropTypes.string.isRequired,
    // username: PropTypes.string.isRequired,
    // hostname: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
}

export default FileManager
