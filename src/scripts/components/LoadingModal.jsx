// Example style:
// visibility: isLoading ? "visible" : "hidden",
// opacity: isLoading ? "1" : "0"

import React, { Component, PropTypes } from 'react';

class LoadingModal extends Component {
    render() {
        return (
            <div className="login-modal" style={this.props.styles.modal}>
                <div className="sk-folding-cube" style={this.props.styles.cube}>
                  <div className="sk-cube1 sk-cube"></div>
                  <div className="sk-cube2 sk-cube"></div>
                  <div className="sk-cube4 sk-cube"></div>
                  <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        );
    }
};

LoadingModal.propTypes = {
    styles: PropTypes.object.isRequired
};

export default LoadingModal
