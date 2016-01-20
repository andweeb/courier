import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = {
            files: this.props.files,
            actions: this.props.actions
        };

        return (
            <div className="file-list">
                <ul className="bulletless">
                    { this.props.files.map((file, i) => 
                        <File key={i} file={file} {...props} /> 
                    )}
                </ul>
            </div>
        );
    }
};

FileList.propTypes = { 
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default DragDropContext(HTML5Backend)(FileList);
