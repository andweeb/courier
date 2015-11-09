var App = React.createClass({displayName: "App",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(Login, null)
            )
        )
    }
});

window.App = App;
