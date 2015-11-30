import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import SideBar from '../components/SideBar.jsx';
import Login from '../components/Login.jsx';

function mapStateToProps(state) {
    const { login } = state;
    return {
        
    };
}

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(login)
    }

    render() {
        return(
            <div id="container"> 
                <SideBar/>
                <Login connId="1"/>
            </div> 
        );
    }
}

// ReactDOM.render(<App/>, document.getElementById('app'));

export default connect(mapStateToProps)(App)
