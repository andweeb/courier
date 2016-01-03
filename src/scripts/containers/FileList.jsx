import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="bulletless">
                { this.props.files.map((file, i) => <File key={i} filename={file.Filename} isDir={file.IsDir}/> )}
            </ul>
        );
    }
};

FileList.propTypes = { files: PropTypes.array.isRequired };
export default DragDropContext(HTML5Backend)(FileList);
