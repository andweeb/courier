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

    isValidDir(fullpath, files) {
        const dirname = fullpath.substr(fullpath.lastIndexOf('/')+1);
        for(let i = 0, l = files.length; i < l; i++) {
            if(dirname === files[i].Filename)
                return files[i].IsDir;
        }
        return false;
    }

    handleClick() {
        this.setState({ cwd: this.props.cwd+'/' });
    }

    handleBlur() {
        this.setState({ cwd: '' });
    }

    handleChange(event) {
        this.setState({ cwd: event.target.value, valid: true });
    }

    handleKeyPress(event) {
        const { files, actions } = this.props;
        if(event.keyCode == 13) {
            const isValid = this.isValidDir(this.state.cwd, files);
            if(isValid) { 
                actions.fetchFilesRequest(1, { path: this.state.cwd });
            } else {
                this.setState({ valid: false });
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
    cwd: PropTypes.string.isRequired
};

export default Footer
