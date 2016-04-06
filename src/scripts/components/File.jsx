import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/function/flow';
import Extensions from '../constants/Extensions.js';

class File extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDblClick = this.handleDblClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    // Assign a specific file image to the drag preview of the file component once mounted
    componentDidMount() {
        const { file, connectDragPreview } = this.props;
        const image = new Image(10, 10);

        image.src = file.IsDir ? "assets/images/files/dir.svg" : assignFileImage(file.Filename);
        image.onload = () => connectDragPreview(image);
    }

    handleKeyPress(event) {
        if(event.metaKey && event.keyCode === 65) {
            console.log("SELECT ALL FILES");
        }
    }

    // Handle (multiple) selection of a file component
    handleClick(event) {
        const { file, connId, actions, isSelected } = this.props;
    
        if(event.metaKey) {
            isSelected ? actions.fileDeselected(connId, file) :
                actions.fileGroupSelected(connId, file);
        } else {
            isSelected ? actions.fileDeselected(connId, file) :
                actions.fileSelected(connId, file);
        }
    }

    handleDblClick(event) {
        // Send this.props.Path to the socket
        let filename = '';
        const { path, connId, file, actions } = this.props;

        // Extract the filename from the click event
        if(event.target.nodeName === "SPAN" || event.target.nodeName === "IMG") {
            filename = event.target.parentNode.outerText;
        } else {
            filename = event.target.outerText;
        }

        // Construct the new file path and fetch files if the file is a directory
        const newpath = (path.length === 1) ? `/${filename}` : `${path}/${filename}` 
        if(file.IsDir) {
            actions.fetchFilesRequest(connId, { path: newpath });
        } else {
            console.log("Invalid double-click");
            // actions.fileDownloadRequest(connId, filename, path);
        }
    }

    render() {
        const { 
            file,
            isOver,
            connId,
            canDrop,
            isDragging,
            backgroundColor,
            connectDragSource,
            connectDropTarget
        } = this.props;

        const ImageProps = {
            className: 'file-image',
            src: file.IsDir ? "assets/images/files/dir.svg" :
                assignFileImage(file.Filename)
            // cursor: canDrop || !(isDragging && isOver) ? "copy" : "no-drop",
        };

        const FileProps = {
            className: 'file',
            onClick: this.handleClick,
            onKeyPress: this.handleKeyPress,
            onDoubleClick: this.handleDblClick,
            style: { 
                backgroundColor: isDragging ? '#eef5f7' : backgroundColor,
                color: isDragging ? '#288EDF' : '#545454',
                border: file.IsDir && isOver ? '1px solid #A8CBD6' : '1px solid transparent'
            }
        };

        return connectDragSource(connectDropTarget(
            <li {...FileProps}> 
                <img {...ImageProps}/>
                {file.Filename}
            </li>
        ));
    }
};

// Implements the drag source contract
const fileSource = {
    beginDrag(props) {
        return { 
            filename: props.file.Filename,
            filepath: props.file.Path,
            connId: props.connId,
        };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        document.getElementById(`file-list-${props.connId}`).className = 'file-list';

        if(dropResult) {
            console.log(`Dropped ${item.filename} onto ${dropResult.filename}!`);
            let srcId = props.connId.toString();
            let destId = dropResult.connId.toString();
            let srcPath = props.file.Path;
            let destPath = dropResult.filepath;
            
            if(props.file.IsDir) {
                props.actions.directoryTransferRequest(srcId, destId, srcPath, destPath);
            } else {
                props.actions.fileTransferRequest(srcId, destId, srcPath, destPath);
            }
        }
    }
};

// Implements the drag target contract 
const fileTarget = {
    drop(props) {
        return { 
            filename: props.file.Filename,
            filepath: props.file.Path,
            connId: props.connId
        };
    },

    // hover(props, monitor) {
    //     console.log(monitor.canDrop());
    //     if(props.file.IsDir) {
    //         document.getElementById(`file-list-${props.connId}`).className = 'file-list';
    //     } else {
    //         document.getElementById(`file-list-${props.connId}`).className = 'file-list hovered';
    //     }
    // },

    canDrop(props) {
        return props.file.IsDir;
    }
};

// Collecting function to inject props into the drop target 
function injectDropProps(connect, monitor) {
    return { 
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

// Collecting function to inject props into the drag source
function injectDragProps(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    };
}

// Helper function to return the svg path
function assignFileImage(filename) {
    const dot = filename.indexOf('.');
    const ext = filename.substring(dot + 1);
    if(dot === 0 || !Extensions[ext]) {
        return 'assets/images/files/idk.svg';
    } else {
        return `assets/images/files/${ext}.svg`;
    }
}

export default flow(
    DropTarget('file', fileTarget, injectDropProps),
    DragSource('file', fileSource, injectDragProps)
)(File);
