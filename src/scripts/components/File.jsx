import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/function/flow';

// Implements the drag source contract
const fileSource = {
    beginDrag(props) {
        return { filename: props.filename };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if(dropResult) {
            console.log(`You dropped ${item.filename} into ${dropResult.filename}!`);
            console.dir(dropResult);
        }
    }
};

const fileTarget = {
    drop(props) {
        return { filename: props.filename };
    },

    canDrop(props) {
        return props.isDir;
    }
};

function injectDropProps(connect, monitor) {
    return { 
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

// Specifies props to inject into the component
function injectDragProps(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

class File extends Component {
    render() {
        const { isDragging, isOver, canDrop, connectDropTarget, filename, connectDragSource } = this.props;
        const style = {
            fontSize: isDragging ? '14px' : '',
            backgroundColor: canDrop && isOver ? 'rgb(207, 241, 252)' : 'transparent'
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
