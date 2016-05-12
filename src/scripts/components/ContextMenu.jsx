import React, { Component, PropTypes } from 'react';

class ContextMenu extends Component {
    render() {
        console.log('Context Menu children: ');
        console.dir(this.props.children);
        return (
            <div className="context-menu">
                { this.props.children }
            </div>
        );
    }
};

ContextMenu.propTypes = {

}

export default ContextMenu

