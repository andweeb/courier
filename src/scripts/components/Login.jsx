import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { LoginInitialState } from '../constants/InitialStates.js';

class Login extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = LoginInitialState;
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
        this.callChangeHandler = this.callChangeHandler.bind(this);
        this.callEnterKeyHandler = this.callEnterKeyHandler.bind(this);
        this.callClearClickHandler = this.callClearClickHandler.bind(this);
        this.callConnectClickHandler = this.callConnectClickHandler.bind(this);
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

    callClearClickHandler() { 
        this.props.handlers.handleClearClick(); 
    }

    callConnectClickHandler() { 
        this.props.handlers.handleEnterKey();
    }

    callEnterKeyHandler(event) { 
        if(event.keyCode == 13) {
            this.props.handlers.handleEnterKey();
        }
    }

    callChangeHandler(event) {
        let input = event.target.id;
        let value = event.target.value;
        this.props.handlers.handleChange(input, value);
    }
	
    render() {
        const {
            login,
            connId,
            message,
            isAuthenticated,
            isAttemptingLogin
        } = this.props;

        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };
        
        let attributes = {
            type: "text",
            className: "login-input",
            onKeyDown: this.callEnterKeyHandler
        };

        let boxStyle = {
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        let messageStyle = {
            padding: "5px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "100",
            position: "relative",
            color: isAuthenticated ? "green" : "red"
        };

        let loadingStyle = {
            top: "0px",
            left: "43%",
            position: "absolute",
        };

        let modalStyle = {
            visibility: isAttemptingLogin ? "visible" : "hidden",
            opacity: isAttemptingLogin ? "1" : "0"
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div id={login.connId} style={boxStyle} className="login">

                    <div className="login-modal" style={modalStyle}>
                        <div className="sk-folding-cube">
                          <div className="sk-cube1 sk-cube"></div>
                          <div className="sk-cube2 sk-cube"></div>
                          <div className="sk-cube4 sk-cube"></div>
                          <div className="sk-cube3 sk-cube"></div>
                        </div>
                    </div>

                    <strong className="menubar"> Remote Host Login </strong>

                    <input id="hostname" placeholder="Hostname" {...attributes}
                            value={login.hostname} onChange={this.callChangeHandler} />

                    <input id="port" placeholder="Port" {...attributes}
                            value={login.port} onChange={this.callChangeHandler} />

                    <input id="username" placeholder="Username" {...attributes}
                            value={login.username} onChange={this.callChangeHandler} />

                    <input id="password" type="password" placeholder="Password" className="login-input" 
                            value={login.password} onKeyDown={this.callEnterKeyHandler}
                            onChange={this.callChangeHandler} />

                    <div id="login-buttons">
                            <button id="clear-btn" onClick={this.callClearClickHandler}
                                type="submit" className="login-button"> Clear </button>
                         <button id="connect-btn" onClick={this.callConnectClickHandler}
                                type="submit" className="login-button"> Connect </button>
                    </div>

                    <p id={'message-'+connId} style={messageStyle}> {message} </p>
	        </div>
    	    </Draggable>
        );
    }
};

Login.propTypes = {
    login: PropTypes.object.isRequired
}

export default Login
