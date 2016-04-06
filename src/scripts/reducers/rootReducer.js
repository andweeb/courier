import { combineReducers } from 'redux';
import { handleLoginEvent, previous } from './login.js';
import { handleFileEvent } from './file.js';
import { handleWindowEvent } from './window.js';

const rootReducer = combineReducers({
    file: handleFileEvent,
    login: handleLoginEvent,
    window: handleWindowEvent,
    lastAction: previous,
});

export default rootReducer
