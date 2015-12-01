import { combineReducers } from 'redux';
import login from './login';

function action(state = null, action) {
    return action;
}

const rootReducer = combineReducers({
    login,
    action
});

export default rootReducer
