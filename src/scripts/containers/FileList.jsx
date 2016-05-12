import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import File from '../components/File.jsx';

class FileList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hovered: false
        };
        this.setListBorder = this.setListBorder.bind(this);
        this.removeListBorder = this.removeListBorder.bind(this);
    }

    setListBorder() {
        console.log("is over current directory");
        this.setState({ hovered: true });
    }

    removeListBorder() {
        console.log("not over current directory");
        this.setState({ hovered: false });
    }

    render() {
        const { path, files, connId, actions, selected } = this.props;
        const empty = !files.length;

        const FileProps = {
            path,
            connId,
            actions,
            setListBorder: this.setListBorder,
            removeListBorder: this.removeListBorder
        };

        // files.reduce((arr, elem) => {
        //     arr[elem.Filename] = elem;
        //     return arr;
        // }, {})

        return (
            <div id={`file-list-${connId}`} className="file-list">
                <ul className="bulletless">
                    {!empty && files.map(function(file, i) {
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
    connId: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired
};

export default DragDropContext(HTML5Backend)(FileList);
