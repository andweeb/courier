var Draggable = ReactDraggable;
var Login = React.createClass({
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
        return (
            <Draggable handle="strong" {...drags}>
                <div className="login">
                    <strong className="menubar" > Login </strong>
                    <input id="hostname" type="text" placeholder="Hostname" 
                        value={this.state.hostname} onKeyDown={this.handleEnterKey}/>
                    <input id="port" type="text" placeholder="Port" 
                        value={this.state.port} onKeyDown={this.handleEnterKey}/>
                    <input id="username" type="text" placeholder="Username" 
                        value={this.state.username} onKeyDown={this.handleEnterKey}/>
                    <input id="password" type="password" placeholder="Password" 
                        value={this.state.password} onKeyDown={this.handleEnterKey}/>

                    <button id="clear-btn" type="submit" onclick="clean()">
						Clear	
					</button>
					<button id="connect-btn" type="submit" onclick="connect()">
						Connect
					</button>
	            </div>
    	    </Draggable>
        );
    }
});

window.Login = Login;
