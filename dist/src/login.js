var Draggable = ReactDraggable;
var Login = React.createClass({displayName: "Login",
    getInitialState: function() {
        return {
            deltaPosition: {
              top: 0, left: 0
            },
            activeDrags: 0,
        }
    },

    getDefaultProps: function() {
        return {
            hostname: "",
            port    : "22",
            username: "",
            password: "",
        }
    },

    handleDrag: function (e, ui) {
        var left = this.state.postition.left;
        var top = this.state.postition.top;
        this.setState({
            deltaPosition: {
              left: left + ui.deltaX,
              top: top + ui.deltaY,
            }
        });
    },

    onStart: function() {
      this.setState({activeDrags: ++this.state.activeDrags});
    },

    onStop: function() {
      this.setState({activeDrags: --this.state.activeDrags});
    },
    
    handleEnterKey: function(ev) {
        if(ev.keyCode == 13) {
            console.log("Pressed the enter key!");
            connect();
        }
    },

    render: function() {
        var drags = {onStart: this.onStart, onStop: this.onStop};
        var {top, left} = this.state.deltaPosition; 
        var props = {
            type        : "text",
            className   : "login-input",
        };
        return (
            React.createElement(Draggable, React.__spread({handle: "strong"},  drags), 
                React.createElement("div", {className: "login"}, 
                    React.createElement("strong", {className: "menubar"}, " Remote Host Login "), 
                    React.createElement("input", React.__spread({id: "hostname", placeholder: "Hostname"},  props, 
                        {value: this.state.hostname, onKeyDown: this.handleEnterKey})), 
                    React.createElement("input", React.__spread({id: "port", placeholder: "Port"},  props, 
                        {value: this.state.port, onKeyDown: this.handleEnterKey})), 
                    React.createElement("input", React.__spread({id: "username", placeholder: "Username"},  props, 
                        {value: this.state.username, onKeyDown: this.handleEnterKey})), 
                    React.createElement("input", {id: "password", type: "password", placeholder: "Password", 
                        value: this.state.password, onKeyDown: this.handleEnterKey, 
                        className: "login-input"}), 

                    React.createElement("div", {id: "login-buttons"}, 
	                    React.createElement("button", {id: "clear-btn", type: "submit", onclick: "clean()", 
                            className: "login-button"}, " Clear "), 
						React.createElement("button", {id: "connect-btn", type: "submit", onclick: "connect()", 
                            className: "login-button"}, " Connect ")
                    )
	            )
    	    )
        );
    }
});

window.Login = Login;
