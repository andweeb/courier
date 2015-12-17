import { 
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    FETCH_FILES_REQUEST,
    FETCH_FILES_FAILURE,
    FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

import {
    loginSuccess,
    loginFailure,
    fetchFilesSuccess,
    fetchFilesFailure,
} from '../actions/login.js';

import InitialState from '../constants/InitialState.js';

export function previous(state = InitialState, action) {
    return Object.assign({}, state, {
        action
    });
}

export function handleEvent(state = InitialState, action) {
    console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling action:');
    console.dir(action);
    switch (action.fxn) {
        case LOGIN_SUCCESS:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the login success action');
            return Object.assign({}, state, {
                id: action.id,
                type: LOGIN_SUCCESS,
                message: action.data,
                action
            });
        case LOGIN_FAILURE:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the login failure action');
            return Object.assign({}, state, {
                id: action.id,
                type: LOGIN_FAILURE,
                message: action.data,
                action
            });
        case FETCH_FILES_SUCCESS:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the fetch files success action');
            return Object.assign({}, state, {
                id: action.id,
                type: FETCH_FILES_SUCCESS,
                data: action.data,
                action
            });
        case FETCH_FILES_FAILURE:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the fetch files failure action');
            return Object.assign({}, state, {
                id: action.id, 
                type: FETCH_FILES_FAILURE,
                data: action.data,
                action
            });
        default:
            console.log(`[IN ACTIONS/LOGIN.JS] -> \nUnhandled action error: ${action.fxn}`);
            return state;
    }
}
