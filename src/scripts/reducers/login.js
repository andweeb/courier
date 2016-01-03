import { 
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    FETCH_FILES_REQUEST,
    FETCH_FILES_FAILURE,
    FETCH_FILES_SUCCESS,
} from '../constants/ActionTypes';

import {
    loginRequest,
    loginSuccess,
    loginFailure,
    fetchFilesSuccess,
    fetchFilesFailure,
} from '../actions/login.js';

import { StoreInitialState } from '../constants/InitialStates.js';

export function previous(state = StoreInitialState, action) {
    return action;
}

export function handleEvent(state = StoreInitialState, action) {
    console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling action:');
    console.dir(action);

    switch (action.type) {
        case LOGIN_REQUEST: 
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the login request action');
            return Object.assign({}, state, {
                isAttemptingLogin: true
            });

        case LOGIN_SUCCESS:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the login success action');
            return Object.assign({}, state, {
                message: action.data[0],
                isAttemptingLogin: false,
                isAuthenticated: true
            });

        case LOGIN_FAILURE:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the login failure action');
            return Object.assign({}, state, {
                message: action.data[0],
                isAttemptingLogin: false,
                isAuthenticated: false,
            });

        case FETCH_FILES_SUCCESS:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the fetch files success action');
            return Object.assign({}, state, {
                type: FETCH_FILES_SUCCESS,
                files: action.data,
            });

        case FETCH_FILES_FAILURE:
            console.log('[IN REDUCERS/LOGIN.JS] -> \nHandling the fetch files failure action');
            return Object.assign({}, state, {
                type: FETCH_FILES_FAILURE,
                files: action.data,
            });

        default:
            console.log(`[IN REDUCERS/LOGIN.JS] -> \nUnhandled action type error: ${action.type}`);
            return state;
    }
}
