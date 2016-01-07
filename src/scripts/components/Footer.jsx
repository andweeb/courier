import React, { Component, PropTypes } from 'react';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="footer">
                <input type="text" className="footer-input" placeholder={this.props.cwd}/>
            </div>
        );
    }
}

Footer.propTypes = {
    cwd: PropTypes.string.isRequired
};

export default Footer
