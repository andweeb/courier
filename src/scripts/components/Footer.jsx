import React, { Component, PropTypes } from 'react';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = { cwd: '' };
    }

    isValidDir(fullpath) {
        const dirname = fullpath.substr(fullpath.lastIndexOf('/')+1);
        console.log("CHECKING IF "+dirname+" IS A VALID DIRECTORY");
    }

    handleClick() {
        this.setState({ cwd: this.props.cwd+'/' });
    }

    handleBlur() {
        this.setState({ cwd: '' });
    }

    handleChange(event) {
        this.setState({ cwd: event.target.value });
    }

    handleKeyPress(event) {
        // if(event.keyCode == 13 && this.isValidDir(this.state.cwd)) {
        if(event.keyCode == 13) {
            this.props.actions.fetchFilesRequest(1, this.state.cwd);
        }
    }

    render() {
        const handlers = {
            onClick: this.handleClick.bind(this),
            onBlur: this.handleBlur.bind(this),
            onChange: this.handleChange.bind(this),
            onKeyDown: this.handleKeyPress.bind(this)
        };

        return(
            <div className="footer">
                <input type="text" className="footer-input" placeholder={this.props.cwd} 
                    value={this.state.cwd} {...handlers}/>
            </div>
        );
    }
}

Footer.propTypes = {
    cwd: PropTypes.string.isRequired
};

export default Footer
