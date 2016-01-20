import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
    }

    renderFiles(files) {
        if(files.length) {
            return this.props.files.map((file, i) => <File key={i} file={file} {...props} />);
        } else {
            return (<p className="empty-text"> {"< empty >"} </p>);
        }
    }

    render() {
        const empty = !this.props.files.length;
        const props = {
            files: this.props.files,
            actions: this.props.actions
        };

        return (
            <div className="file-list">
                <ul className="bulletless">
                    {!empty && this.props.files.map((file, i) => <File key={i} file={file} {...props}/>)} 
                    {empty && <p className="empty-text"> {"< empty >"} </p>}
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
