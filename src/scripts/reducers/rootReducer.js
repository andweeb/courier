import { combineReducers } from 'redux';
import { handleEvent, previous } from './login.js';

const rootReducer = combineReducers({
    login: handleEvent,
    lastAction: previous
});

export default rootReducer
