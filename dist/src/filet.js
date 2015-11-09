var App = React.createClass({displayName: "App",
    render: function() {
        return (
            React.createElement(Login, null)
        )
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
