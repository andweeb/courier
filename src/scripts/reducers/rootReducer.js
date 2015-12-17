import { combineReducers } from 'redux';
import { handleEvent, previous } from './login.js';

console.log('handleEvent: '+handleEvent);
console.log('previous: '+previous);

const rootReducer = combineReducers({
    login: handleEvent,
    lastAction: previous
});

export default rootReducer
