import React, { Component, PropTypes } from 'react';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = { cwd: '', valid: true };
        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    isValidDir(newpath, files, currpath) {
        if(newpath.charAt(newpath.length - 1) === '/') {
             newpath = newpath.substring(0, newpath.length-1);
        }

        let newpathSlash = newpath.lastIndexOf('/');
        let dirname = newpath.substr(newpathSlash + 1);
        let currdir = currpath.substring(currpath.lastIndexOf('/') + 1);

        const sharesParentDirectory = currdir === newpath.substring(newpath.search(currdir), newpathSlash);
        if(sharesParentDirectory) {
            const file = files.find(f => f.Filename === dirname);
            return !!file ? file.IsDir : false;
        } else {
            return true;
        }
    }

    handleClick() {
        this.setState({ cwd: this.props.cwd + '/' });
    }

    handleBlur() {
        this.setState({ cwd: '' });
    }

    handleChange(event) {
        this.setState({ cwd: event.target.value, valid: true });
    }

    handleKeyPress(event) {
        const newDirPath = this.state.cwd;
        const { cwd, connId, files, actions } = this.props;

        if(event.keyCode == 8 && event.shiftKey) {
            // Shift and backspace key
            event.preventDefault();
            const enclosingDir = newDirPath.substring(0, newDirPath.lastIndexOf('/'))
            this.setState({ cwd: enclosingDir });
        } else if(event.keyCode == 13) {
            // Enter key
            const pathIsValid = this.isValidDir(newDirPath, files, cwd);
            if(!pathIsValid) { 
                this.setState({ valid: false });
            } else {
                if(newDirPath.charAt(newDirPath.length - 1) !== '/') {
                    this.setState({ cwd: newDirPath + '/' });
                }
                actions.fetchFilesRequest(connId, { path: newDirPath });
            }
        }
    }

    render() {
        const props = {
            type: "text",
            className: "footer-input",
            value: this.state.cwd,
            placeholder: this.props.cwd,
            onBlur: this.handleBlur,
            onClick: this.handleClick,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyPress,
            style: { 
                color: this.state.valid ? '' : 'red' 
            }
        };

        return(
            <div className="footer">
                <input {...props} />
            </div>
        );
    }
}

Footer.propTypes = {
    cwd: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    connId: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
};

export default Footer
