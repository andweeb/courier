var Draggable = ReactDraggable;
var Filet = React.createClass({
	getInitialState: function() {
	    return {
	        deltaPosition: {
	          top: 0, left: 0
	        },
	        activeDrags: 0,

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

    render: function() {
        var drags = {onStart: this.onStart, onStop: this.onStop};
        var {top, left} = this.state.deltaPosition; 
        return (
	            <Draggable handle="strong" {...drags}>
                    <div className="login">
	                  <strong className="menubar" >:^)</strong>
		              <div> hi </div>
		            </div>
		        </Draggable>
        );
    }
});

ReactDOM.render(<Filet/>, document.getElementById('app'));
