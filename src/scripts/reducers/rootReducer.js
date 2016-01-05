import { combineReducers } from 'redux';
import { handleLoginEvent, previous } from './login.js';
import { handleFileEvent } from './file.js';

const rootReducer = combineReducers({
    file: handleFileEvent,
    login: handleLoginEvent,
    lastAction: previous
});

export default rootReducer
