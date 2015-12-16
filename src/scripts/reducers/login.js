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
} from '../actions/login.js'

const initialState = [
    {
        isAttemptingLogin: false,
        authenticated: false 
    }
];

export function handleEvent(state = initialState, event) {
    console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling event:');
    console.dir(state);
    console.dir(event);
    switch (event.fxn) {
        case LOGIN_SUCCESS:
            return loginSuccess(event.id, event.data);
            break;
        case LOGIN_FAILURE:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nHandling the login failure action');
            return loginFailure(event.id, event.data);
            break;
        case FETCH_FILES_SUCCESS:
            return fetchFilesSuccess(event.id, event.data);
            break;
        case FETCH_FILES_FAILURE:
            return fetchFilesFailure(event.id, event.data);
            break;
        default:
            console.log('[IN ACTIONS/LOGIN.JS] -> \nUnhandled event error!');
            return state;
            break;
    }
    return;
}
