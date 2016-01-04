import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/function/flow';
import Extensions from '../constants/Extensions.js';

// Implements the drag source contract
const fileSource = {
    beginDrag(props) {
        return { filename: props.filename };
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
        return { filename: props.filename };
    },

    canDrop(props) {
        return props.isDir;
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
    componentDidMount() {
        // Assign a specific file image to the drag preview of the file
        const image = new Image(10, 10);
        image.src = this.props.isDir ? "assets/images/files/dir.svg" : assignFileImage(this.props.filename);
        image.onload = () => this.props.connectDragPreview(image);
    }

    render() {
        const { isDragging, isOver, canDrop, connectDropTarget, filename, connectDragSource } = this.props;
        const style = {
            color: isDragging ? 'rgb(135,193,248)' : '',
            // cursor: canDrop && isOver ? "copy" : "no-drop",
            backgroundColor: canDrop && isOver ? 'rgb(207, 241, 252)' : 'transparent',
            background: this.props.isDir ? "url('assets/images/files/dir.svg') no-repeat 1% 50%" :
                        `url('${assignFileImage(this.props.filename)}') no-repeat 1% 50%`,
            backgroundSize: '1rem'
        }

        return connectDragSource(connectDropTarget(
            <li className="file" style={style}> {filename} </li>
        ));
    }
};

export default flow(
    DropTarget('file', fileTarget, injectDropProps),
    DragSource('file', fileSource, injectDragProps)
)(File);
