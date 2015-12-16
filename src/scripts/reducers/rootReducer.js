import { combineReducers } from 'redux';
import { handleEvent } from './login.js';

const initialState = [{
    hostname: "",
    port: "",
    username: "",
    password: "",
    type: "",
    message: "",
    isAttemptingLogin: false, 
    isAuthenticated: false,
    opacity: 1,
    shadow: "4px 4px 20px -1px rgba(0,0,0,0.25)",
}];

function previous(state = initialState, action) {
    return action;
}

const rootReducer = combineReducers({
    handleEvent,
    previous
});

export default rootReducer
