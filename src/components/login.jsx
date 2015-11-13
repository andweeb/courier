import React from 'react'
import Draggable from 'react-draggable'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
	        deltaPosition: {
	          top: 0, left: 0
	        },
	        activeDrags: 0,
        }
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handleConnectClick = this.handleConnectClick.bind(this);
    }

	static defaultProps() {
	    return {
	        connId  : 0,
	    }
	}
	
	handleDrag(e, ui) {
	    var left = this.state.postition.left;
	    var top = this.state.postition.top;
	    this.setState({
	        deltaPosition: {
	          left: left + ui.deltaX,
	          top: top + ui.deltaY,
	        }
	    });
	}
	
    onStart() {
        this.setState({
            activeDrags: ++this.state.activeDrags
        });
	}
	
    onStop() {
        this.setState({
            activeDrags: --this.state.activeDrags
        });
	}
	
	handleEnterKey(ev) {
	    if(ev.keyCode == 13) {
	        connect(this.props.connId);
	    }
	}
	
	handleClearClick() { clean(); }
	handleConnectClick() { connect(this.props.connId); }
	
    render() {
        var drags = {onStart: this.onStart, onStop: this.onStop};
        var {top, left} = this.state.deltaPosition; 
        var props = {
            type        : "text",
            className   : "login-input",
        };
        return (
            <Draggable handle="strong" {...drags}>
                <div id={this.props.connId} className="login">
                    <strong className="menubar" > Remote Host Login </strong>
                    <input id="hostname" placeholder="Hostname" {...props}
                        onKeyDown={this.handleEnterKey}/>
                    <input id="port" placeholder="Port" {...props}
                        onKeyDown={this.handleEnterKey}/>
                    <input id="username" placeholder="Username" {...props}
                        onKeyDown={this.handleEnterKey}/>
                    <input id="password" type="password" placeholder="Password" 
                        onKeyDown={this.handleEnterKey} className="login-input"/>

                    <div id="login-buttons">
                            <button id="clear-btn" onClick={this.handleClearClick} 
                            type="submit" className="login-button"> Clear </button>
                         <button id="connect-btn" onClick={this.handleConnectClick}
                            type="submit" className="login-button"> Connect </button>
                    </div>
	            </div>
    	    </Draggable>
        );
    }
};

export default Login;
