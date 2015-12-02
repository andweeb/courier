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

export function handleEvent(event) {
    console.log('--> in handleEvent()');
    console.log(JSON.stringify(event));
    switch (event.fxn) {
        case LOGIN_SUCCESS:
            loginSuccess(event.id, event.data);
            break;
        case LOGIN_FAILURE:
            loginFailure(event.id, event.data);
            break;
        case FETCH_FILES_SUCCESS:
            fetchFilesSuccess(event.id, event.data);
            break;
        case FETCH_FILES_FAILURE:
            fetchFilesFailure(event.id, event.data);
            break;
    }
    return;
}

