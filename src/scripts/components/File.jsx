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

    handleClick() {
        this.setState({ isSelected: !this.state.isSelected });
        this.state.isSelected ? this.props.actions.fileDeselected(1, this.props.file) :
            this.props.actions.fileSelected(1, this.props.file);
    }

    render() {
        const { isDragging, isOver, canDrop, connectDropTarget, file, connectDragSource } = this.props;
        const style = {
            color: isDragging ? 'rgb(135,193,248)' : '',
            // cursor: canDrop || !(isDragging && isOver) ? "copy" : "no-drop",
            backgroundColor: canDrop && isOver || this.state.isSelected ? 'rgb(207, 241, 252)' : 'transparent',
            background: this.props.file.IsDir ? "url('assets/images/files/dir.svg') no-repeat 1% 50%" :
                        `url('${assignFileImage(this.props.file.Filename)}') no-repeat 1% 50%`,
            backgroundSize: '1rem'
        }

        return connectDragSource(connectDropTarget(
            <li className="file" style={style} onClick={this.handleClick.bind(this)}> 
                {file.Filename} 
            </li>
        ));
    }
};

export default flow(
    DropTarget('file', fileTarget, injectDropProps),
    DragSource('file', fileSource, injectDragProps)
)(File);
