import { combineReducers } from 'redux';
import { handleEvent } from './login.js';

const initialState = [{
    isAttemptingLogin: false,
    authenticated: false 
}];

function previous(state = initialState, action) {
    return action;
}

const rootReducer = combineReducers({
    handleEvent,
    previous
});

export default rootReducer
