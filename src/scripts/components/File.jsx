import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

// Implements the drag source contract
const fileSource = {
    beginDrag(props) {
        return { filename: props.filename };
    }
};

// Specifies props to inject into the component
function injectProps(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

const propTypes = {
    filename: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class File extends Component {
    render() {
        const { isDragging, connectDragSource, filename } = this.props;
        let dragging = isDragging ? "I AM BEING DRAGGED" : "DONT TOUCH ME";
        return connectDragSource( 
            <li className="file">{filename}</li>
        );
    }
};

File.propTypes = propTypes;
export default DragSource('file', fileSource, injectProps)(File);
