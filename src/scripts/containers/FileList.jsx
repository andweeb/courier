import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { files, actions, selected } = this.props;
        const empty = !files.length;
        const props = {
            files: files,
            actions: actions
        };

        return (
            <div className="file-list">
                <ul className="bulletless">
                    {!empty && files.map((file, i) =>  {
                        const isSelected = !!selected[file.Filename];
                        const bgc = isSelected ? 'rgb(207, 241, 252)' : 'transparent';
                        return <File key={i} file={file} isSelected={isSelected} bgc={bgc} {...props}/>
                    })}
                    {empty && <p className="empty-text"> {"< empty >"} </p>}
                </ul>
            </div>
        );
    }
};

FileList.propTypes = { 
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired
};

export default DragDropContext(HTML5Backend)(FileList);
