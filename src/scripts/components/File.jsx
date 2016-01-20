import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/function/flow';
import Extensions from '../constants/Extensions.js';

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

class File extends Component {
    constructor(props) {
        super(props);
        this.state = { isSelected: false };
    }

    componentDidMount() {
        // Assign a specific file image to the drag preview of the file
        const image = new Image(10, 10);
        image.src = this.props.file.IsDir ? 
            "assets/images/files/dir.svg" : assignFileImage(this.props.file.Filename);
        image.onload = () => this.props.connectDragPreview(image);
    }

    isValidDir(filename, files) {
        for(let i = 0, l = files.length; i < l; i++) {
            if(filename === files[i].Filename)
                return files[i].IsDir;
        }
        return false;
    }

    handleClick() {
        this.setState({ isSelected: !this.state.isSelected });
        this.state.isSelected ? this.props.actions.fileDeselected(1, this.props.file) :
            this.props.actions.fileSelected(1, this.props.file);
    }

    handleDblClick(event) {
        // Send this.props.Path to the socket
        const filename = event.target.innerHTML;
        
        if(this.isValidDir(filename, this.props.files)) {
            this.props.actions.fetchFilesRequest(1, this.props.file.Path);
        } else {
            console.log("Invalid double-click");
        }
    }

    render() {
        const { 
            isDragging,
            isOver,
            canDrop,
            connectDropTarget,
            file,
            connectDragSource
        } = this.props;

        const handle = {
            click : this.handleClick.bind(this),
            dblclick : this.handleDblClick.bind(this)
        };

        const style = {
            color: isDragging ? '#288EDF' : '#545454',
            // cursor: canDrop || !(isDragging && isOver) ? "copy" : "no-drop",
            backgroundColor: canDrop && isOver && !isDragging || this.state.isSelected ? 'rgb(207, 241, 252)' : 'transparent',
            backgroundSize: '1rem'
        }

            // background: this.props.file.IsDir ? "url('assets/images/files/dir.svg') no-repeat 3%" :
            //     `url('${assignFileImage(this.props.file.Filename)}') no-repeat 3%`,

        const imgsrc = this.props.file.IsDir ? "assets/images/files/dir.svg" :
                assignFileImage(this.props.file.Filename);

        return connectDragSource(connectDropTarget(
            <li className="file" style={style} onClick={handle.click} onDoubleClick={handle.dblclick}> 
                <img className="file-image" src={imgsrc}/>
                {file.Filename} 
            </li>
        ));
    }
};

export default flow(
    DropTarget('file', fileTarget, injectDropProps),
    DragSource('file', fileSource, injectDragProps)
)(File);
