import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/function/flow';
import Extensions from '../constants/Extensions.js';


class File extends Component {
    constructor(props) {
        super(props);
    }

    // Assign a specific file image to the drag preview of the file component once mounted
    componentDidMount() {
        const { file, connectDragPreview } = this.props;
        const image = new Image(10, 10);

        image.src = file.IsDir ? 
            "assets/images/files/dir.svg" : assignFileImage(file.Filename);
        image.onload = () => connectDragPreview(image);
    }

    // TODO: Change login.files state
    // Check if the filename is valid (it exists in file listing and is a directory)
    isValidDir(filename, files) {
        for(let i = 0, l = files.length; i < l; i++) {
            if(filename === files[i].Filename)
                return files[i].IsDir;
        }
        return false;
    }

    // TODO: Deselect action not working?
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
        const { files, actions } = this.props;
        const filename = event.target.parentElement.outerText;
        
        if(this.isValidDir(filename, files)) {
            actions.fetchFilesRequest(1, { path: file.Path });
        } else {
            console.log("Invalid double-click");
        }
    }

    render() {
        const { 
            bgc,
            file,
            isOver,
            canDrop,
            isDragging,
            connectDragSource,
            connectDropTarget
        } = this.props;

        const handle = {
            click : this.handleClick.bind(this),
            dblclick : this.handleDblClick.bind(this)
        };

        // cursor: canDrop || !(isDragging && isOver) ? "copy" : "no-drop",
        // backgroundColor: canDrop && isOver && !isDragging || this.state.isSelected ? 'rgb(207, 241, 252)' : 'transparent',
        
        let style = { 
            color: isDragging ? '#288EDF' : '#545454',
            backgroundColor: bgc
        };

        const imgsrc = file.IsDir ? "assets/images/files/dir.svg" :
                assignFileImage(file.Filename);

        return connectDragSource(connectDropTarget(
            <li className="file" style={style} onClick={handle.click} onDoubleClick={handle.dblclick}> 
                <img className="file-image" src={imgsrc}/>
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
