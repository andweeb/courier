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

    // Check if the filename is valid (it exists in file listing and is a directory)
    isValidDir(filename, files) {
        for(let i = 0, l = files.length; i < l; i++) {
            if(filename === files[i].Filename)
                return files[i].IsDir;
        }
        return false;
    }

    handleKeyPress(event) {
        if(event.metaKey && event.keyCode === 65) {
            console.log("SELECT ALL FILES");
        }
    }

    // Handle (multiple) selection of a file component
    handleClick(event) {
        const { file, actions, isSelected } = this.props;
    
        if(event.metaKey) {
            isSelected ? actions.fileDeselected(1, file) :
                actions.fileGroupSelected(1, file);
        } else {
            isSelected ? actions.fileDeselected(1, file) :
                actions.fileSelected(1, file);
        }
    }

    handleDblClick(event) {
        // Send this.props.Path to the socket
        const { path, files, actions } = this.props;
        const filename = event.target.parentElement.outerText;
        const newpath = (path.length === 1) ? `/${filename}` : `${path}/${filename}` 

        if(this.isValidDir(filename, files)) {
            actions.fetchFilesRequest(1, { path: newpath });
        } else {
            console.log("Invalid double-click");
        }
    }

    render() {
        const { 
            file,
            isOver,
            canDrop,
            isDragging,
            backgroundColor,
            connectDragSource,
            connectDropTarget
        } = this.props;

        const FileProps = {
            className: 'file',
            onKeyPress: this.handleKeyPress,
            onClick: this.handleClick.bind(this),
            onDoubleClick: this.handleDblClick.bind(this),
            style: { 
                backgroundColor,
                color: isDragging ? '#288EDF' : '#545454'
            }
        };

        const ImageProps = {
            className: 'file-image',
            src: file.IsDir ? "assets/images/files/dir.svg" : 
                assignFileImage(file.Filename)
            // cursor: canDrop || !(isDragging && isOver) ? "copy" : "no-drop",
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
        return { filename: props.file.Filename };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if(dropResult) {
            console.log(`Dropped ${item.filename} onto ${dropResult.filename}!`);
            console.dir(dropResult);
        }
    }
};

// Implements the drag target contract 
const fileTarget = {
    drop(props) {
        return { filename: props.file.Filename };
    },

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
