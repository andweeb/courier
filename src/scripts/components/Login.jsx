import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

class Login extends Component {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            opacity: 1,
            shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)"
        };

        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.callHandleEnterKey = this.callHandleEnterKey.bind(this);
        this.handleConnectClick = this.handleConnectClick.bind(this);
    }

    static defaultProps() {
        return {
            connId  : 0,
        }
    }
	
    onStart() {
        this.setState({
            shadow: "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
            opacity: 0.9
        });
    }

    onStop() {
        this.setState({
            shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)",
            opacity: 1
        });
    }

    handleClearClick() { 
        clean();
    }

    handleConnectClick() { 
        this.props.handlers.handleEnterKey();
    }

    callHandleEnterKey(event) { 
        if(event.keyCode == 13) {
            this.props.handlers.handleEnterKey();
        }
    }

    callHandleChange(event) {
        var input = event.target.id;
        var value = event.target.value;
        this.props.handlers.handleChange(input, value);
    }
	
    render() {
        var drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };
        
        var attributes = {
            type        : "text",
            className   : "login-input",
            onKeyDown   : this.callHandleEnterKey
        };

        var boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div id={this.props.login.connId} style={boxStyle} className="login">
                    <strong className="menubar" > Remote Host Login </strong>
                    <p id={'message-'+this.props.connId}> {this.props.login.message} </p>

                    <input id="hostname" placeholder="Hostname" {...attributes}
                            value={this.props.login.hostname} onChange={this.callHandleChange.bind(this)} />

                    <input id="port" placeholder="Port" {...attributes}
                            value={this.props.login.port} onChange={this.callHandleChange.bind(this)} />

                    <input id="username" placeholder="Username" {...attributes}
                            value={this.props.login.username} onChange={this.callHandleChange.bind(this)} />

                    <input id="password" type="password" placeholder="Password" className="login-input" 
                            value={this.props.login.password} onKeyDown={this.callHandleEnterKey}
                            onChange={this.callHandleChange.bind(this)} />

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

Login.propTypes = {
    login: PropTypes.object.isRequired,
    lastAction: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

export default Login
