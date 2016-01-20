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
        let path = this.props.files[0].Path;

        if(path === '/') {
            console.log("Can't go back!");
            return;
        } else {
            path = path.substr(0, path.lastIndexOf('/'))
            path = path.substr(0, path.lastIndexOf('/'))
        }

        this.props.actions.fetchFilesRequest(1, path);
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

        let menuTitle = `${this.props.username}@${this.props.hostname}`;

        const boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        const ImageProps = {
            src: "assets/images/buttons/back.svg",
            onClick: this.goBack.bind(this),
            style: {
                width: '1rem',
                float: 'left',
                paddingLeft: '0.4rem'
            }
        };

        const FileListProps = {
            files: this.props.files,
            actions: this.props.actions
        };

        const FooterProps = {
            cwd: this.pwd(this.props.files),
            files: this.props.files,
            actions: this.props.actions
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div style={boxStyle} className="file-manager">
                    <strong className="menubar disable-select">
                        <image {...ImageProps} />
                        {menuTitle}
                    </strong>
                    <FileList {...FileListProps} />
                    <Footer {...FooterProps} />
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
