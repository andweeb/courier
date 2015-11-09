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
        var inputStyle = {
        };
        return (
            React.createElement(Draggable, React.__spread({handle: "strong"},  drags), 
                React.createElement("div", {className: "login"}, 
                    React.createElement("strong", {className: "menubar"}, " Login "), 
                    React.createElement("input", {id: "hostname", type: "text", placeholder: "Hostname", 
                        value: this.state.hostname, onKeyDown: this.handleEnterKey}), 
                    React.createElement("input", {id: "port", type: "text", placeholder: "Port", 
                        value: this.state.port, onKeyDown: this.handleEnterKey}), 
                    React.createElement("input", {id: "username", type: "text", placeholder: "Username", 
                        value: this.state.username, onKeyDown: this.handleEnterKey}), 
                    React.createElement("input", {id: "password", type: "password", placeholder: "Password", 
                        value: this.state.password, onKeyDown: this.handleEnterKey}), 

                    React.createElement("button", {id: "clear-btn", type: "submit", onclick: "clean()"}, 
						"Clear"	
					), 
					React.createElement("button", {id: "connect-btn", type: "submit", onclick: "connect()"}, 
						"Connect"
					)
	            )
    	    )
        );
    }
});

window.Login = Login;
