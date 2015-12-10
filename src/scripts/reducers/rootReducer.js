import { combineReducers } from 'redux';

const initialState = [{
    isAttemptingLogin: false,
    authenticated: false 
}];

function previous(state = initialState, action) {
    return action;
}

const rootReducer = combineReducers({
    previous
});

export default rootReducer
