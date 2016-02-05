import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { path, files, connId, actions, selected } = this.props;
        const FileProps = { path, connId, actions };
        const empty = !files.length;

        // files.reduce((arr, elem) => {
        //     arr[elem.Filename] = elem;
        //     return arr;
        // }, {})

        return (
            <div className="file-list">
                <ul className="bulletless">
                    {!empty && files.map((file, i) =>  {
                        const isSelected = !!selected[file.Filename];
                        const backgroundColor = isSelected ? '#e1edf1' : 'transparent';

                        Object.assign(FileProps, {
                            file,
                            key: i,
                            isSelected,
                            backgroundColor 
                        });

                        return <File {...FileProps}/>
                    })}
                    {empty && <p className="empty-text"> {"< empty >"} </p>}
                </ul>
            </div>
        );
    }
};

FileList.propTypes = { 
    connId: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired
};

export default DragDropContext(HTML5Backend)(FileList);
